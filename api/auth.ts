import { Account } from '@/types';
import axios, { authConfig, authConfigToken } from './axios'; // authConfig
import * as SecureStore from 'expo-secure-store';

type LoginArgs = {
  email: string;
  password: string;
};

export const logout = async () => {
  const response = await axios.get('/v1/auth/azureAD/logout', authConfig);
  return response.data;
};

export const localLogout = async () => {
  const response = await axios.delete('/v1/auth/logout', authConfig);
  return response.data;
};

export const loginLocal = async ({ email, password }: LoginArgs) => {
  console.log('email-pass', { email, password });
  const response = await axios.post(
    '/v1/auth/login',
    { email, password },
    authConfig,
  );
  return response.data;
};

export const loginJwt = async ({ email, password }: LoginArgs) => {
  console.log('email-pass', { email, password });
  const response = await axios.post('/v1/auth/login-jwt', { email, password });
  return response.data;
};

export const checkJwt = async () => {
  const response = await axios.get(
    '/v1/auth/check-jwt',
    await authConfigToken(),
  );
  return response.data as Account;
};

export const saveJwt = async (value: any) => {
  await SecureStore.setItemAsync('jwt', value.jwt);
};

export const logoutJwt = async () => {
  await SecureStore.deleteItemAsync('jwt');
};
