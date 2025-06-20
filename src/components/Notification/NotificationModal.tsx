import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';

export const NotificationModal = () => {
  const [selectedValue, setSelectedValue] = useState('BTC');

  return (
    <View style={styles.container}>
      <Text style={styles.text}>종목</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={itemValue => setSelectedValue(itemValue)}
        style={styles.input}>
        <Picker.Item label="BTC" value="BTC" />
        <Picker.Item label="ETH" value="ETH" />
        <Picker.Item label="SOL" value="SOL" />
        <Picker.Item label="AXL" value="AXL" />
      </Picker>
      <Text style={styles.text}>김치프리미엄</Text>
      <TextInput style={styles.input}>5.8%</TextInput>
      <Text style={styles.text}>동일 알람 방지 기간</Text>
      <TextInput style={styles.input}>3600분</TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#e2e2e2',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    color: '#000',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 10,
  },
});
