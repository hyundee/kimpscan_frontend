import { create } from 'zustand';

interface SelectedCoinState {
  coin: string;
  setCoin: (coin: string) => void;
}

export const useSelectedCoin = create<SelectedCoinState>(set => ({
  coin: 'XRPUSDT',
  setCoin: coin => set({ coin }),
}));
