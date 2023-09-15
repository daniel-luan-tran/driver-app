import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
var viewWidth = Dimensions.get('window').width; //full width
var viewHeight = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
    driverTypeRowContainer: {
        padding: 10,
        minWidth: '100%',
        maxWidth: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    driverName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    rightContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    image : {
        height: 30,
        width: 30
    }
});

export default styles;