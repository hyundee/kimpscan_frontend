import React, { useEffect } from 'react';

import { requestNotificationPermission } from './src/utils/requestNotificationPermission';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import messaging from '@react-native-firebase/messaging';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { getApp } from '@react-native-firebase/app';
import { Alert } from 'react-native';
import { useFcm } from '@/store/useFcm';

function App(): React.JSX.Element {
  const setFcmKey = useFcm(state => state.setFmcKey)

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const fetchFCMToken = async () => {
      const app = getApp();
      const messaging = getMessaging(app);
      const maxRetries = 3;
      let token = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          token = await getToken(messaging);
          if (token) {
            console.log('FCM Token:', token);
            setFcmKey(token)
            break; // 성공하면 반복문 탈출
          }
        } catch (error) {
          console.warn(`FCM 토큰 불러오기 실패 (시도 ${attempt + 1}):`, error);
        }
      }

      if (!token) {
        Alert.alert("FCM 키를 불러오는데 실패했습니다. 네트워크 상태를 확인해주시고 그래도 동작하지 않으면 앱을 재시작해주세요.")
      }
    };

    fetchFCMToken();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
