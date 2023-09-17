import { Driver } from '@/types';
import axios, { authConfig } from './axios'; // authConfig

export const updateUser = async (
  id: string,
  updatedUser: Driver,
): Promise<Driver> => {
  console.log(updatedUser);
  const response = await axios.put<Driver>(
    `/v1/azureDrivers/${id}`,
    {
      ...updatedUser,
    },
    authConfig,
  );
  return response.data;
};

export const checkUser = async (): Promise<Driver> => {
  const response = await axios.get<Driver>(
    '/v1/auth/azureAD/check',
    authConfig,
  );
  return response.data;
};
