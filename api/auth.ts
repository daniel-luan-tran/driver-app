import axios, { authConfig } from './axios'; // authConfig

export const logout = async () => {
  const response = await axios.get('/v1/auth/azureAD/logout', authConfig);
  return response.data;
};
