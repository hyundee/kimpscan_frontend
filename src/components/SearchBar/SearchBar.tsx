import React, {useState} from 'react';

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import SearchIcon from 'react-native-vector-icons/Ionicons';

export const SearchBar = () => {
  const [isActiveSearchbar, setIsActiveSearchbar] = useState(false);
  const [text, setText] = useState('');

  const togglehandler = () => {
    setIsActiveSearchbar(prev => !prev);
  };

  const handleChangeText = (newText: string) => {
    setText(newText);
  };

  return (
    <View style={styles.container}>
      {isActiveSearchbar && (
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleChangeText}
          placeholder="검색">
          <Text style={styles.text}>{text}</Text>
        </TextInput>
      )}
      <TouchableOpacity onPress={togglehandler}>
        <SearchIcon style={styles.icon} name="search" size={25} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 5,
  },
  input: {
    height: 25,
    boxSizing: 'border-box',
    borderRadius: 5,
    backgroundColor: '#efefef',
    borderColor: '#efefef',
    borderWidth: 1,
    padding: 5,
    width: '65%',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});
