import { StyleSheet } from 'react-native';
import FindPassenger from '@/components/FindPassenger/FindPassenger';
import { Text, View } from '@/components/Themed';

export default function FindPassengerTab() {
  return (
    <View style={styles.container}>
      <FindPassenger />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
