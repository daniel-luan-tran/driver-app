import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, useColorScheme, StatusBar, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useNavigation, useRouter } from 'expo-router';
import {
  checkDriverRole,
  checkUser,
  connectSocket,
  getDriverTypes,
  localLogout,
  logout,
  updateUser,
} from '@/api';
import { Driver, DriverType, Account } from '@/types';
import { TextInput } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from '@/api/axios';

export default function TabIndexScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const router = useRouter();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  const [user, setUser] = useState<Account | undefined>();
  const [updatedUser, setUpdatedUser] = useState<Account | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [driverType, setDriverType] = useState<number | null>(null);
  const [driverTypeList, setDriverTypeList] = useState<DriverType[]>([]);
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLocalLogin, setIsLocalLogin] = useState<boolean | undefined>();
  const getUser = async () => {
    try {
      const data = await checkUser();
      setUser(data);
      console.log(data);
      setUpdatedUser(data);
      console.log(updatedUser);

      if (!data.azureOid) {
        setIsLocalLogin(true);
      } else {
        setIsLocalLogin(false);
      }
    } catch (error) {
      setUser(undefined);
    }
  };
  useEffect(() => {
    getUser();
    navigation.addListener('focus', (payload) => {
      getUser();
    });
  }, []);

  useEffect(() => {
    const getDriverTypeList = async () => {
      const _driverTypes = await getDriverTypes();
      setDriverTypeList(_driverTypes);
    };
    getDriverTypeList();

    setDriverType(user?.Driver?.driverTypeId || null);

    setAddress(user?.address || '');
    setPhoneNumber(user?.phoneNumber || '');

    const checkValidRole = async () => {
      try {
        await checkDriverRole();
      } catch (error) {
        if (isLocalLogin) {
          await handleLocalLogout();
        } else {
          const logoutLink = await logout();
          router.push(`/modal?viewType=LOGOUT_VIEW&logoutLink=${logoutLink}`);
        }
      }
    };
    if (user) {
      checkValidRole();
      navigation.addListener('focus', (payload) => {
        checkValidRole();
      });
    }
  }, [user]);

  const openModalLogin = async () => {
    router.push('/modal?viewType=AUTH_VIEW');
  };

  const openModalLocalLogin = async () => {
    router.push('/modal?viewType=AUTH_VIEW_LOCAL');
  };

  const handleUpdate = async (id: string, updatedUser: Account) => {
    const data = await updateUser(id, updatedUser);
    setUser(undefined);
    setUser(data);
  };

  const handleLogout = async () => {
    const logoutLink = await logout();
    router.push(`/modal?viewType=LOGOUT_VIEW&logoutLink=${logoutLink}`);
  };

  const handleLocalLogout = async () => {
    await localLogout();
    await getUser();
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20, fontWeight: '900', fontSize: 24 }}>
        DRIVER APP
      </Text>
      {!user ? (
        <View>
          <Button title="Login with Azure Microsoft" onPress={openModalLogin} />
          <Button title="Local login" onPress={openModalLocalLogin} />

          <Button
            title="Hello"
            onPress={async () => {
              const hello = await axios.get('/v1/auth/hello');
              console.log(hello.data);
            }}
          />
        </View>
      ) : (
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Name: {user.displayName}</Text>
            <TextInput value={user.displayName || ''} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Email: {user.displayName}</Text>
            <TextInput value={user.email || ''} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Phone number: </Text>
            <TextInput
              placeholder="Enter your phone number"
              onChangeText={(text) => {
                if (updatedUser) {
                  const _updateUser: Account = {
                    ...updatedUser,
                    phoneNumber: text,
                  };
                  setPhoneNumber(text);
                  setUpdatedUser(_updateUser);
                }
              }}
              value={phoneNumber}
            />
          </View>
          {!phoneNumber && (
            <Text style={{ color: 'red' }}>Phone number is required!</Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>Address: </Text>
            <TextInput
              placeholder="Enter your address"
              onChangeText={(text) => {
                if (updatedUser) {
                  const _updateUser: Account = {
                    ...updatedUser,
                    address: text,
                  };
                  setAddress(text);
                  setUpdatedUser(_updateUser);
                }
              }}
              value={address}
            />
          </View>
          {!address && (
            <Text style={{ color: 'red' }}>Address is required!</Text>
          )}
          <View>
            <View style={{ flexDirection: 'row', height: 200, marginTop: 10 }}>
              <DropDownPicker
                open={open}
                value={driverType}
                items={driverTypeList.map((item) => {
                  return {
                    label: item.name,
                    value: item.id,
                  };
                })}
                setOpen={setOpen}
                setValue={setDriverType}
                setItems={setDriverTypeList}
                onSelectItem={(value) => {
                  if (updatedUser) {
                    const _updateUser: Account = {
                      ...updatedUser,
                      driverTypeId: value.value || null,
                    };
                    setDriverType(value.value || null);
                    console.log(_updateUser);
                    setUpdatedUser(_updateUser);
                  }
                }}
              />
            </View>
            {!driverType && (
              <Text
                style={{
                  color: 'red',
                  position: 'absolute',
                  top: 25,
                  right: 30,
                }}
              >
                Driver type is required!
              </Text>
            )}
          </View>
          <View>
            {(!user.address || !user.phoneNumber || !user.driverTypeId) && (
              <Button
                title="Update user infomation"
                onPress={() => {
                  if (updatedUser) handleUpdate(user.id, updatedUser);
                }}
                disabled={address && phoneNumber && driverType ? false : true}
              />
            )}
            {isLocalLogin ? (
              <Button
                color={'red'}
                title="Local logout"
                onPress={handleLocalLogout}
              />
            ) : (
              <Button color={'red'} title="Login out" onPress={handleLogout} />
            )}
          </View>
        </View>
      )}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor.background}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
