export type Coins = {
  usdWonExRage: number;
  kimpTickerMap: Record<string, CoinInfo>;
};

export type CoinInfo = {
  rootSymbol?: string;
  korName?: string;
  wonPrice?: string;
  wonOldPrice?: string;
  won24hVolume?: string;
  usdtPrice?: string;
  usdtOldPrice?: string;
  usdt24hVolume?: string;
  kimp?: string;
};
