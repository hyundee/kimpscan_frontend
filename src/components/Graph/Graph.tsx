import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const Graph = () => {
  return (
    <View style={styles.container}>
      {/* <View style={styles.exchange}>
        <Text>
          달러 원 환율 : <Text style={styles.exchangeText}>1440원</Text>
        </Text>
      </View> */}
      <View style={styles.graph}>
        <Text style={styles.text}>꺾은선 그래프</Text>
      </View>
    </View>
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
