import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
// import {Cell} from 'react-native-table-component';
import {TableWrapper} from 'react-native-table-component';
import {Row} from 'react-native-table-component';
import {Table} from 'react-native-table-component';

type AlarmData = {
  rootSymbol: string;
  kimp: string;
  date: string;
};

export const NotificationList = () => {
  const [alarmData, setAlarmData] = useState<AlarmData[]>([]);

  const headerTitles = ['종목', '김프', '동일알람\n방지기간'];

  useEffect(() => {
    setAlarmData([
      {
        rootSymbol: 'BTC',
        kimp: '3.25%',
        date: '3600분',
      },
      {
        rootSymbol: 'ETH',
        kimp: '1.02',
        date: '1000분',
      },
      {
        rootSymbol: 'SOL',
        kimp: '0.78',
        date: '2200분',
      },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Table borderStyle={styles.tableBorder}>
          <Row
            style={styles.header}
            data={headerTitles.map((title, index) => {
              return (
                <Text key={index} style={styles.headerText}>
                  {title}
                </Text>
              );
            })}
          />
          <TableWrapper>
            {alarmData.map((rowData, rowIndex) => (
              <Row
                textStyle={styles.rowText}
                key={rowIndex}
                data={[rowData.rootSymbol, rowData.kimp, rowData.date]}
              />
            ))}
          </TableWrapper>
        </Table>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: '#C1C0B9',
  },
  header: {
    height: 50,
    backgroundColor: '#000',
  },
  headerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  rowText: {
    textAlign: 'center',
    paddingVertical: 6,
  },
});
