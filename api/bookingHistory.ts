import { BookingHistory, BookingHistoryUpdate } from '@/types';
import axios, { authConfig } from './axios'; // authConfig

export const addNewBooking = async (
  data: BookingHistoryUpdate,
): Promise<BookingHistory> => {
  const response = await axios.post<BookingHistory>(
    `/v1/booking-history`,
    data,
    authConfig,
  );

  return response.data;
};

export const updateBooking = async (
  id: string,
  data: BookingHistoryUpdate,
): Promise<BookingHistory> => {
  console.log('data', data);
  const response = await axios.put<BookingHistory>(
    `/v1/booking-history/${id}`,
    data,
    authConfig,
  );

  return response.data;
};
