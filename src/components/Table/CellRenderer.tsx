import React, { useMemo, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ITableDataRow } from '../../types/CoinTable';

const CELL_DATA_TYPES = ["symbol", "kimpPrice", "volumeRatio", ] as const;
type TCellDataType = typeof CELL_DATA_TYPES[number];

interface CellRendererProps {
  cellDataType: TCellDataType;
  cellData: ITableDataRow[keyof ITableDataRow];
}

const renderCellContent = ({ cellDataType, cellData }: CellRendererProps) => {
  // console.log('CellRenderer rendered:', cellData);  

  // 김프
  if (cellDataType === "kimpPrice" && Array.isArray(cellData) && cellData.length >= 3) {
    return (
      <View style={styles.cellContainer}>
        <Text style={styles.strongText}>
          <Text style={{ color: cellData[0] }}>{cellData[1]}%</Text>
        </Text>
        <Text style={styles.smallText}>{cellData[2]}</Text>
      </View>
    );
  }

  // 심볼과 거래량
  if (Array.isArray(cellData) && cellData.length >= 2) {
    return (
      <View style={styles.cellContainer}>
        <Text style={styles.strongText}>{cellData[0]}</Text>
        <Text style={styles.smallText}>{cellData[1]}</Text>
      </View>
    );
  }

  if (React.isValidElement(cellData) || typeof cellData === 'string') {
    return cellData;
  }

  return <Text>-</Text>; // 예외 처리
};

const CellRenderer = (props: CellRendererProps) => {
  let cellKey = props.cellData
  if (Array.isArray(props.cellData)) {
    cellKey = props.cellData.join('|');
  }

  const memoizedContent = useMemo(() => {
    return renderCellContent(props);
  }, [cellKey]); // 또는 lodash.isEqual을 써도 좋음

  return memoizedContent;
};

export default CellRenderer;

const styles = StyleSheet.create({
  cellContainer: {
    margin: 3,
    justifyContent: 'center',
    gap: 2,
  },
  strongText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  smallText: {
    fontSize: 12,
  },
});
