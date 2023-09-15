import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
var viewWidth = Dimensions.get('window').width; //full width
var viewHeight = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
    driverTypesContainer: {
        minWidth: '100%',
        maxWidth: '100%',
        height: '70%',
    },
    confirm: {
        backgroundColor: '#fff'
    },
});

export default styles;