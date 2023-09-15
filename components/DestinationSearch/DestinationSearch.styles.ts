import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
var viewWidth = Dimensions.get('window').width; //full width
var viewHeight = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  destinationContainer: {
    paddingVertical: 10,
    paddingLeft: 5,
    paddingRight: 15,
    minWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
  googleSearchContainer: {
    width: '95%',
    height: 'auto',
  },
});

export default styles;
