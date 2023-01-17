import {Component} from "react";
import {ProgressBar, Text} from "react-native-paper";
import {View} from "react-native";

/**
 * Props:
 *
 * loadProgress: Progress to loading bar from 0.0 to 1.0. Value of <= 0.0 hides it.
 * errorMessage: An error message to display (only displayed if truthy)
 */
class ErrorFooter extends Component {
    render() {
        let message = undefined;
        if (this.props.errorMessage) {
            message = <Text style={{textAlign: "center"}} variant="titleSmall">{this.props.errorMessage}</Text>
        }
        return (
            <View style={{width: "100%"}}>
                {message}
                <ProgressBar visible={this.props.loadProgress > 0} progress={this.props.loadProgress}/>
            </View>
        );
    }
}

export default ErrorFooter;