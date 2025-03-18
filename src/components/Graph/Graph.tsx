import React from 'react';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

export const Graph = () => {
  const screenWidth = Dimensions.get('window').width; // 화면의 가로 크기
  const screenHeight = Dimensions.get('window').height; // 화면의 세로 크기

  const data = {
    labels: [
      '12:00',
      '1',
      '2',
      '3:00',
      '4',
      '5',
      '6:00',
      '7',
      '8',
      '9:00',
      '10',
      '11',
    ], // X-axis labels
    datasets: [
      {
        data: [20, 45, 28, 80, 99], // 첫 번째 꺾은선 데이터
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // 첫 번째 선의 색상
        strokeWidth: 2, // 선의 두께
        fill: false,
      },
      {
        data: [30, 60, 40, 90, 75], // 두 번째 꺾은선 데이터
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // 두 번째 선의 색상
        strokeWidth: 2, // 선의 두께
        fill: false,
      },
      {
        data: [10, 30, 50, 70, 60], // 세 번째 꺾은선 데이터
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // 세 번째 선의 색상
        strokeWidth: 2, // 선의 두께
        fill: false,
      },
    ],
  };

  return (
    <ScrollView horizontal={true} style={styles.container}>
      <View>
        <LineChart
          data={data}
          width={screenWidth} // 차트의 너비
          height={220} // 차트의 높이
          chartConfig={{
            decimalPlaces: 2, // 소수점 자리 수
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    // paddingTop: 26,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
  },
});
