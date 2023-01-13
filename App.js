import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {Component} from "react";
import LocationHeader from "./LocationHeader";
import { Provider as PaperProvider } from 'react-native-paper';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";


class App extends Component {
    constructor(props) {
        super(props);

        this.setStateFromKey = this.setStateFromKey.bind(this);

        this.state = {
            lat: "",
            lon: ""
        };
    }

    setStateFromKey(key, value) {
        this.setState((state) => {
            state[key] = value;
            return state;
        });
    }

    render() {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <PaperProvider>
                        <LocationHeader setStateFromKey={this.setStateFromKey} lat={this.state.lat} lon={this.state.lon}/>
                        <Text>Open up App.js to start working on your app!</Text>
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