import { STORAGE_KEYS } from "@/constants/storage-keys";
import { URLS } from "@/constants/urls";
import { navigate } from "@/navigation/AppNavigator";
import { useLogin } from "@/store/useLogin";
import axios from "axios";
import * as Keychain from 'react-native-keychain';

// 훅 대신 상태 스토어 직접 접근
const loginStore = useLogin.getState();

const authAxios = axios.create({
  baseURL: URLS.API_URL,
});

// 요청 인터셉터: accessToken 넣기
authAxios.interceptors.request.use(async config => {
  const creds = await Keychain.getInternetCredentials(STORAGE_KEYS.ACCESS_TOKEN);
  console.log("creds", creds)
  if (!creds) {
    return config
  }

  const token = creds?.password;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

// 토큰 갱신 함수
const refreshAccessToken = async () => {
  try {
    const refreshCreds = await Keychain.getInternetCredentials(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshCreds) throw new Error("No refresh token found");

    const refreshToken = refreshCreds.password;

    // Bearer 토큰으로 헤더에 포함
    const response = await axios.post(`${URLS.API_URL}/auth/refresh`, null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const { accessToken, accessTokenExpiry, refreshToken: newRefreshToken, refreshTokenExpiry } = response.data;

    // 저장
    await Keychain.setInternetCredentials(STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await Keychain.setInternetCredentials(STORAGE_KEYS.REFRESH_TOKEN, STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
    await Keychain.setInternetCredentials(STORAGE_KEYS.ACCESS_TOKEN_EXPIRY, STORAGE_KEYS.ACCESS_TOKEN_EXPIRY, accessTokenExpiry);
    await Keychain.setInternetCredentials(STORAGE_KEYS.REFRESH_TOKEN_EXPIRY, STORAGE_KEYS.REFRESH_TOKEN_EXPIRY, refreshTokenExpiry);

    return accessToken;
  } catch (e) {
    console.error("Failed to refresh token", e);
    throw e;
  }
}

// 응답 인터셉터: 토큰 만료 감지 후 갱신 및 재시도
authAxios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 이면서, 이미 재시도한 요청이 아니면 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();

        // 새로운 토큰으로 Authorization 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 재요청
        return authAxios(originalRequest);
      } catch (refreshError) {

        // 로그인 페이지로 이동
        loginStore.signOut();
        navigate({ name: "MyPage", params: undefined });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authAxios;

