import axios, { authConfig } from './axios'; // authConfig

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
