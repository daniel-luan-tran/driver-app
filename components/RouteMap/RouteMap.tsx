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
import {
  Coordinates,
  Driver,
  DriverType,
  GoogleData,
  PassengerRoute,
} from '@/types';
const googleMapApiKey = process.env.EXPO_PUBLIC_API_KEY;
import MapView, { PROVIDER_GOOGLE, MapMarker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getImage } from '@/utilities/getDriverImage';
import * as Location from 'expo-location';

interface RouteMapProps {
  passengerRoute?: PassengerRoute;
  currentLocation?: Coordinates;
}

export default function RouteMap({
  passengerRoute,
  currentLocation,
}: RouteMapProps) {
  const [_currentLocation, _setCurrentLocation] = useState<Coordinates>();
  const [_passengerRoute, _setPassengerRoute] = useState<PassengerRoute>();

  useEffect(() => {
    (async () => {
      _setCurrentLocation(currentLocation);
    })();
  }, []);

  useEffect(() => {
    _setPassengerRoute(passengerRoute);
  }, [passengerRoute]);

  if (!_passengerRoute || !currentLocation) return null;

  return (
    <View style={styles.homeMapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: _passengerRoute.from.startLat,
          longitude: _passengerRoute.from.startLng,
          latitudeDelta: 0.06,
          longitudeDelta: 0.03,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {googleMapApiKey && _passengerRoute?.from && _passengerRoute?.to && (
          <>
            <MapMarker title="Current Location" coordinate={currentLocation}>
              <Image
                style={{ width: 30, height: 30, resizeMode: 'contain' }}
                source={getImage('Current')}
              />
            </MapMarker>
            <MapMarker
              title="Origin"
              coordinate={{
                latitude: _passengerRoute.from.startLat,
                longitude: _passengerRoute.from.startLng,
              }}
            >
              <Image
                style={{ width: 30, height: 30, resizeMode: 'contain' }}
                source={getImage('UserLocation')}
              />
            </MapMarker>
            <MapViewDirections
              origin={{
                latitude: _passengerRoute.from.startLat,
                longitude: _passengerRoute.from.startLng,
              }}
              destination={{
                latitude: _passengerRoute.to.endLat,
                longitude: _passengerRoute.to.endLng,
              }}
              apikey={googleMapApiKey}
              strokeWidth={5}
              strokeColor="#00b0ff"
            />
            <MapMarker
              title="Destination"
              coordinate={{
                latitude: _passengerRoute.to.endLat,
                longitude: _passengerRoute.to.endLng,
              }}
            />
          </>
        )}
      </MapView>
    </View>
  );
}
