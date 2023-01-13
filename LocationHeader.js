import {Component} from "react";
import {View} from "react-native";
import {IconButton, TextInput} from "react-native-paper";
import * as Location from 'expo-location';
import {getCurrentPositionAsync, requestForegroundPermissionsAsync, useForegroundPermissions} from "expo-location";


/**
 * Props:
 *
 * setStateFromKey: Sets the state for a given key-value pair in App
 * lat: Latitude
 * lon: Longitude
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
                      await requestForegroundPermissionsAsync();
                      let position = await getCurrentPositionAsync();
                      this.props.setStateFromKey("lat", position.coords.latitude.toString());
                      this.props.setStateFromKey("lon", position.coords.longitude.toString());
                  } catch {
                      this.props.setStateFromKey("error", "Couldn't get location! Did you give permission?");
                  }

              }
              }
              />
          </View>
        );
    }
}

export default LocationHeader;