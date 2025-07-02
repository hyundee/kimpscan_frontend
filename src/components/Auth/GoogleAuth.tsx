import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Alert } from "react-native";
import { StyleSheet } from "react-native";
import axios from "axios";
import { URLS } from "@/constants/urls";
import { useLogin } from "@/store/useLogin";

export const GoogleAuth = () => {
  const setHasJwt = useLogin(state => state.setHasJwt)
  const saveJwt = useLogin(state => state.saveJwt)
  const signOut = useLogin(state => state.signOut)
  const WEB_CLIENT_ID = "785700886834-l59i9ia3rk3kt9a4svmh156tbht9187u.apps.googleusercontent.com"

  useEffect(() => {
    configureGoogleSign();
  }, []);

  const configureGoogleSign = () => {
    GoogleSignin.configure({
      scopes: ['openid', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'], // 필요한 스코프
      webClientId: WEB_CLIENT_ID, // 웹 클라이언트 ID는 필수
      offlineAccess: true, // 오프라인 액세스를 요청하여 리프레시 토큰을 얻을 수 있습니다.
    });
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      const authCode = user.data?.serverAuthCode;
      console.log('user.data?.serverAuthCode', user.data?.serverAuthCode);
      if (!authCode) {
        throw new Error('Google로부터 인증 코드를 받지 못했습니다. 다시 시도해주세요.');
      }

      const url = `${URLS.API_URL}/login/oauth2/code/google/web?code=${authCode}`
      const resp = await axios.post<AuthResp>(url)

      saveJwt(resp.data)
      setHasJwt(true);
      // Alert.alert('로그인 성공', `환영합니다, ${user.data?.user.name}!`);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('로그인 취소', '사용자가 로그인을 취소했습니다.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('로그인 진행 중', '현재 로그인 작업이 진행 중입니다.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play 서비스 없음', 'Google Play 서비스가 설치되어 있지 않거나, 버전이 낮습니다.');
      } else {
        Alert.alert('로그인 오류', `알 수 없는 오류: ${error.message}`);
        console.error(error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut()
      Alert.alert('로그아웃', '성공적으로 로그아웃되었습니다.');
    } catch (error: any) {
      Alert.alert('로그아웃 오류', `로그아웃 중 오류 발생: ${error.message}`);
      console.error(error);
    }
  };

  return <View style={styles.container}>
    <Text style={styles.title}>Google Sign-In Example</Text>
    <GoogleSigninButton
      style={styles.button}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={signIn}
    />
    <View>
      <Text style={styles.loggedInText}>환영합니다 님!</Text>
      <Text style={styles.emailText}></Text>
      <Button title="로그아웃" onPress={handleSignOut} />
    </View>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: "100%",
    // backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    // color: '#333',
  },
  button: {
    width: 192,
    height: 48,
  },
  loggedInText: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5,
    // color: '#555',
  },
  emailText: {
    fontSize: 16,
    marginBottom: 20,
    // color: '#777',
  },
});

