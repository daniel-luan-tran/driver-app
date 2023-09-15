import React, { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  useColorScheme,
  Image
} from "react-native";
import { Text, View } from "../Themed";
import styles from "./DriverTypeRow.styles";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GoogleData } from "@/types";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getImage } from "@/utilities/getDriverImage";
const googleMapApiKey = process.env.EXPO_PUBLIC_API_KEY;

export default function DriverTypeRow() {
  const [from, setFrom] = useState<GoogleData>();
  const [destination, setDestination] = useState<GoogleData>();
	useEffect(() => {

	}, [])

  return (
    <View style={styles.driverTypeRowContainer}>
		  <View style={styles.leftContainer}>
        <Image style={styles.image} source={getImage('Car')} />
        <Text style={styles.driverName}>{'Car'}</Text>
      </View>
		  <View style={styles.rightContainer}>
        <Ionicons name='pricetag' />
        <Text style={styles.price}>{30000}</Text>
      </View>
    </View>
  );
}
