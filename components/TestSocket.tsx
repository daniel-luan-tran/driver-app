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
import { Text, View } from './Themed';
import Colors from '@/constants/Colors';
import io, { Socket } from 'socket.io-client';
import { connectSocket } from '@/api/connectSocket';

const _apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function TestSocket() {
  const [chatMessage, setChatMessage] = useState<string>('');
  const [submitChatMessage, setSubmitChatMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket>();
  const [status, setStatus] = useState<boolean>(false);
  const [disconnectCountdown, setDisconnectCountdown] = useState<number>(0);
  const [activeIntervals, setActiveIntervals] = useState<number[]>([]);
  const isDarkMode = useColorScheme() === 'dark';
  const timeoutConnect = 60; // Second

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

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

  const onConnectSocket = async () => {
    setDisconnectCountdown(timeoutConnect);
    const _socket = await connectSocket();
    if (_socket) {
      _socket.on('welcome', (jsonData) => {
        setStatus(jsonData.status);
      });
      _socket.on('disconnect', () => {
        setStatus(false);
      });
      setSocket(_socket);
      setInterval(() => {
        _socket.disconnect();
      }, timeoutConnect * 1000);
    }
  };

  const onDisconnectSocket = async () => {
    if (_apiUrl) {
      socket?.disconnect();
      if (socket?.disconnected) {
        setStatus(false);
      }
    }
  };
  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor.background}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 20 }}>
            Connect to io socket
          </Text>
          <Button title="Connect" onPress={onConnectSocket} />
          <Button
            title="Disconnect"
            onPress={onDisconnectSocket}
            color={'grey'}
          />
          <Text style={{ color: status ? 'green' : 'orange' }}>
            Status: {status ? 'Connected! ' : 'Disconnected! '}
            {status &&
              `Will disconnect in ${disconnectCountdown} second${
                disconnectCountdown > 1 ? 's' : ''
              }`}
          </Text>
          <Text>apiUrl: {_apiUrl}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
