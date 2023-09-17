import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, useColorScheme, StatusBar, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useNavigation, useRouter } from 'expo-router';
import { checkUser, connectSocket, logout, updateUser } from '@/api';
import { Driver, DriverType, Account } from '@/types';
import { TextInput } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';

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

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await checkUser();
        setUser(data);
        setUpdatedUser(data);
      } catch (error) {
        setUser(undefined);
      }
    };
    getUser();
    navigation.addListener('focus', (payload) => {
      getUser();
    });
  }, []);

  const openModalLogin = async () => {
    router.push('/modal?viewType=AUTH_VIEW');
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

  const handleOpenDropdown = () => {};

  return (
    <View style={styles.container}>
      {!user ? (
        <Button title="Login with Azure Microsoft" onPress={openModalLogin} />
      ) : (
        <View>
          <Text>Name: {user.displayName}</Text>
          <Text>Email: {user.email}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!user.phoneNumber && (
              <TextInput
                placeholder="Enter your phone number"
                onChangeText={(text) => {
                  if (updatedUser) {
                    const _updateUser: Account = {
                      ...updatedUser,
                      phoneNumber: text,
                    };
                    setUpdatedUser(_updateUser);
                  }
                }}
                value={user.phoneNumber}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!user.address && (
              <TextInput
                placeholder="Enter your address"
                onChangeText={(text) => {
                  if (updatedUser) {
                    const _updateUser: Account = {
                      ...updatedUser,
                      address: text,
                    };
                    setUpdatedUser(_updateUser);
                  }
                }}
                value={user.address}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {!user.address && (
              <DropDownPicker
                open={open}
                value={user.Driver?.driverType.id || null}
                items={driverTypeList.map((item) => {
                  return {
                    label: item.name,
                    value: item.id,
                  };
                })}
                setOpen={setOpen}
                setValue={setDriverType}
                setItems={setDriverTypeList}
                onChangeValue={(value) => {
                  if (updatedUser) {
                    const _updateUser: Account = {
                      ...updatedUser,
                      driverType: value,
                    };
                    setUpdatedUser(_updateUser);
                  }
                }}
              />
            )}
          </View>
          {(!user.address || !user.phoneNumber) && (
            <Button
              title="Update user infomation"
              onPress={() => {
                if (updatedUser) handleUpdate(user.id, updatedUser);
              }}
            />
          )}
          <Button color={'red'} title="Login out" onPress={handleLogout} />
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
