import {Component} from "react";
import {View} from "react-native";
import {Text} from "react-native-paper";
import ListImage from "react-native-paper/src/components/List/ListImage";

/**
 * Props:
 *
 * period: period.item from WeatherAPI
 */
class WeatherDescription extends Component {
    render() {
        return (
            <View style={{flexDirection: 'row', marginVertical: 12, alignItems: "center"}}>
                <View style={{flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
                    <ListImage source={{uri: this.props.period.icon}}/>
                    <Text>{this.props.period.temperature + "°" + this.props.period.temperatureUnit}</Text>
                </View>
                <Text style={{marginLeft: 4, marginRight: 60}}>
                    <Text style={{fontWeight: "bold"}}>{this.props.period.name + ": "}</Text>
                    {this.props.period.detailedForecast}
                </Text>
            </View>
        );
    }
}


export default WeatherDescription