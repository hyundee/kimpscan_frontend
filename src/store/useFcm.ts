import { create } from 'zustand';

interface IFcmState {
  fcmKey: string | null;
  setFmcKey: (fcmKey: string) => void;
}

export const useFcm = create<IFcmState>(set => ({
  fcmKey: null,
  setFmcKey: fcmKey => set({ fcmKey }),
}));
