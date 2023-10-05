import { Text, View } from '../Themed';
import styles from './SearchResult.styles';
import DriverTypes from '../DriverTypes/DriverTypes';
import RouteMap from '../RouteMap/RouteMap';

export default function SearchResult() {
  return (
    <View style={styles.searchResultContainer}>
      <View style={styles.mapContainer}>{/* <RouteMap /> */}</View>
      <View style={styles.driverTypeContainer}>
        <DriverTypes />
      </View>
    </View>
  );
}
