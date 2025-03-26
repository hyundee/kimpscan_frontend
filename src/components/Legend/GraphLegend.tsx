import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export const GraphLegend = () => {
  const [active, setActive] = useState(false);
  return (
    <TouchableWithoutFeedback onPress={() => active && setActive(false)}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.chartLegend} onPress={() => setActive(prev => !prev)}>
          {
            active && <View style={styles.chartLegendText}>
              <Text style={styles.TitleText}>* 꺽은선 그래프</Text>
              <Text style={styles.Text}>- 현재 김프</Text>
              <Text style={styles.Text}>- 5초 이동평균</Text>
              <Text style={styles.Text}>- 20초 이동평균</Text>
            </View>
          }
          <Icon name="information-circle-outline" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  chartLegend: {
    position : 'relative',
    alignSelf: 'flex-end',
    marginVertical : 5,
    marginRight: 5,
    zIndex:1,
  },
  chartLegendText : {
    position: 'absolute',
    right : 28,
    top : 0,
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
