import { BookingHistory, BookingHistoryUpdate } from '@/types';
import axios, { authConfig } from './axios'; // authConfig

export const addNewBooking = async (
  data: BookingHistoryUpdate,
): Promise<BookingHistory> => {
  const response = await axios.post<BookingHistory>(
    `/v1/booking-history`,
    {
      ...data,
    },
    authConfig,
  );

  return response.data;
};
