import axios, { authConfig } from './axios'; // authConfig
const googleMapApiKey = process.env.EXPO_PUBLIC_API_KEY;

export const reverseGeocoding = async (latitude: number, longitude: number) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapApiKey}`,
  );
  return response.data;
};
