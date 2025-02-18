import React from 'react';

import {StyleSheet, Text, View} from 'react-native';

export const InformationBar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>달러 원 환율 : </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  text: {
    fontSize: 15,
  },
});
