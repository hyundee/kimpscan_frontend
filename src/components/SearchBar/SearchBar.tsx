import React, {useState} from 'react';

import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import SearchIcon from 'react-native-vector-icons/Ionicons';

interface ISearchBar {
  query: string;
  handleSearch: (text: string) => void;
}

export const SearchBar = ({query, handleSearch}: ISearchBar) => {
  const [text, setText] = useState(query);

  const togglehandler = () => {
    handleSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="종목명을 입력하세요"
      />
      <TouchableOpacity onPress={togglehandler}>
        <SearchIcon style={styles.icon} name="search" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    width: '60%',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});
