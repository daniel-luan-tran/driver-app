import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
var viewWidth = Dimensions.get('window').width; //full width
var viewHeight = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  searchResultContainer: {
    padding: 10,
    minWidth: '100%',
    maxWidth: '100%',
    height: viewHeight - 80,
  },
  mapContainer: {
    height: '70%',
  },
  driverTypeContainer: {
    height: '30%',
  },
});

export default styles;
