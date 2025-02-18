import React from 'react';

import {StyleSheet, Text, View} from 'react-native';

export const Table = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>김프 티커 테이블</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  text: {
    fontSize: 24,
  },
});
