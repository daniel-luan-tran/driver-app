import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    return Geolocation.requestAuthorization();
  } else {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'App needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
};

export const setupGeolocation = async () => {
  const permissionGranted = await requestLocationPermission();
  if (permissionGranted) {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse', // or 'always'
    });
  }
};

export const getCurrentPos = () => {
  const currentPosition = Geolocation.getCurrentPosition(
    (position) => {
      // Handle the geolocation data here
      const { latitude, longitude } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    },
    (error) => {
      // Handle any errors here
      console.error(error);
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  );
  return currentPosition;
};
