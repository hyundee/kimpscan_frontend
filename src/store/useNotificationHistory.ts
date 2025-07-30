import { create } from 'zustand';

interface INotificationHistoryState {
  onNotificationHistory: boolean;
  setOnNotificationHistory: (onNotificationHistory: boolean) => void;
}

export const useNotificationHistory = create<INotificationHistoryState>(set => ({
  onNotificationHistory: false,
  setOnNotificationHistory: onNotificationHistory => set({ onNotificationHistory }),
}));
