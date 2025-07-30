export type AlarmData = {
  id: number;
  userId: number;
  symbol: string;
  stockName: string;
  kimpPercent: number;
  silentTime: number;
  createdAt: string;
};

export type NotificationHistoryData = {
  id: number;
  settingId: number;
  title: string;
  content: string;
  send: boolean;
  createdAt: string;
}

