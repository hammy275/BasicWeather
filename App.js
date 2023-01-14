import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {Component} from "react";
import LocationHeader from "./LocationHeader";
import { Provider as PaperProvider } from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {getForecast, toGrid} from "./WeatherAPI";


class App extends Component {
    constructor(props) {
        super(props);

        this.setStateFromKey = this.setStateFromKey.bind(this);
        this.fetchWeather = this.fetchWeather.bind(this);

        this.state = {
            lat: "",
            lon: "",
            text: ""
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

        let forecast = await getForecast(gridPos[0], gridPos[1], gridPos[2]);
        let cast = "";
        for (let f of forecast) {
            cast += f.detailedForecast + "\n";
        }

        this.setStateFromKey("text", cast);


    }

    render() {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <PaperProvider>
                        <LocationHeader setStateFromKey={this.setStateFromKey} lat={this.state.lat} lon={this.state.lon}
                            fetchWeather={this.fetchWeather}/>
                        <Text>{this.state.text}</Text>
                        <StatusBar style="auto"/>
                    </PaperProvider>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;