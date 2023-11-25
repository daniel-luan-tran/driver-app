import { Account } from '@/types';
import axios, { authConfig, authConfigToken } from './axios'; // authConfig

export const updateUser = async (
  id: string,
  updatedUser: Account,
): Promise<Account> => {
  const { Driver, ...account } = updatedUser;
  const response = await axios.put<Account>(
    `/v1/jwtDrivers/${id}`,
    {
      ...account,
    },
    await authConfigToken(),
  );

  return response.data;
};

export const checkUser = async (): Promise<Account> => {
  const response = await axios.get<Account>(
    '/v1/auth/azureAD/check',
    authConfig,
  );

  console.log('response.data', response.data);
  return response.data;
};
