import _axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const _apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const authConfig = {
  withCredentials: true,
};

const getJwt = async (): Promise<string | null> => {
  const token = SecureStore.getItemAsync('jwt');
  return token;
};

export const authConfigToken = async () => {
  const token = (await getJwt()) || '';
  return {
    headers: {
      Authorization: 'jwt ' + token,
    },
  };
};

const axios = _axios.create({ baseURL: _apiUrl });

export default axios;
