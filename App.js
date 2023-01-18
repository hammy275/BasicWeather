import {Appearance, FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {Component} from "react";
import LocationHeader from "./LocationHeader";
import {Provider as PaperProvider, MD3LightTheme, MD3DarkTheme, Modal, Portal, Text} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {getForecast, toGrid} from "./WeatherAPI";
import WeatherDescription from "./WeatherDescription";
import ErrorFooter from "./ErrorFooter";
import AsyncStorage from '@react-native-async-storage/async-storage';


class App extends Component {
    constructor(props) {
        super(props);

        this.setStateFromKey = this.setStateFromKey.bind(this);
        this.fetchWeather = this.fetchWeather.bind(this);
        this.clearLoading = this.clearLoading.bind(this);
        this.loadFromStorage = this.loadFromStorage.bind(this);
        this.refetchWeather = this.refetchWeather.bind(this);
        this.onInfo = this.onInfo.bind(this);

        Appearance.addChangeListener(() => {
            this.forceUpdate();
        });

        this.state = {
            lat: "",
            lon: "",
            error: "",
            forecasts: [],
            loadProgress: 0,
            isRefreshing: false,
            modalMessage: ""
        };

        this.loadFromStorage();
    }

    async loadFromStorage() {
        try {
            let lat = await AsyncStorage.getItem("lat");
            let lon = await AsyncStorage.getItem("lon");
            if (lat !== null) {
                this.setStateFromKey("lat", lat);
            }
            if (lon !== null) {
                this.setStateFromKey("lon", lon);
            }

            if (lat !== null && lon !== null) {
                await this.fetchWeather();
            }
        } catch {
            this.setStateFromKey("error", "Failed to retrieve past data from storage!");
        }

    }

    setStateFromKey(key, value) {
        // Special check to clear error message after a few seconds when one is set
        if (key === "error" && value) {
            setTimeout(() => {
                this.setStateFromKey("error", "");
            }, 3000);
        }


        this.setState((state) => {
            state[key] = value;
            return state;
        });
    }

    clearLoading(delay) {
        if (delay === undefined) {
            delay = 0;
        }
        setTimeout(() => {
            this.setStateFromKey("loadProgress", 0);
        }, delay);
    }

    async fetchWeather() {
        this.setStateFromKey("forecasts", []);
        this.setStateFromKey("loadProgress", 0.35);
        let lat = parseFloat(this.state.lat);
        let lon = parseFloat(this.state.lon);
        if (isNaN(lat) || isNaN(lon)) {
            this.setStateFromKey("error", "Please set a valid latitude and longitude!");
            this.clearLoading();
            return;
        }

        let gridPos = await toGrid(lat, lon);
        if (gridPos === null) {
            this.setStateFromKey("error", "Couldn't reach the internet!");
            this.clearLoading();
            return;
        }
        this.setStateFromKey("loadProgress", 0.55);

        let forecasts = await getForecast(gridPos[0], gridPos[1], gridPos[2]);
        this.setStateFromKey("forecasts", forecasts);
        this.setStateFromKey("loadProgress", 1.0);
        this.clearLoading();

        // Save lat and lon to storage if we successfully grab the weather using them
        await this.saveLatLonToStorage(this.state.lat, this.state.lon);
    }

    refetchWeather() {
        this.setStateFromKey("isRefreshing", true);
        this.fetchWeather().then(() => {
            this.setStateFromKey("isRefreshing", false);
        });
    }

    async saveLatLonToStorage(lat, lon) {
        await AsyncStorage.setItem("lat", lat);
        await AsyncStorage.setItem("lon", lon);
    }

    onInfo() {
        this.setStateFromKey("modalMessage",
`BasicWeather by hammy275.

Released under the GNU GPLv3.
Weather data and images provided by the National Weather Service (NOAA).
`
        );
    }

    render() {
        const theme = Appearance.getColorScheme() === "dark" ? MD3DarkTheme : MD3LightTheme;
        return (
            <SafeAreaProvider>
                <PaperProvider style={{container: {flex: 1}}}>
                    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
                        <Portal>
                            <Modal
                                   contentContainerStyle={{alignSelf: "center", backgroundColor: theme.colors.background, padding: 48}}
                                visible={this.state.modalMessage !== ""} onDismiss={() => this.setStateFromKey("modalMessage", "")}>
                                <View>
                                    <Text style={{textAlign: "center"}} variant="titleSmall">{this.state.modalMessage}</Text>
                                </View>
                            </Modal>
                        </Portal>
                        <LocationHeader setStateFromKey={this.setStateFromKey} lat={this.state.lat} lon={this.state.lon}
                                        fetchWeather={this.fetchWeather} onInfo={this.onInfo}/>
                        <FlatList data={this.state.forecasts} renderItem={(data) => {
                            return <WeatherDescription period={data.item}/>
                        }} refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.refetchWeather}/>}/>
                        <ErrorFooter errorMessage={this.state.error} style={footerStyle} loadProgress={this.state.loadProgress}/>
                    </SafeAreaView>
                </PaperProvider>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const footerStyle = StyleSheet.create({
    height: 24
});

export default App;