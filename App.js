import {Appearance, FlatList, StyleSheet} from 'react-native';
import {Component} from "react";
import LocationHeader from "./LocationHeader";
import {Provider as PaperProvider, MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {getForecast, toGrid} from "./WeatherAPI";
import WeatherDescription from "./WeatherDescription";
import ErrorFooter from "./ErrorFooter";


class App extends Component {
    constructor(props) {
        super(props);

        this.setStateFromKey = this.setStateFromKey.bind(this);
        this.fetchWeather = this.fetchWeather.bind(this);
        this.clearLoading = this.clearLoading.bind(this);

        Appearance.addChangeListener(() => {
            this.forceUpdate();
        });

        this.state = {
            lat: "",
            lon: "",
            error: "",
            forecasts: [],
            loadProgress: 0
        };
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
    }

    render() {
        const theme = Appearance.getColorScheme() === "dark" ? MD3DarkTheme : MD3LightTheme;
        return (
            <SafeAreaProvider>
                <PaperProvider style={{container: {flex: 1}}}>
                    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
                        <LocationHeader setStateFromKey={this.setStateFromKey} lat={this.state.lat} lon={this.state.lon}
                                        fetchWeather={this.fetchWeather}/>
                        <FlatList data={this.state.forecasts} renderItem={(data) => {
                            return <WeatherDescription period={data.item}/>
                        }}/>
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