import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {View, StyleSheet, Text} from 'react-native';
import {TickerTable} from '../components/Table/TickerTable';
import {Graph} from '../components/Graph/Graph';
import {Coins} from '../types/coins';

export const HomeScreen = () => {
  const ws = useRef<WebSocket | null>(null);
  const [coins, setCoins] = useState<Coins>({
    usdWonExRage: 0,
    kimpTickerMap: {},
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.kimpscan.com/exchange/tickers/init?symbol=XRPUSDT',
      );
      console.log('Data:', response.data);
      setCoins(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log('fetchData 렌더링');
  }, []);

  useEffect(() => {
    ws.current = new WebSocket('wss://clarify.kr/ws/exchange/tickers');

    ws.current.onopen = () => {
      console.log('웹소켓 연결 성공');
      // setIsLoading(false);
    };

    ws.current.onmessage = event => {
      if (event.data) {
        const parsedData =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        setCoins(prev => ({
          ...prev,
          usdWonExRage: parsedData.usdWonExRage ?? prev?.usdWonExRage,
          kimpTickerMap: {
            ...prev?.kimpTickerMap,
            ...Object.entries(parsedData.kimpTickerMap || {}).reduce(
              (acc, [key, newCoinInfo]) => ({
                ...acc,
                [key]: {
                  ...prev?.kimpTickerMap?.[key], // 기존 코인 정보 유지
                  ...(typeof newCoinInfo === 'object' && newCoinInfo !== null
                    ? newCoinInfo
                    : {}), // 새로 받은 값만 업데이트
                },
              }),
              {},
            ),
          },
        }));
      }
    };

    ws.current.onerror = error => {
      console.log('웹소켓 오류:', error.message);
    };

    ws.current.onclose = () => {
      console.log('Websocket connection is closed');
    };

    return () => {
      if (ws.current && ws.current.readyState === 1) {
        ws.current.close();
      }
    };
  }, [coins]);

  // console.log(coins);

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
      <TickerTable data={coins.kimpTickerMap} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 26,
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
