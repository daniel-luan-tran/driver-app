import { Driver, DriverType } from '@/types';
import axios, { authConfig } from './axios'; // authConfig

export const getDriverTypes = async (): Promise<DriverType[]> => {
  const res = await axios.get<DriverType[]>(
    '/v1/azureDrivers/get-driver-types',
    authConfig,
  );
  return res.data;
};

export const checkDriverRole = async (): Promise<Driver> => {
  const res = await axios.get('/v1/azureDrivers/check-role');
  return res.data;
};
