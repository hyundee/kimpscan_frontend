import { create } from 'zustand';

interface IFcm {
  fcmKey: string | null;
  setFmcKey: (fcmKey: string) => void;
}

export const useFcm = create<IFcm>(set => ({
  fcmKey: null,
  setFmcKey: fcmKey => set({ fcmKey }),
}));
