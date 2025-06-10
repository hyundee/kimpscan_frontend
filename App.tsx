import React, {useEffect} from 'react';

import {requestNotificationPermission} from './src/utils/requestNotificationPermission';
import {getMessaging, getToken} from '@react-native-firebase/messaging';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation/AppNavigator';
import {getApp} from '@react-native-firebase/app';

function App(): React.JSX.Element {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const fetchFCMToken = async () => {
      const app = getApp();
      const messaging = getMessaging(app);
      const token = await getToken(messaging);
      console.log('FCM Token:', token);
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
