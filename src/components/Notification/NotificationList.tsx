import { AlarmData } from '@/types/notification';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TableWrapper, Cell, Table } from 'react-native-table-component';

interface INotificationListProps {
  data: AlarmData[];
  onDeleteAlarm: (settingId: number) => void;
  onSelectAlarm: (alarmData: AlarmData) => void;
}

export const NotificationList = ({ data, onDeleteAlarm, onSelectAlarm }: INotificationListProps) => {
  const headerTitles = ['종목', '김프', '동일알람\n방지기간', '삭제'];

  const getRow = (rawRow: AlarmData) => {
    const rootSymbol = <Text style={styles.rowText}>{rawRow.symbol.slice(0, -4)}</Text>
    const kimp = <Text style={styles.rowText}>{`${rawRow.kimpPercent}%`}</Text>
    const slientTime = <Text style={styles.rowText}>{`${rawRow.silentTime}초`}</Text>
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
          <TableWrapper style={styles.headerRowContainer}>
            {headerTitles.map((item, colIndex) => (
              <Cell
                key={colIndex}
                data={
                  < View style={styles.cellInner}>
                    <Text style={styles.headerRowText}>{item}</Text>
                  </View>
                }
                style={styles.cell}
              />
            ))}
          </TableWrapper>
          <TableWrapper>
            {data.map((rowData, rowIndex) => (
              <TouchableOpacity
                key={rowIndex}
                onPress={() => onSelectAlarm(rowData)}
              >
                <TableWrapper style={styles.rowContainer}>
                  {getRow(rowData).map((item, colIndex) => (
                    <Cell
                      key={colIndex}
                      data={item} // JSX도 OK
                      textStyle={styles.rowText} // 이 경우 object여야 함!
                    />
                  ))}
                </TableWrapper>
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
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderColor: '#C1C0B9',
  },
  cell: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#C1C0B9',
  },
  cellInner: {
    flex: 1,
    justifyContent: 'center', // 👈 핵심!
  },
  headerRowText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 10,
  },
  rowText: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 10,
    color: 'black',
    fontWeight: 'normal',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   },
});
