import { Socket, io } from 'socket.io-client';
const EXPO_PUBLIC_SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

export const connectSocket = async (): Promise<Socket | undefined> => {
  if (EXPO_PUBLIC_SOCKET_URL) {
    const _socket = io(EXPO_PUBLIC_SOCKET_URL);
    return _socket;
  } else {
    return undefined;
  }
};
