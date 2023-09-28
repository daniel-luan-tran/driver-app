import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Text, View } from '../Themed';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { loginLocal } from '@/api';
const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
const EXPO_PUBLIC_DRIVER_EMAIL = process.env.EXPO_PUBLIC_DRIVER_EMAIL;
const EXPO_PUBLIC_DRIVER_PASSWORD = process.env.EXPO_PUBLIC_DRIVER_PASSWORD;

export default function AuthViewLocal() {
  const router = useRouter();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(EXPO_PUBLIC_DRIVER_EMAIL || '');
  const [password, setPassword] = useState<string>(
    EXPO_PUBLIC_DRIVER_PASSWORD || '',
  );
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  const login = async () => {
    setIsloading(true);
    try {
      const user = await loginLocal({ email, password });
      setTimeout(() => {
        router.push('/(tabs)/');
      }, 500);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        minHeight: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <View>
        {isLoading && <ActivityIndicator size="large" />}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Name: </Text>
          <TextInput
            placeholder="Enter your email"
            value="driver@dalutech"
            onChangeText={(text) => {}}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Password: </Text>
          <TextInput
            placeholder="Enter your password"
            secureTextEntry={true}
            value="123456"
            onChangeText={(text) => {}}
          />
        </View>
        <Button title="Login" onPress={login} />
      </View>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor.background}
      />
    </View>
  );
}
