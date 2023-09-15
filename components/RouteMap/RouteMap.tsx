import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  useColorScheme,
  Image,
  FlatList,
} from 'react-native';
import { Text, View } from '../Themed';
import styles from './RouteMap.styles';
import { Coordinates, Driver, DriverType, GoogleData } from '@/types';
const googleMapApiKey = process.env.EXPO_PUBLIC_API_KEY;
import MapView, { PROVIDER_GOOGLE, MapMarker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getImage } from '@/utilities/getDriverImage';
import { useLocalSearchParams } from 'expo-router';

export default function RouteMap() {
  const [fromLocation, setFromLocation] = useState<Coordinates>();
  const [toLocation, setToLocation] = useState<Coordinates>();
  const params = useLocalSearchParams();
  useEffect(() => {
    console.log(params);
    if (params) {
      setFromLocation({
        latitude: parseFloat(params.startLat as string),
        longitude: parseFloat(params.startLng as string),
      });
      setToLocation({
        latitude: parseFloat(params.endLat as string),
        longitude: parseFloat(params.endLng as string),
      });
    } else {
      console.warn('no params');
    }
  }, []);

  return (
    <View style={styles.homeMapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: parseFloat(params.startLat as string),
          longitude: parseFloat(params.startLng as string),
          latitudeDelta: 0.06,
          longitudeDelta: 0.03,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {googleMapApiKey && fromLocation && toLocation && (
          <>
            <MapMarker title="Origin" coordinate={fromLocation}>
              <Image
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
                source={getImage('Car')}
              />
            </MapMarker>
            <MapViewDirections
              origin={{
                latitude: parseFloat(params.startLat as string),
                longitude: parseFloat(params.startLng as string),
              }}
              destination={{
                latitude: parseFloat(params.endLat as string),
                longitude: parseFloat(params.endLng as string),
              }}
              apikey={googleMapApiKey}
              strokeWidth={5}
              strokeColor="#00b0ff"
            />
            <MapMarker
              title="Destination"
              coordinate={{
                latitude: parseFloat(params.endLat as string),
                longitude: parseFloat(params.endLng as string),
              }}
            />
          </>
        )}
      </MapView>
    </View>
  );
}
