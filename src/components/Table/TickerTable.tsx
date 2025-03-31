import React, {useEffect, useRef, useState} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CoinInfo} from '../../types/coins';
import {Table, Row, TableWrapper, Cell} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/AntDesign';
// import ChartLegendIcon from 'react-native-vector-icons/Ionicons';
import {
  formatInteger,
  formatNumber,
  formatPrice,
} from '../../utils/formatNumber';
import { loadBookmarks, saveBookmarks } from '../../utils/bookmarkStorage';
import { ChartLegend } from '../Legend/ChartLegend';
import { useSelectedCoin } from '../../store/useSelectedCoin';
import { SearchBar } from '../SearchBar/SearchBar';


interface ITickerTable {
  data: Record<string, CoinInfo>;
}

export const TickerTable = ({data}: ITickerTable) => {
  const [coinList, setCoinList] = useState<Record<string, CoinInfo>>({});
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState<CoinInfo[]>([]);
  const [bookMarks, setBookMarks] = useState<Record<string, boolean>>({});
  // const [kimpHistory, setKimpHistory] = useState<Record<string, number>>({});
  const kimpHistoryRef = useRef<Record<string, number>>({});

  useEffect(() => {
    setCoinList(data);
  }, [data]);

  useEffect(() => {
    Object.entries(coinList).forEach(([symbol, info]) => {
      const currentKimp = Number(info.kimp);
      kimpHistoryRef.current[symbol] = currentKimp;
    });
  }, [coinList]);

  useEffect(() => {
    loadBookmarks().then(setBookMarks);
  }, []);

  const toggleBookMark = (symbol?: string) => {
    if (symbol) {
      setBookMarks(prev => {
        const updated = {
          ...prev,
          [symbol]: !prev[symbol],
        };
        saveBookmarks(updated);
        return updated;
      });
    }
  };

  const baseData = query ? filteredData : Object.values(coinList);

  const sortedCoinList = baseData.sort((a, b) => {
    const aBookmarked = bookMarks[a.rootSymbol!] ?? false;
    const bBookmarked = bookMarks[b.rootSymbol!] ?? false;
    if (aBookmarked === bBookmarked) {return 0;}
    return aBookmarked ? -1 : 1;
  });

  const tableHead = ['종목명', '김프', '거래비율', '즐겨\n찾기'];

  const tableData = sortedCoinList.map(value => {
    const coinSymbol = value.rootSymbol;
    const wonPrice = formatPrice(value.wonPrice);
    const usdtPrice = formatInteger(value.usdtPrice);
    const finalUsdtPrice =
      usdtPrice < 10 ? Number(value.usdtPrice).toFixed(4) : usdtPrice;

    const currentKimp = Number(value.kimp);
    const previousKimp = kimpHistoryRef.current[coinSymbol!];
    const kimpColor = previousKimp !== undefined && currentKimp > Number(previousKimp) ? 'red' : 'blue';

    kimpHistoryRef.current[coinSymbol!] = currentKimp;

    const kimpValue = Number(value.kimp).toFixed(3);
    const finalKimpPrice = <Text style={{color: kimpColor}}>{kimpValue}%</Text>;
    const kimpPriceText = `${wonPrice}/${finalUsdtPrice}`;

    const won24hVolume = formatInteger(value.won24hVolume);
    const usdt24hVolume = formatInteger(value.usdt24hVolume);
    const volumeRatio = `${Math.floor((won24hVolume / usdt24hVolume) * 100)}%`;
    const volumeRatioText = `${formatNumber(won24hVolume)}/${formatNumber(
      usdt24hVolume,
    )}`;

    const bookMarkButton = (
      <TouchableOpacity
        style={styles.bookmarkContainer}
        onPress={() => toggleBookMark(coinSymbol)}>
        <Icon
          name={bookMarks[coinSymbol!] ? 'star' : 'staro'}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
    );

    return [
      [coinSymbol, value.korName],
      [finalKimpPrice, kimpPriceText],
      [volumeRatio, volumeRatioText],
      bookMarkButton,
    ];
  });

  const renderCustomCell = (
    cellData:
      | React.JSX.Element
      | (string | React.JSX.Element)[]
      | (string | undefined)[],
  ) => {
    if (Array.isArray(cellData)) {
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

  const handlePress = (symbol : string[]) => {
    const coinKey = symbol[0] + 'USDT';
    useSelectedCoin.getState().setCoin(coinKey);
  };

  const handleSearch = (text: string) => {
    setQuery(text);
    const result = Object.values(coinList).filter((item) => {
      return (
        item.korName!.toLowerCase().includes(text.toLowerCase()) ||
        item.rootSymbol!.toLowerCase().includes(text.toLowerCase())
      );
    });
    setFilteredData(result);
  };

  console.log(filteredData);
  // console.log(data, tableData);
  const flexArr = [2, 2, 2, 1];

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <SearchBar query={query} handleSearch={handleSearch} />
        <ChartLegend />
      </View>
      <ScrollView style={styles.scrollView}>
        <Table borderStyle={styles.tableBorder}>
          <Row
            data={tableHead}
            style={styles.header}
            textStyle={styles.headerText}
            flexArr={flexArr}
          />
          {tableData.map((rowData, rowIndex) => (
            <TableWrapper key={rowIndex} style={styles.row}>
                {rowData.map((cellData, cellIndex) => (
                  <Cell
                      key={cellIndex}
                      data={
                        cellIndex === 0 ? (
                          <TouchableOpacity
                            onPress={() => handlePress(rowData[0] as string[])}>
                            {renderCustomCell(cellData)}
                          </TouchableOpacity>
                        ) : (
                          renderCustomCell(cellData)
                        )
                      }
                      style={{flex: flexArr[cellIndex]}}
                    />
                ))}
              </TableWrapper>
          ))}
        </Table>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: 'black',
    borderTopWidth: 2,
    backgroundColor: '#000',
  },
  top : {
    marginTop : 10,
    marginBottom : 5,
    // marginHorizontal : 5,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent : 'space-between',
    flexDirection: 'row',
  },
  scrollView: {
    width: '100%',
    backgroundColor: '#fff',
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
  textCenter: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: '#C1C0B9',
  },
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
  bookmarkContainer: {
    width: '100%',
    alignItems: 'center',
  },
  bookmark: {
    // width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // textAlign: 'center',
  },
});
