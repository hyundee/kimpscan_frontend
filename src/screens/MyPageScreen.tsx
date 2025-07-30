import React from 'react';
import { View, StyleSheet, Alert, Button } from 'react-native';
import { Notification } from '../components/Notification/Notifications';
import { Auth } from '../components/Auth/Auth';
import { useLogin } from '@/store/useLogin';
import { navigate } from '@/navigation/AppNavigator';
import { NotificationHistory } from '@/components/NotificationHistory/NotificationHistories';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';

export const MyPageScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'MyPage'>>();
  const onNotificationHistory = route.params && route.params.onNotificationHistory
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
          <Button title="로그아웃" onPress={handleSignOut} />
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
    paddingTop: 26,
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
});
