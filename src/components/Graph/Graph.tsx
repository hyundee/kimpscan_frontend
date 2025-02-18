import React from 'react';

import {StyleSheet, Text, View} from 'react-native';

export const Graph = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>꺾은선 그래프</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 4,
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
