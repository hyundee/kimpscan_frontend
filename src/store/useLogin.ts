import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface Login {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  hasJwt: boolean;
  setHasJwt: (hasJwt: boolean) => void;
  saveJwt: (authResp: AuthResp) => Promise<void>;
  getJwt: (key: keyof AuthResp) => Promise<string | null>;
  clearJwt: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useLogin = create<Login>()((set, get) => ({
  isLoggedIn: false,
  setIsLoggedIn: isLoggedIn => set({ isLoggedIn }),
  hasJwt: false,
  setHasJwt: hasJwt => set({ hasJwt }),
  saveJwt: async (authResp: AuthResp) => {
    await Keychain.setInternetCredentials(STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.ACCESS_TOKEN, authResp.accessToken);
    await Keychain.setInternetCredentials(STORAGE_KEYS.REFRESH_TOKEN, STORAGE_KEYS.REFRESH_TOKEN, authResp.refreshToken);
    await Keychain.setInternetCredentials(STORAGE_KEYS.ACCESS_TOKEN_EXPIRY, STORAGE_KEYS.ACCESS_TOKEN_EXPIRY, authResp.accessTokenExpiry);
    await Keychain.setInternetCredentials(STORAGE_KEYS.REFRESH_TOKEN_EXPIRY, STORAGE_KEYS.REFRESH_TOKEN_EXPIRY, authResp.refreshTokenExpiry);
  },
  getJwt: async (key: keyof AuthResp) => {
    const result = await Keychain.getInternetCredentials(key);
    if (result) {
      return result.password
    }

    return null
  },
  clearJwt: async () => {
    await Keychain.resetInternetCredentials({ server: STORAGE_KEYS.ACCESS_TOKEN })
    await Keychain.resetInternetCredentials({ server: STORAGE_KEYS.REFRESH_TOKEN })
    await Keychain.resetInternetCredentials({ server: STORAGE_KEYS.ACCESS_TOKEN_EXPIRY })
    await Keychain.resetInternetCredentials({ server: STORAGE_KEYS.REFRESH_TOKEN_EXPIRY })
  },
  signOut: async () => {
    // 구글 로그아웃
    await GoogleSignin.revokeAccess(); // 이전 액세스 권한 취소
    await GoogleSignin.signOut(); // 로그아웃

    // jwt 삭제
    await get().clearJwt();
  }
}));

