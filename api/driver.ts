import { Driver, DriverType } from '@/types';
import axios, { authConfig, authConfigToken } from './axios'; // authConfig

export const getDriverTypes = async (): Promise<DriverType[]> => {
  const res = await axios.get<DriverType[]>(
    '/v1/jwtDrivers/get-driver-types',
    await authConfigToken(),
  );
  return res.data;
};

export const checkDriverRole = async (): Promise<Driver> => {
  const res = await axios.get(
    '/v1/jwtDrivers/check-role',
    await authConfigToken(),
  );
  console.log('driver', res.data);
  return res.data;
};
