import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {Table} from '../components/Table/Table';
import {Graph} from '../components/Graph/Graph';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Graph />
      <Table />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// export default HomeScreen;
