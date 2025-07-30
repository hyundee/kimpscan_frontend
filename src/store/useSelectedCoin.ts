import { create } from 'zustand';

interface ISelectedCoinState {
  coin: string;
  setCoin: (coin: string) => void;
}

export const useSelectedCoin = create<ISelectedCoinState>(set => ({
  coin: 'XRPUSDT',
  setCoin: coin => set({ coin }),
}));
