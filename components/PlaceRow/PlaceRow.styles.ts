import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
var viewWidth = Dimensions.get('window').width; //full width
var viewHeight = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  placeRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    minWidth: '100%',
    maxWidth: '100%',
  },
});

export default styles;
