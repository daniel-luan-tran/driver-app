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
import {
  addNewBooking,
  checkDriverRole,
  checkUser,
  updateBooking,
} from '@/api';
import {
  Account,
  BookingHistory,
  BookingHistoryUpdate,
  Coordinates,
  PassengerRoute,
} from '@/types';
import { useNavigation, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import RouteMap from '../RouteMap/RouteMap';
import { BOOKINGSTATUS } from '@/types/enum';

const _apiUrl = process.env.EXPO_PUBLIC_API_URL;

enum Status {
  FINDING = 'FINDING',
  STOPPED_FINDING = 'STOP_FINDING',
  FOUND_PASSENGER = 'FOUND_PASSENGER',
}

export default function FindPassenger() {
  const [socket, setSocket] = useState<Socket>();
  const [status, setStatus] = useState<Status>();
  const [loading, setLoading] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [passengerAccepted, setPassengerAccepted] = useState<boolean>(false);
  const [driver, setDriver] = useState<Account | undefined>();
  const [passenger, setPassenger] = useState<Account | undefined>();
  const [passengerRoute, setPassengerRoute] = useState<PassengerRoute>();
  const [bookingHistory, setBookingHistory] = useState<BookingHistory>();
  const [currentLocation, setCurrentLocation] = useState<Coordinates>();

  const isDarkMode = useColorScheme() === 'dark';
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
      try {
        const _driver = await checkDriverRole();
        const _driverType = _driver?.driverTypeId;
        if (!_driverType || !_driver) {
          setIsValidRole(false);
        } else setIsValidRole(true);
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
        const user = await checkUser();
        setDriver(user);
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
    console.log(isValidRole);
  }, [isValidRole]);

  const passengerRequest = async () => {
    setLoading(true);
    const _socket = await connectSocket();
    setConnecting(true);
    if (_socket) {
      setStatus(Status.FINDING);
      _socket.on('connect', () => {
        _socket.emit('passengerRequest', 'passengerRequest');

        _socket.on('driverRequest', (data) => {
          console.log('passengerRoute: ', data);
          setPassengerRoute(data.passengerRoute);
          setPassenger(data.passengerAccount);
          setLoading(false);
          setStatus(Status.FOUND_PASSENGER);
        });

        _socket.on('foundDriver', (data) => {
          console.log('passengerRoute: ', data);
          setPassengerRoute(data);
          setLoading(false);
          setStatus(Status.FOUND_PASSENGER);
        });
      });

      _socket.on('disconnect', () => {
        setStatus(Status.STOPPED_FINDING);
        setLoading(false);
        setPassengerAccepted(false);
      });

      _socket.on('passengerDisconnect', () => {
        _socket.disconnect();
      });

      _socket.on('userCancelBooking', () => {
        setBookingHistory((prevBookingHistory) => {
          console.log('userCancelBooking', prevBookingHistory);
          prevBookingHistory &&
            cancelBooking(prevBookingHistory, BOOKINGSTATUS.USER_CANCEL);
          console.log('canceled');
          _socket.emit('updatedBooking');
          return prevBookingHistory; // return the previous state
        });
      });

      setSocket(_socket);
    }
  };

  const passengerAccept = async () => {
    if (!socket) return;
    // const location = await Location.getCurrentPositionAsync({});
    // const { coords } = location;
    // Fake current location
    const coords = { latitude: 10.7496697, longitude: 106.6509839 };

    setCurrentLocation(coords);
    socket.emit('acceptPassenger', {
      driverLocation: coords,
      driverAccount: driver,
    });

    if (passenger && driver && passengerRoute) {
      const _bookingHistory = await addNewBooking({
        userId: passenger?.id,
        driverId: driver?.id,
        startLat: passengerRoute?.from.startLat,
        startLng: passengerRoute?.from.startLng,
        endLat: passengerRoute?.to.endLat,
        endLng: passengerRoute?.to.endLng,
        status: BOOKINGSTATUS.SUCCESS,
      });
      console.log('_bookingHistory', _bookingHistory);
      setBookingHistory(_bookingHistory);
    }

    setPassengerAccepted(true);
  };

  const cancelBooking = async (
    _bookingHistory: BookingHistory,
    whoCancel: BOOKINGSTATUS,
  ) => {
    if (_bookingHistory) {
      const { driver, user, ...bookingHistoryUpdate } = _bookingHistory;
      console.log('bookingHistoryUpdate', bookingHistoryUpdate);
      const { status, ..._bookingHistoryUpdate } = bookingHistoryUpdate;

      const data = {
        status: whoCancel,
        ..._bookingHistoryUpdate,
      };
      const updatedBookingHistory = await updateBooking(_bookingHistory?.id, {
        ...data,
      });
      setBookingHistory(updatedBookingHistory);
      onDisconnectSocket();
    }
  };

  const onDisconnectSocket = async () => {
    if (_apiUrl) {
      socket?.emit('driverDisconnect');
      // socket?.disconnect();
      setStatus(Status.STOPPED_FINDING);
      setConnecting(false);
      setLoading(false);
      setPassengerAccepted(false);
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
        {status === Status.FOUND_PASSENGER && connecting && (
          <View style={{ height: '90%' }}>
            <RouteMap
              passengerRoute={passengerRoute}
              currentLocation={currentLocation}
            />
          </View>
        )}

        <TouchableOpacity style={{ marginBottom: 0 }}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : status === Status.FOUND_PASSENGER && !passengerAccepted ? (
            <Button title="Accept passenger" onPress={passengerAccept} />
          ) : (
            !passengerAccepted && (
              <Button title="Find passenger" onPress={passengerRequest} />
            )
          )}

          {connecting && status !== Status.STOPPED_FINDING && (
            <View>
              {passengerAccepted ? (
                <Button
                  title="Cancel booking"
                  onPress={() =>
                    bookingHistory &&
                    cancelBooking(bookingHistory, BOOKINGSTATUS.DRIVER_CANCEL)
                  }
                  color={'grey'}
                />
              ) : (
                <Button
                  title="Stop finding"
                  onPress={onDisconnectSocket}
                  color={'grey'}
                />
              )}
            </View>
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
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
