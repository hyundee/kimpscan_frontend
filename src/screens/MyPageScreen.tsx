import React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { Notification } from '../components/Notification/Notifications';
import { Auth } from '../components/Auth/Auth';
import { useLogin } from '@/store/useLogin';
import { navigate } from '@/navigation/AppNavigator';
import { NotificationHistory } from '@/components/NotificationHistory/NotificationHistories';
import { useNotificationHistory } from '@/store/useNotificationHistory';

export const MyPageScreen = () => {
  const onNotificationHistory = useNotificationHistory(state => state.onNotificationHistory)
  const isLoggedIn = useLogin(state => state.isLoggedIn)
  const signOut = useLogin(state => state.signOut)
  const handleSignOut = async () => {
    try {
      await signOut()
      navigate({ name: "Home", params: undefined })
    } catch (error: any) {
      Alert.alert('로그아웃 오류', `로그아웃 중 오류 발생: ${error.message}`);
      console.error(error);
    }
  };

  return (
    isLoggedIn ? (
      onNotificationHistory ? (
        <View style={styles.container}>
          <NotificationHistory />
        </View>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
          <Notification />
        </View>
      )
    ) : (
      <View style={styles.container}>
        <Auth />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 2,
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
