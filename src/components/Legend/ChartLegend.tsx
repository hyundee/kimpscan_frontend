import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export const ChartLegend = () => {
  const [active, setActive] = useState(false);
  return (
    <TouchableOpacity style={styles.chartLegend} onPress={() => setActive(prev => !prev)}>
      {
        active && <View style={styles.chartLegendText}>
          <Text style={styles.TitleText}>* 갱신주기</Text>
          <Text style={styles.Text}>1일: 달러 원 환율</Text>
          <Text style={styles.Text}>5초: 바이낸스 24시간 거래량</Text>
          <Text style={styles.Text}>1초: 그 외</Text>
        </View>
      }
      <Icon name="information-circle-outline" size={25} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chartLegend: {
    position : 'relative',
    alignSelf: 'flex-end',
    marginBottom : 5,
    marginRight: 5,
  },
  chartLegendText : {
    position: 'absolute',
    right : 26,
    bottom : 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical :8,
    borderRadius: 15,
    borderWidth : 1.5,
    // borderColor : '#000',
  },
  TitleText : {
    fontSize : 12,
    fontWeight : 'bold',
  },
  Text : {
    fontSize : 12,
  },
});
