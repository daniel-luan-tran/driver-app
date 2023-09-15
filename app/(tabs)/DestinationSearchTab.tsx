import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import DestinationSearch from '@/components/DestinationSearch/DestinationSearch';

export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <DestinationSearch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    overflow: 'visible',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
