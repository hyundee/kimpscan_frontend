import React, {useEffect, useState} from 'react';

import {ScrollView, StyleSheet, View} from 'react-native';
import {CoinInfo} from '../../types/coins';
import {Table, Row, Rows} from 'react-native-table-component';

interface ITickerTable {
  data: Record<string, CoinInfo> | undefined;
}

export const TickerTable = ({data}: ITickerTable) => {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const [coinList, setCoinList] = useState<Record<string, CoinInfo>>({});

  const tableHead = ['종목명', '김프', '거래비율', '즐겨찾기'];
  const tableData = Object.entries(coinList).map(([key, value]) => {
    const wonPrice = Number(value.wonPrice) || 0;
    const usdtPrice = Number(value.usdtPrice) || 0;
    // const wonVolume = Number(value.won24hVolume) || 0;
    // const usdtVolume = Number(value.usdt24hVolume) || 0;

    return [
      value.rootSymbol,
      value.korName,
      value.kimp,
      wonPrice,
      usdtPrice, // usdtPrice가 0이면 나누기 오류 방지
    ];
  });

  useEffect(() => {
    if (data) {
      setCoinList(prevCoinList => {
        const updatedCoinList = {...prevCoinList}; // 이전 데이터를 복사

        // data의 각 항목만 갱신
        Object.entries(data).forEach(([key, value]) => {
          updatedCoinList[key] = value; // 기존 항목만 덮어쓰기
        });

        return updatedCoinList; // 변경된 상태 반환
      });
    }
  }, [data]);
  // console.log(data);
  // console.log(data, tableData);
  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>김프 티커 테이블</Text> */}
      <ScrollView style={styles.scrollView}>
        <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
          <Row
            data={tableHead}
            style={{height: 50, backgroundColor: '#f1f8ff'}}
            textStyle={{textAlign: 'center'}}
          />
          <Rows data={tableData} textStyle={{textAlign: 'center'}} />
        </Table>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: 'black',
    borderTopWidth: 2,
  },
  scrollView: {
    width: '100%',
  },
  text: {
    fontSize: 24,
  },
});
