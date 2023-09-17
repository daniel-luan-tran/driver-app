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
import styles from './HomeMap.styles';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import { Driver, DriverType, GoogleData } from '@/types';
const googleMapApiKey = process.env.EXPO_PUBLIC_API_KEY;
import MapView, { PROVIDER_GOOGLE, MapMarker } from 'react-native-maps';
import { getImage } from '@/utilities/getDriverImage';

const driverTypes: DriverType[] = [
  {
    id: 1,
    name: 'Car',
  },
  {
    id: 2,
    name: 'Van',
  },
  {
    id: 3,
    name: 'Moto',
  },
];

const listData: Driver[] = [
  {
    id: '1',
    displayName: 'Minh',
    driverType: {
      id: 1,
      name: 'Car',
    },
    currentPlace: {
      latitude: 21.0285,
      longitude: 105.8542,
    },
  },
  {
    id: 2,
    name: 'Tuan',
    driverType: {
      id: 3,
      name: 'Moto',
    },
    currentPlace: {
      latitude: 21.0393,
      longitude: 105.8742,
    },
  },
  {
    id: 3,
    name: 'Quan',
    driverType: {
      id: 2,
      name: 'Van',
    },
    currentPlace: {
      latitude: 21.0293,
      longitude: 105.8842,
    },
  },
];

export default function HomeMap() {
  useEffect(() => {}, []);

  return (
    <View style={styles.homeMapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 21.0393,
          longitude: 105.8742,
          latitudeDelta: 0.06,
          longitudeDelta: 0.03,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {listData.map((item) => {
          return item.currentPlace ? (
            <MapMarker
              key={item.id}
              coordinate={{
                latitude: item.currentPlace?.latitude,
                longitude: item.currentPlace?.longitude,
              }}
            >
              <Image
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
                source={getImage(item.driverType.name)}
              />
            </MapMarker>
          ) : (
            <></>
          );
        })}
      </MapView>
    </View>
  );
}
