import {Appearance, FlatList, StyleSheet} from 'react-native';
import {Component} from "react";
import LocationHeader from "./LocationHeader";
import {Provider as PaperProvider, MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {getForecast, toGrid} from "./WeatherAPI";
import WeatherDescription from "./WeatherDescription";


class App extends Component {
    constructor(props) {
        super(props);

        this.setStateFromKey = this.setStateFromKey.bind(this);
        this.fetchWeather = this.fetchWeather.bind(this);

        Appearance.addChangeListener(() => {
            this.forceUpdate();
        });

        this.state = {
            lat: "",
            lon: "",
            forecasts: []
        };
    }

    setStateFromKey(key, value) {
        this.setState((state) => {
            state[key] = value;
            return state;
        });
    }

    async fetchWeather() {
        let lat = parseFloat(this.state.lat);
        let lon = parseFloat(this.state.lon);
        if (isNaN(lat) || isNaN(lon)) {
            this.setStateFromKey("error", "Latitude and/or Longitude aren't numbers!");
            return;
        }

        let gridPos = await toGrid(lat, lon);
        if (gridPos === null) {
            this.setStateFromKey("error", "Couldn't fetch grid position! Do you have network connectivity?");
            return;
        }

        let forecasts = await getForecast(gridPos[0], gridPos[1], gridPos[2]);
        this.setStateFromKey("forecasts", forecasts);



    }

    render() {
        const theme = Appearance.getColorScheme() === "dark" ? MD3DarkTheme : MD3LightTheme;
        return (
            <SafeAreaProvider>
                <PaperProvider>
                    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
                        <LocationHeader setStateFromKey={this.setStateFromKey} lat={this.state.lat} lon={this.state.lon}
                                        fetchWeather={this.fetchWeather}/>
                        <FlatList data={this.state.forecasts} renderItem={(data) => {
                            return <WeatherDescription period={data.item}/>
                        }}/>
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

export default App;