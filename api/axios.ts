import _axios from 'axios';

const _apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const authConfig = {
  withCredentials: true,
};

const axios = _axios.create({ baseURL: _apiUrl });

export default axios;
