import React, {useEffect} from 'react';

import {requestNotificationPermission} from './src/utils/requestNotificationPermission';
import messaging from '@react-native-firebase/messaging';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        console.log('📱 FCM Token:', token);
        // 이 토큰을 백엔드 서버에 저장해도 됨
      });
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
