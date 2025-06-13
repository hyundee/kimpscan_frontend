import React, { useEffect, useRef, useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CoinInfo } from '../../types/coins';
import { Table, Row, TableWrapper, Cell } from 'react-native-table-component';
import Icon from 'react-native-vector-icons/AntDesign';
import SortIcon from 'react-native-vector-icons/FontAwesome';
import {
  formatInteger,
  formatNumber,
  formatPrice,
} from '../../utils/formatNumber';
import { loadBookmarks, saveBookmarks } from '../../utils/bookmarkStorage';
import { ChartLegend } from '../Legend/ChartLegend';
import { useSelectedCoin } from '../../store/useSelectedCoin';
import { SearchBar } from '../SearchBar/SearchBar';
import { crc32 } from '../../utils/crc';
import { ITableDataRow } from '../../types/CoinTable';
import CellRenderer from './CellRenderer';

interface ITickerTable {
  data: Record<string, CoinInfo>;
  isDiffCoin: boolean;
}

export const TickerTable = ({ data, isDiffCoin }: ITickerTable) => {
  const [initCoinList, setInitCoinList] = useState<Record<string, CoinInfo>>({});
  const [coinList, setCoinList] = useState<Record<string, CoinInfo>>({});
  const [query, setQuery] = useState('');
  const [bookMarks, setBookMarks] = useState<Record<string, boolean>>({});
  const kimpHistoryRef = useRef<Record<string, number>>({});

  const [sortKey, setSortKey] = useState<'korName' | 'kimp' | 'volume' | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [tableData, setTableData] = useState<ITableDataRow[]>([]);

  useEffect(() => {
    // 최초 데이터 갱신
    if (!isDiffCoin) {
      setInitCoinList(data);
      setCoinList(data);
      setTableData(
        Object.values(data).map(value => getTableDataRow(value))
      )
    }
  }, [data, isDiffCoin]);

  useEffect(() => {
    // 데이터 갱신
    if (isDiffCoin) {
      const updatedCoinList: Record<string, CoinInfo> = Object.keys(initCoinList).reduce(
        (acc, symbol) => {
          const original = initCoinList[symbol];
          const updates = data[symbol];

          acc[symbol] = updates
            ? { ...original, ...updates }
            : original;

          return acc;
        },
        {} as Record<string, CoinInfo>
      );
      setCoinList(updatedCoinList);
    }

  }, [initCoinList, data, isDiffCoin])

  useEffect(() => {
    // 필터
    const lowerCaseQuery = query.toLowerCase()
    const filteredData = Object.values(coinList).filter(item => {
      const korName = item.korName?.toLowerCase() || '';
      const rootSymbol = item.rootSymbol?.toLowerCase() || '';
      return korName.includes(lowerCaseQuery) || rootSymbol.includes(lowerCaseQuery);
    })

    // 정렬
    // filteredData.sort((a, b) => {
    //   let aValue: number | string = '';
    //   let bValue: number | string = '';
    //   if (sortKey === 'korName') {
    //     aValue = a.korName!;
    //     bValue = b.korName!;
    //   } else if (sortKey === 'kimp') {
    //     aValue = Number(a.kimp);
    //     bValue = Number(b.kimp);
    //   } else if (sortKey === 'volume') {
    //     aValue = Number(a.won24hVolume) + Number(a.usdt24hVolume);
    //     bValue = Number(b.won24hVolume) + Number(b.usdt24hVolume);
    //   }
    //   if (aValue < bValue) {
    //     return sortOrder === 'asc' ? -1 : 1;
    //   }
    //   if (aValue > bValue) {
    //     return sortOrder === 'asc' ? 1 : -1;
    //   }
    //   return 0;
    // });

    // 북마크
    console.log('filteredData', filteredData);

    setTableData(prevTableData => {
      const newTableData: ITableDataRow[] = [];
      console.log('prevTableData', prevTableData);

      for (const value of prevTableData) {
        const symbol = `${value.symbol[0]}USDT`
        if (symbol in coinList) {
          const newValue = coinList[symbol]
          newTableData.push(getTableDataRow(newValue))
        } else {
          newTableData.push(value)
        }
      }

      return newTableData;
    });


    console.log("coinList", coinList)
    console.log('sortKey', sortKey);
    console.log('sortOrder', sortOrder);
    console.log('bookMarks', bookMarks);
    console.log('query', query);
    console.log('',);
  }, [coinList, sortKey, sortOrder, query])

  useEffect(() => {
    Object.entries(coinList).forEach(([symbol, info]) => {
      const currentKimp = Number(info.kimp);
      kimpHistoryRef.current[symbol] = currentKimp;
    });
  }, [coinList]);

  useEffect(() => {
    loadBookmarks().then(setBookMarks);
  }, []);

  const getTableDataRow = (value: CoinInfo) => {
    const coinSymbol = value.rootSymbol;
    const wonPrice = formatPrice(value.wonPrice);
    const usdtPrice = formatInteger(value.usdtPrice);
    const finalUsdtPrice =
      usdtPrice < 10 ? Number(value.usdtPrice).toFixed(4) : usdtPrice;

    const currentKimp = Number(value.kimp);
    const previousKimp = kimpHistoryRef.current[coinSymbol!];
    const kimpColor =
      previousKimp !== undefined && currentKimp > Number(previousKimp)
        ? 'red'
        : 'blue';

    kimpHistoryRef.current[coinSymbol!] = currentKimp;

    const kimpValue = Number(value.kimp).toFixed(3);
    const kimpPriceText = `${wonPrice}/${finalUsdtPrice}`;

    const won24hVolume = formatInteger(value.won24hVolume);
    const usdt24hVolume = formatInteger(value.usdt24hVolume);
    const volumeRatio = `${Math.floor((won24hVolume / usdt24hVolume) * 100)}%`;
    const volumeRatioText = `${formatNumber(won24hVolume)}/${formatNumber(
      usdt24hVolume,
    )}`;

    // console.log('coinSymbol', coinSymbol);
    // console.log('value.korName', value.korName);

    const tableDataRow: ITableDataRow = {
      rowHash: getCoinInfoHash(value),
      symbol: [coinSymbol ?? "", value.korName ?? ""],
      kimpPrice: [kimpColor, kimpValue, kimpPriceText],
      volumeRatio: [volumeRatio, volumeRatioText],
    }

    return tableDataRow;
  }

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

  const getCoinInfoHash = (info: CoinInfo) => {
    const str = Object.values(info ?? {})
      .map(value => value ?? '')
      .join('|');

    return crc32(str).toString(16).padStart(8, '0');
  }

  const handleSort = (key: 'korName' | 'kimp' | 'volume') => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const headerTitles = ['종목명', '김프', '거래비율', '즐겨\n찾기'];
  const sortKeys = ['korName', 'kimp', 'volume', 'none'];

  const handlePress = (symbol: string[]) => {
    const coinKey = symbol[0] + 'USDT';
    useSelectedCoin.getState().setCoin(coinKey);
  };

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text === "") return;

    const result = Object.values(coinList).filter(item => {
      return (
        item.korName!.toLowerCase().includes(text.toLowerCase()) ||
        item.rootSymbol!.toLowerCase().includes(text.toLowerCase())
      );
    });
  };

  // console.log(filteredData);
  // console.log(data, tableData);
  const flexArr = [2, 2, 2, 1];

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <SearchBar query={query} handleSearch={handleSearch} />
        <ChartLegend />
      </View>
      <ScrollView style={styles.scrollView}>
        {/* ScrollView BorderStyle 에러로 주석 */}
        {/* <Table borderStyle={styles.tableBorder}> */}
        <Table>
          <Row
            data={headerTitles.map((title, index) => {
              const key = sortKeys[index];
              const isSortable = key !== 'none';

              return isSortable ? (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSort(key as any)}>
                  <Text style={styles.headerText}>
                    {title}
                    <SortIcon name="sort" size={15} style={styles.sort} />
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text key={index} style={styles.headerText}>
                  {title}
                </Text>
              );
            })}
            style={styles.header}
            textStyle={styles.headerText}
            flexArr={flexArr}
          />
          {tableData.map((item) => (
            <TableWrapper key={`${item.rowHash}-wrap`} style={styles.row}>
              <Cell
                key={`${item.rowHash}-0`}
                data={
                  <TouchableOpacity
                    onPress={() => handlePress(item.symbol)}>
                    <CellRenderer cellData={item.symbol} cellDataType={"symbol"} />
                  </TouchableOpacity>
                }
                style={{ flex: flexArr[0] }}
              />
              <Cell
                key={`${item.rowHash}-1`}
                data={
                  <CellRenderer cellData={item.kimpPrice} cellDataType={"kimpPrice"} />
                }
                style={{ flex: flexArr[1] }}
              />
              <Cell
                key={`${item.rowHash}-2`}
                data={
                  <CellRenderer cellData={item.volumeRatio} cellDataType={"volumeRatio"} />
                }
                style={{ flex: flexArr[2] }}
              />
              <Cell
                key={`${item.rowHash}-3`}
                data={
                  <TouchableOpacity
                    style={styles.bookmarkContainer}
                    onPress={() => toggleBookMark(item.symbol[0])}>
                    <Icon
                      name={bookMarks[item.symbol[0]] ? 'star' : 'staro'}
                      size={20}
                      color="#000"
                    />
                  </TouchableOpacity>
                }
                style={{ flex: flexArr[3] }}
              />
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
  top: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 5,
    // marginHorizontal : 5,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  bookmark: {
    // width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // textAlign: 'center',
  },
  sort: {
    marginLeft: 3,
  },
  bookmarkContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
