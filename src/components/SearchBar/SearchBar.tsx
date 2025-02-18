import React, {useState} from 'react';

import {View, TextInput, Text, StyleSheet} from 'react-native';

export const SearchBar = () => {
  const [text, setText] = useState('');

  const handleChangeText = (newText: string) => {
    setText(newText);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleChangeText}
        placeholder="검색어를 입력해주세요">
        <Text style={styles.text}>{text}</Text>
      </TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 35,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});
