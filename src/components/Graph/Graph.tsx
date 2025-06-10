import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useSelectedCoin} from '../../store/useSelectedCoin';
import {GraphLegend} from '../Legend/GraphLegend';

export const Graph = React.memo(() => {
  const coin = useSelectedCoin(state => state.coin);
  const ws = useRef<WebSocket | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const scrollRef = useRef<ScrollView>(null);

  const [initialData, setInitialData] = useState<{
    kimp: number[];
    ma5: number[];
    ma20: number[];
  } | null>(null);

  const [KimpPrice, setKimpPrice] = useState<number[]>([0]);
  const [ma5s, setMa5s] = useState<number[]>([0]);
  const [ma20s, setMa20s] = useState<number[]>([0]);

  useEffect(() => {
    if (!initialData) {
      axios
        .get(
          `https://api.kimpscan.com/exchange/moving-avgs/init?symbol=${coin}`,
        )
        .then(res => {
          const raw = res.data;
          const kimp = raw.map((item: number[]) => item[0]);
          const ma5 = raw.map((item: number[]) => item[1]);
          const ma20 = raw.map((item: number[]) => item[2]);

          setInitialData({kimp, ma5, ma20});
        })
        .catch(err => console.error('Error fetching:', err));
    }
  }, [coin, initialData]);

  useEffect(() => {
    ws.current = new WebSocket(
      'wss://api.kimpscan.com/ws/exchange/moving-avgs',
      undefined,
      {
        headers: {
          Origin: 'https://kimpscan.com',
        },
      },
    );

    ws.current.onopen = () => {
      console.log('✅ 웹소켓 연결됨');
      ws.current?.send(coin);
      console.log('📤 웹소켓 전송:', coin);
    };

    ws.current.onmessage = event => {
      if (!event.data) return;

      const parsedData = JSON.parse(event.data);
      const [newKimp, newMa5, newMa20] = parsedData;

      setKimpPrice(prev => {
        return [...prev, newKimp].slice(-20);
      });

      setMa5s(prev => [...prev, newMa5].slice(-20));
      setMa20s(prev => [...prev, newMa20].slice(-20));
    };

    ws.current.onerror = error => {
      console.log('이동평균 웹소켓 오류:', error.message);
    };

    ws.current.onclose = () => {
      console.log('Websocket connection is closed');
    };

    return () => {
      console.log('🧹 웹소켓 정리');
      ws.current?.close();
    };
  }, [coin]);

  const labels = KimpPrice.map((_, index) =>
    index === 0 || (index + 1) % 5 === 0 ? `${index + 1}초` : '',
  );

  const data = {
    labels,
    datasets: [
      {
        data: KimpPrice,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 4,
      },
      {
        data: ma5s,
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
        strokeWidth: 4,
      },
      {
        data: ma20s,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <GraphLegend />
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}>
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
            formatYLabel: yValue => Number(yValue).toFixed(2),
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
});

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
