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
import Colors from '@/constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/MaterialIcons';
import styles from './HomeSearch.styles';

export default function HomeSearch({ path }: { path: string }) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  return (
  <SafeAreaView style={{padding: 10}}>
    <StatusBar
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={backgroundStyle.backgroundColor.background}
    />
    <ScrollView
      contentInsetAdjustmentBehavior="automatic">
      <View>

        <View style={styles.inputBox}>
          <Text style={styles.inputText}>Where To?</Text>
          <View style={styles.timeContainer}>
            <AntDesign name='clockcircle' size={16} />
            <Text>Now</Text>
            <MaterialIcons name='keyboard-arrow-down' size={16} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <AntDesign name='clockcircle' size={16} color={'#ffffff'} />
          </View>
          <Text style={styles.destinationText}>Spin Nightclub</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Entypo name='home' size={16} color={'#ffffff'} />
          </View>
          <Text style={styles.destinationText}>Home</Text>
        </View>

      </View>
    </ScrollView>
  </SafeAreaView>
  );
}