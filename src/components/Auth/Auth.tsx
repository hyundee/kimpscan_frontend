import { Alert, View } from "react-native"
import { GoogleAuth } from "./GoogleAuth"
import { URLS } from "@/constants/urls";
import { useFcm } from "@/store/useFcm";
import { useEffect } from "react";
import { useLogin } from "@/store/useLogin";
import authAxios from "@/lib/authAxios";
import axios from "axios";

export const Auth = () => {
  const fcmKey = useFcm(state => state.fcmKey);
  const hasJwt = useLogin(state => state.hasJwt)
  const setHasJwt = useLogin(state => state.setHasJwt)
  const setIsLoggedIn = useLogin(state => state.setIsLoggedIn)

  const requestToAddFcmKey = async () => {
    try {
      const url = `${URLS.MESSAGE_URL}/message/fcm`;
      const data = { token: fcmKey };
      await authAxios.post(url, data);
      console.log('FCM 키 등록 성공');
    } catch (error) {
      Alert.alert('FCM 키 등록 실패', 'FCM 키 등록 실패.');
      console.error('FCM 키 등록 실패', error)
      setHasJwt(false)
      throw error;
    }
  }

  useEffect(() => {
    if (hasJwt) {
      requestToAddFcmKey();
      setIsLoggedIn(true);
    }

  }, [hasJwt])


  return <View>
    <GoogleAuth />
  </View>
}
