import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Notification } from '../components/Notification/Notifications';
import { Auth } from '../components/Auth/Auth';

export const MyPageScreen = () => {

  return <Auth />

  return (
    <View style={styles.container}>
      <Notification />
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
