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
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '../Themed';
import Colors from '@/constants/Colors';
import io, { Socket } from 'socket.io-client';
import { connectSocket } from '@/api/connectSocket';
import { checkDriverRole, checkUser } from '@/api';
import { Account, PassengerRoute } from '@/types';
import { useNavigation, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import RouteMap from '../RouteMap/RouteMap';

const _apiUrl = process.env.EXPO_PUBLIC_API_URL;

enum Status {
  FINDING = 'FINDING',
  STOPPED_FINDING = 'STOP_FINDING',
  FOUND_PASSENGER = 'FOUND_PASSENGER',
}

export default function FindPassenger() {
  const [socket, setSocket] = useState<Socket>();
  const [status, setStatus] = useState<Status>();
  const [disconnectCountdown, setDisconnectCountdown] = useState<number>(0);
  const [activeIntervals, setActiveIntervals] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [driver, setDriver] = useState<Account | undefined>();
  const [passengerRoute, setPassengerRoute] = useState<PassengerRoute>();

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
    // if (status) {
    //   const timerId = setInterval(() => {
    //     setDisconnectCountdown((prevCount) => prevCount - 1);
    //   }, 1000);
    //   setActiveIntervals((prevIds) => [
    //     ...prevIds,
    //     timerId as unknown as number,
    //   ]);
    // } else {
    //   activeIntervals.forEach((intervalId) => clearInterval(intervalId));
    // }
    console.log(status);
  }, [status]);

  const passengerRequest = async () => {
    // setDisconnectCountdown(timeoutConnect);
    setLoading(true);
    const _socket = await connectSocket();
    setConnecting(true);
    if (_socket) {
      setStatus(Status.FINDING);
      _socket.on('connect', () => {
        _socket.emit('passengerRequest', 'passengerRequest');

        _socket.on('driverRequest', (data) => {
          console.log('passengerRoute: ', data);
          setPassengerRoute(data);
          setLoading(false);
          setStatus(Status.FOUND_PASSENGER);
        });
      });

      _socket.on('disconnect', () => {
        setStatus(Status.STOPPED_FINDING);
      });

      _socket.on('passengerDisconnect', () => {
        _socket.disconnect();
      });

      setSocket(_socket);
      // setInterval(() => {
      //   _socket.disconnect();
      // }, timeoutConnect * 1000);
    }
  };

  const passengerAccept = async () => {
    if (!socket) return;
    const location = await Location.getCurrentPositionAsync({});
    const { coords } = location;
    socket.emit('acceptPassenger', coords);
  };

  const onDisconnectSocket = async () => {
    console.log(_apiUrl);
    if (_apiUrl) {
      socket?.emit('driverDisconnect');
      // socket?.disconnect();
      if (socket?.disconnected) {
        setStatus(Status.STOPPED_FINDING);
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
      <View style={{ padding: 20 }}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor.background}
        />
        <View style={{ height: '80%' }}>
          <RouteMap passengerRoute={passengerRoute} />
        </View>
        <TouchableOpacity style={{ marginBottom: 0 }}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : status === Status.FOUND_PASSENGER ? (
            <Button title="Accept passenger" onPress={passengerAccept} />
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
          <Text
            style={{
              color:
                status === Status.FINDING
                  ? 'orange'
                  : status === Status.FOUND_PASSENGER
                  ? 'green'
                  : 'red',
            }}
          >
            Status:{' '}
            {status === Status.FINDING
              ? 'Finding passenger! '
              : status === Status.FOUND_PASSENGER
              ? 'Found passenger!'
              : 'Stopped finding! '}
            {/* {status &&
                `Will disconnect in ${disconnectCountdown} second${
                  disconnectCountdown > 1 ? 's' : ''
                }`} */}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
