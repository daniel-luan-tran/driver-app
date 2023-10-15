import { StyleSheet, useColorScheme, StatusBar, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import DestinationSearch from '@/components/DestinationSearch/DestinationSearch';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { checkDriverRole } from '@/api';

export default function TabThreeScreen() {
  const [isValidRole, setIsValidRole] = useState<boolean>(false);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const checkValidRole = async () => {
      try {
        const _driver = await checkDriverRole();
        if (!_driver) setIsValidRole(false);
        else setIsValidRole(true);
      } catch (error) {
        setIsValidRole(false);
      }
    };

    checkValidRole();
    navigation.addListener('focus', (payload) => {
      checkValidRole();
    });
  }, []);

  const handleOpenUpdateProfile = () => {
    router.push('/(tabs)/');
  };

  if (!isValidRole)
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <Text style={{ marginBottom: 10, textAlign: 'center' }}>
            You are Passenger or Driver?
          </Text>
          <Button
            title="Log in and update your profile"
            onPress={handleOpenUpdateProfile}
          />
        </View>
      </View>
    );

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
