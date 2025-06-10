import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

export const NotificationModal = () => {
  return (
    <View style={styles.modal}>
      <Text>종목</Text>
      <Text>김치프리미엄</Text>
      <TextInput>5.8%</TextInput>
      <Text>동일 알람 방지 기간</Text>
      <TextInput>3600분</TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'flex-start',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    padding: 10,
    textAlign: 'center',
  },
  modal: {},
});
