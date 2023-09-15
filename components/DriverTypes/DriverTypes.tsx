import React, { useEffect, useState } from 'react';
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
import styles from './DriverTypes.styles';
import { GoogleData } from '@/types';
import DriverTypeRow from '../DriverTypeRow/DriverTypeRow';

export default function DriverTypes() {
  const [from, setFrom] = useState<GoogleData>();
  const [destination, setDestination] = useState<GoogleData>();
  useEffect(() => {}, []);

  return (
    <View style={styles.driverTypesContainer}>
      <Text>Driver types</Text>
      <DriverTypeRow />
      <Button title="Confirm" />
    </View>
  );
}
