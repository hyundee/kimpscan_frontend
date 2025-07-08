import { AlarmData } from '@/types/notification';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TableWrapper } from 'react-native-table-component';
import { Row } from 'react-native-table-component';
import { Table } from 'react-native-table-component';

interface INotificationListProps {
  data: AlarmData[]
}

export const NotificationList = ({ data }: INotificationListProps) => {
  const headerTitles = ['종목', '김프', '동일알람\n방지기간'];

  const getRow = (rawRow: AlarmData) => {
    const rootSymbol = rawRow.symbol.slice(0, -4);
    const kimp = `${rawRow.kimpPercent}%`
    const slientTime = `${rawRow.silentTime}초`

    return [rootSymbol, kimp, slientTime]

  }

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
            {data.map((rowData, rowIndex) => (
              <Row
                textStyle={styles.rowText}
                key={rowIndex}
                data={getRow(rowData)}
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
