import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
var viewWidth = Dimensions.get('window').width; //full width
var viewHeight = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: '#b0b0b0',
    marginRight: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '100%',
  },
  inputText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6e6e6e'
  },
  timeContainer: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
    minWidth: '100%'
  },
  iconContainer: {
    backgroundColor: '#b3b3b3',
    padding: 10,
    borderRadius: 25,
  },
  destinationText: {
    marginLeft: 10,
    fontWeight: '500',
    fontSize: 16,
  }
});

export default styles;