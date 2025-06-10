// src/utils/requestNotificationPermission.ts
import {PermissionsAndroid, Platform} from 'react-native';
import {
  getMessaging,
  requestPermission,
} from '@react-native-firebase/messaging';
import {getApp} from '@react-native-firebase/app';

export async function requestNotificationPermission() {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  // iOS
  const app = getApp();
  const messaging = getMessaging(app);
  const authStatus = await requestPermission(messaging);

  const enabled =
    authStatus === 1 || // messaging.AuthorizationStatus.AUTHORIZED
    authStatus === 2; // messaging.AuthorizationStatus.PROVISIONAL

  return enabled;
}
