import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import { useSelectedCoin } from '../../store/useSelectedCoin';
import { GraphLegend } from '../Legend/GraphLegend';

export const Graph = () => {
  const coin = useSelectedCoin(state => state.coin);
  const ws = useRef<WebSocket | null>(null);
  const screenWidth = Dimensions.get('window').width; // 화면의 가로 크기
  // const screenHeight = Dimensions.get('window').height; // 화면의 세로 크기
  const scrollRef = useRef<ScrollView>(null);

  const [priceMovingAverage, setPriceMovingAverage] = useState<number[][]>([]);
  // const [webSocket, setWebSocket] = useState<number[]>([]);
  const [KimpPrice, setKimpPrice] = useState<number[]>([0]);
  const [ma5s, setMa5s] = useState<number[]>([0]);
  const [ma20s, setMa20s] = useState<number[]>([0]);

  useEffect(() => {
      console.log('선택된 코인:', coin);
      fetchData(coin);

  }, [coin]);

  const fetchData = async (symbol : string) => {
    try {
      const response = await axios.get(
        `https://clarify.kr/exchange/moving-avgs/init?symbol=${symbol}`,
      );
      console.log('Data:', response.data);
      setPriceMovingAverage(response.data);
    } catch (error) {
      console.error('Error fetching MovingAvgs data:', error);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useEffect(() => {
    if (priceMovingAverage.length > 0) {
      setKimpPrice(priceMovingAverage.map((item: number[]) => item[0]));
      setMa5s(priceMovingAverage.map((item: number[]) => item[1]));
      setMa20s(priceMovingAverage.map((item: number[]) => item[2]));
    }
  }, [priceMovingAverage]);

  useEffect(() => {
    ws.current = new WebSocket('wss://clarify.kr/ws/exchange/moving-avgs');

    ws.current.onopen = () => {
      console.log('이동평균 웹소켓 연결 성공');
      // ws.current.send(JSON.stringify('XRPUSDT'));
      if (ws.current && ws.current.readyState === 1) {
        ws.current.send(coin);
        console.log('웹소켓 메시지 전송:', coin);
      } else {
        console.log('웹소켓이 아직 연결되지 않았거나 닫혀 있음.');
      }
    };

    ws.current.onmessage = event => {
      if (event.data) {
        const parsedData = JSON.parse(event.data);

        // setWebSocket(parsedData);
        setKimpPrice(prev => [...prev, parsedData[0]].slice(-20));
        setMa5s(prev => [...prev, parsedData[1]].slice(-20));
        setMa20s(prev => [...prev, parsedData[2]].slice(-20));
      }
    };

    ws.current.onerror = error => {
      console.log('이동평균 웹소켓 오류:', error.message);
    };

    ws.current.onclose = () => {
      console.log('Websocket connection is closed');
    };

    return () => {
      if (ws.current && ws.current.readyState === 1) {
        ws.current.close();
      }
    };
  }, [coin]);

  // useEffect(() => {
  //   if (KimpPrice.length > 0) {
  //     scrollRef.current?.scrollToEnd({ animated: true });
  //   }
  // }, [KimpPrice]);

  // const chartWidth = Math.max(KimpPrice.length * 40, screenWidth);
  const labels = KimpPrice.map((_, index) =>
    index === 0 || (index + 1) % 5 === 0 ? `${index + 1}초` : ''
  );

  const data = {
    labels,
    datasets: [
      {
        data: KimpPrice,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 4, // 선의 두께
      },
      {
        data: ma5s,
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
        strokeWidth: 4, // 선의 두께
      },
      {
        data: ma20s,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 4, // 선의 두께
      },
    ],
  };

  return (
    <View style={styles.container}>
      <GraphLegend />
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} >
          <LineChart
            key={KimpPrice.length}
            data={data}
            width={screenWidth}
            height={180}
            withShadow={false}
            withDots={false}
            // segments={10}
            // yLabelsOffset={30}
            style={styles.graph}
            chartConfig={{
              formatYLabel: (yValue) => Number(yValue).toFixed(2),
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
          />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    fontSize: 24,
  },
  // exchange: {
  //   backgroundColor: 'red',
  //   alignItems: 'flex-start',
  //   justifyContent: 'center',
  //   padding: 5,
  //   borderTopWidth: 1,
  // },
  // exchangeText: {
  //   color: '#000',
  // },
  graph: {
    marginLeft: -20,
  },
});
