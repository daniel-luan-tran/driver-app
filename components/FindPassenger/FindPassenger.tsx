import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import io, { Socket } from 'socket.io-client';
import { connectSocket } from '@/api/connectSocket';
import { checkDriverRole, checkUser } from '@/api';
import { Account } from '@/types';
import { useNavigation, useRouter } from 'expo-router';

const _apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function FindPassenger() {
  const [socket, setSocket] = useState<Socket>();
  const [status, setStatus] = useState<boolean>(false);
  const [disconnectCountdown, setDisconnectCountdown] = useState<number>(0);
  const [activeIntervals, setActiveIntervals] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [driver, setDriver] = useState<Account | undefined>();
  const isDarkMode = useColorScheme() === 'dark';
  const timeoutConnect = 60; // Second
  const navigation = useNavigation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  const [isValidRole, setIsValidRole] = useState<boolean>(false);
  const router = useRouter();

  const handleOpenUpdateProfile = () => {
    router.push('/(tabs)/');
  };

  useEffect(() => {
    const checkValidRole = async () => {
      setIsValidRole(true);
      try {
        const _driverType = await checkDriverRole();
        if (!_driverType) setIsValidRole(false);
        setIsValidRole(true);
      } catch (error) {
        setIsValidRole(false);
      }
    };

    checkValidRole();
    navigation.addListener('focus', (payload) => {
      checkValidRole();
    });
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await checkUser();
        setDriver(data);
      } catch (error) {
        setDriver(undefined);
      }
    };
    getUser();
    navigation.addListener('focus', (payload) => {
      getUser();
    });
  }, []);

  useEffect(() => {
    if (status) {
      const timerId = setInterval(() => {
        setDisconnectCountdown((prevCount) => prevCount - 1);
      }, 1000);
      setActiveIntervals((prevIds) => [
        ...prevIds,
        timerId as unknown as number,
      ]);
    } else {
      activeIntervals.forEach((intervalId) => clearInterval(intervalId));
    }
  }, [status]);

  const passengerRequest = async () => {
    // setDisconnectCountdown(timeoutConnect);
    setLoading(true);
    const _socket = await connectSocket();
    setConnecting(true);
    if (_socket) {
      _socket.on('welcome', (jsonData) => {
        setStatus(jsonData.status);
      });
      _socket.on('driverLocation', (jsonData) => {
        setStatus(jsonData.status);
      });
      _socket.on('disconnect', () => {
        setStatus(false);
      });
      setSocket(_socket);
      // setInterval(() => {
      //   _socket.disconnect();
      // }, timeoutConnect * 1000);
    }
  };

  const onDisconnectSocket = async () => {
    console.log(_apiUrl);
    if (_apiUrl) {
      socket?.disconnect();
      if (socket?.disconnected) {
        setStatus(false);
        setConnecting(false);
        setLoading(false);
      }
    }
  };

  if (!isValidRole)
    return (
      <SafeAreaView>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor.background}
        />
        <View
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          <Text style={{ marginBottom: 10, textAlign: 'center' }}>
            You are Passenger or Driver?
          </Text>
          <Button
            title="Log in and update your profile"
            onPress={handleOpenUpdateProfile}
          />
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor.background}
      />

      <View>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Find passenger" onPress={passengerRequest} />
        )}

        {connecting && (
          <Button
            title="Stop finding"
            onPress={onDisconnectSocket}
            color={'grey'}
          />
        )}
        <Text style={{ color: status ? 'green' : 'orange' }}>
          Status: {status ? 'Finding passenger! ' : 'Stopped finding! '}
          {/* {status &&
              `Will disconnect in ${disconnectCountdown} second${
                disconnectCountdown > 1 ? 's' : ''
              }`} */}
        </Text>
        <Text>apiUrl: {_apiUrl}</Text>
      </View>
    </SafeAreaView>
  );
}
