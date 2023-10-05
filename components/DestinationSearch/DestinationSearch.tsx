import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import { Text, View } from '../Themed';
import styles from './DestinationSearch.styles';

import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import { Coordinates, GoogleData } from '@/types';
import PlaceRow from '../PlaceRow/PlaceRow';
import * as Location from 'expo-location';
import { reverseGeocoding } from '@/api';
import { useRouter } from 'expo-router';

const googleMapApiKey = process.env.EXPO_PUBLIC_API_KEY;

export default function DestinationSearch() {
  const [from, setFrom] = useState<GoogleData>();
  const [destination, setDestination] = useState<GoogleData>();
  const [startCor, setStartCor] = useState<Coordinates>();
  const [endCor, setEndCor] = useState<Coordinates>();
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUseCurrentLocation, setIsUseCurrentLocation] =
    useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = () => {
    if (startCor && endCor) {
      router.push({
        pathname: '/modal',
        params: {
          viewType: 'SEARCHRESULT_VIEW',
          startLat: startCor.latitude,
          startLng: startCor.longitude,
          endLat: endCor.latitude,
          endLng: endCor.longitude,
        },
      });
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        console.log(errorMsg);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { coords } = location;
      const { latitude, longitude } = coords;
      console.log('1', location);
      const currentLocationJson = await reverseGeocoding(latitude, longitude);
      console.log('2', currentLocationJson.results[0].formatted_address);
      setCurrentLocation(currentLocationJson.results[0].formatted_address);
      setStartCor({
        latitude: latitude,
        longitude: longitude,
      });
    })();
  }, [currentLocation, isUseCurrentLocation]);

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View style={{ paddingHorizontal: 5 }}>
        <Button title="Submit" color={'green'} onPress={handleSubmit} />
      </View>
      <View
        style={{
          paddingHorizontal: 5,
          marginTop: 5,
          height: 35,
        }}
      >
        {!isUseCurrentLocation ? (
          <Button
            title="Use current location for start"
            onPress={() => {
              setIsUseCurrentLocation(!isUseCurrentLocation);
            }}
          />
        ) : (
          <Button
            title="Search location for start"
            onPress={() => {
              setIsUseCurrentLocation(!isUseCurrentLocation);
            }}
          />
        )}
      </View>
      <View style={styles.destinationContainer}>
        <View>
          <Text style={{ marginTop: 15, textAlign: 'right' }}>From:</Text>
          <Text style={{ marginTop: 25, textAlign: 'right' }}>To:</Text>
        </View>
        <View style={styles.googleSearchContainer}>
          {isUseCurrentLocation ? (
            <View
              style={{
                paddingHorizontal: 10,
                marginTop: 8,
                height: 35,
              }}
            >
              <TextInput
                placeholder={currentLocation}
                placeholderTextColor={'black'}
                style={{
                  color: 'black',
                  backgroundColor: '#eeeeee',
                  height: '100%',
                  paddingHorizontal: 10,
                  padding: 10,
                  textAlign: 'left',
                }}
                editable={true}
                multiline={false}
                autoFocus={true}
              />
            </View>
          ) : (
            <GooglePlacesAutocomplete
              placeholder="Where from?"
              fetchDetails={true}
              onPress={(data: GooglePlaceData, details = null) => {
                // 'details' is provided when fetchDetails = true
                if (data && details) {
                  setFrom({ data, details });
                  setStartCor({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  });
                }
                console.log(data, details);
                console.warn(data, details);
              }}
              query={{
                key: googleMapApiKey,
                language: 'en',
              }}
              suppressDefaultStyles
              styles={{
                textInput: styles.textInput,
                container: {
                  position: 'absolute',
                  // top: 0,
                  top: isUseCurrentLocation ? 85 : 0,
                  left: 10,
                  right: 10,
                },
                listView: {
                  position: 'absolute',
                  // top: 105,
                  top: isUseCurrentLocation ? 190 : 105,
                },
              }}
              renderRow={(data: GooglePlaceData) => <PlaceRow data={data} />}
            />
          )}
          <GooglePlacesAutocomplete
            placeholder="Where to?"
            fetchDetails={true}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              if (data && details) {
                setDestination({ data, details });
                setEndCor({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
              }
              console.log(data, details);
              console.warn(data, details);
            }}
            query={{
              key: googleMapApiKey,
              language: 'en',
            }}
            suppressDefaultStyles
            styles={{
              textInput: styles.textInput,
              container: {
                position: 'absolute',
                top: 50,
                left: 10,
                right: 10,
                listView: {
                  position: 'absolute',
                  // top: 105,
                  top: 85,
                },
              },
            }}
            renderRow={(data: GooglePlaceData) => <PlaceRow data={data} />}
          />
        </View>
      </View>
    </View>
  );
}
