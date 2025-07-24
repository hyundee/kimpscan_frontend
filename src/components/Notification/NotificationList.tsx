import { AlarmData } from '@/types/notification';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TableWrapper } from 'react-native-table-component';
import { Row } from 'react-native-table-component';
import { Table } from 'react-native-table-component';

interface INotificationListProps {
  data: AlarmData[];
  onDeleteAlarm: (settingId: number) => void;
  onSelectAlarm: (alarmData: AlarmData) => void;
}

export const NotificationList = ({ data, onDeleteAlarm, onSelectAlarm }: INotificationListProps) => {
  const headerTitles = ['종목', '김프', '동일알람\n방지기간', '삭제'];

  const getRow = (rawRow: AlarmData) => {
    const rootSymbol = rawRow.symbol.slice(0, -4);
    const kimp = `${rawRow.kimpPercent}%`
    const slientTime = `${rawRow.silentTime}초`
    const deleteButton = (
      <TouchableOpacity
        onPress={(event) => {
          event.stopPropagation();

          // 삭제 확인 대화상자 표시
          Alert.alert(
            "알람 삭제",
            `${rootSymbol} 알람을 정말 삭제하시겠습니까?`,
            [
              {
                text: "취소",
                style: "cancel"
              },
              {
                text: "삭제",
                onPress: () => { onDeleteAlarm(rawRow.id) }, // 부모로부터 받은 삭제 함수 호출
                style: "destructive" // iOS에서 "삭제" 버튼을 빨간색으로 표시
              }
            ],
            { cancelable: true }
          );
        }}
        style={styles.deleteButton}
      >
        <Text>❌</Text>
      </TouchableOpacity>
    );

    return [rootSymbol, kimp, slientTime, deleteButton]
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
              <TouchableOpacity
                key={rowIndex}
                onPress={() => onSelectAlarm(rowData)}
              >
                <Row
                  textStyle={styles.rowText}
                  key={rowIndex}
                  data={getRow(rowData)}
                />
              </TouchableOpacity>
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
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
