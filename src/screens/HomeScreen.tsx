import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Table} from '../components/Table/Table';
import {Graph} from '../components/Graph/Graph';
// import {InformationBar} from '../components/InformationBar/InformationBar';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* <InformationBar /> */}
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
