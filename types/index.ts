import {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';

export type GoogleData = {
  data: GooglePlaceData;
  details?: GooglePlaceDetail;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type DriverType = {
  id: number;
  name: string;
};

export type Driver = {
  id: number;
  driverType: DriverType;
  name: string;
  currentPlace?: Coordinates;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  azureOid: string;
  phoneNumber: string;
  address: string;
  displayName: string;
};
