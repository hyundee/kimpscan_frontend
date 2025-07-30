import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { View, StyleSheet, Text } from 'react-native';
import { TickerTable } from '../components/Table/TickerTable';
import { Graph } from '../components/Graph/Graph';
import { Coins } from '../types/coins';
import { URLS } from '@/constants/urls';

export const HomeScreen = () => {
  const ws = useRef<WebSocket | null>(null);
  const [coins, setCoins] = useState<Coins>({
    usdWonExRage: 0,
    kimpTickerMap: {},
  });
  const [isDiffCoin, setIsDiffCoin] = useState<boolean>(false);
  const [isAfterInit, setIsAfterInit] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${URLS.API_URL}/exchange/tickers/init`,
      );
      setCoins(response.data);
      setIsDiffCoin(false);
      setIsAfterInit(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isAfterInit) {
      return;
    }

    const websocketUrl = URLS.API_URL
          .replace("http://", "wss://") 
          .replace("https://", "wss://")

    ws.current = new WebSocket(
      `${websocketUrl}/ws/exchange/tickers`,
      undefined,
      {
        headers: {
          Origin: 'https://kimpscan.com',
        },
      },
    );

    ws.current.onopen = () => {
      console.log('웹소켓 연결 성공');
      // ws.current?.send(coins);
    };

    ws.current.onmessage = event => {
      if (!event.data) return;

      const parsedData =
        typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      setCoins(parsedData);
      setIsDiffCoin(true);
    };

    ws.current.onerror = error => {
      console.log('웹소켓 오류:', error.message);
    };

    ws.current.onclose = () => {
      console.log('Websocket connection is closed');
    };

    return () => {
      console.log('웹소켓 정리');
      ws.current?.close();
    };
  }, [isAfterInit]);

  return (
    <View style={styles.container}>
      <View style={styles.exchange}>
        <Text>
          달러 원 환율 :
          <Text style={styles.exchangeText}>{` ${(coins?.usdWonExRage).toFixed(
            0,
          )}원`}</Text>
        </Text>
      </View>
      <Graph />
      <TickerTable data={coins.kimpTickerMap} isDiffCoin={isDiffCoin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
  },
  exchange: {
    width: '100%',
    // backgroundColor: 'red',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 5,
    borderTopWidth: 1,
  },
  exchangeText: {
    fontWeight: 'bold',
    // color: 'red',
  },
});
