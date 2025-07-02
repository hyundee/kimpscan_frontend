import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Notification } from '../components/Notification/Notifications';
import { Auth } from '../components/Auth/Auth';
import { useLogin } from '@/store/useLogin';

export const MyPageScreen = () => {
  const isLoggedIn = useLogin(state => state.isLoggedIn)

  return (
    <View style={styles.container}>
      {isLoggedIn ? <Notification /> : <Auth />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 26,
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
});
