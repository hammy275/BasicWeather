import {Component} from "react";
import {View, PermissionsAndroid, Platform} from "react-native";
import {IconButton, TextInput, ProgressBar} from "react-native-paper";
import Geolocation from "react-native-geolocation-service"

// Returns a Promise, so we can async it without callbacks.
async function getLocation() {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition((success) => {
            resolve(success);
        }, (error) => {
            reject(error);
        });
    });
}


/**
 * Props:
 *
 * setStateFromKey: Sets the state for a given key-value pair in App
 * lat: Latitude
 * lon: Longitude
 * fetchWeather: fetchWeather function
 */
class LocationHeader extends Component {
    render() {
        return (
        <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center"}}>
            <TextInput
                onChangeText={(text) => this.props.setStateFromKey("lat", text)}
                placeholder="Latitude"
                keyboardType="numeric"
                value={this.props.lat}
            />
            <TextInput
                onChangeText={(text) => this.props.setStateFromKey("lon", text)}
                placeholder="Longitude"
                keyboardType="numeric"
                value={this.props.lon}
            />
            <IconButton
                icon="crosshairs-gps"
                onPress={async () => {
                    try {
                        if (Platform.OS === "android") {
                            let hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                            if (!hasPermission) {
                                let permissionResult = await PermissionsAndroid.request(
                                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                                    {
                                        title: "BasicWeather Location Permission",
                                        message:
                                            "We need access to your location to retrieve weather for your location!",
                                        buttonNeutral: "Ask Me Later",
                                        buttonNegative: "Cancel",
                                        buttonPositive: "Ok",
                                    },
                                );
                                if (permissionResult !== PermissionsAndroid.RESULTS.GRANTED) {
                                    throw "No Permission!";
                                }
                            }
                        } else if (Platform.OS === "ios") {
                            // iOS untested due to no iOS testing being done on this app.
                            await Geolocation.requestAuthorization("whenInUse");
                        }
                        this.props.setStateFromKey("loadProgress", 0.1);
                        let position = await getLocation();
                        this.props.setStateFromKey("lat", position.coords.latitude.toString());
                        this.props.setStateFromKey("lon", position.coords.longitude.toString());
                        this.props.setStateFromKey("loadProgress", 0.35);
                        this.props.fetchWeather();
                    } catch (e) {
                        if (e === "No Permission!") {
                            this.props.setStateFromKey("error", "Can't get location, please grant the permission!");
                        } else {
                            this.props.setStateFromKey("error", "Couldn't retrieve the device's location!");
                        }
                        this.props.setStateFromKey("loadProgress", 0);
                    }

                }
                }
            />
            <IconButton
                icon="refresh"
                onPress={this.props.fetchWeather}
            />
        </View>
        );
    }
}

export default LocationHeader;