import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CoinInfo } from '../../types/coins';
import { FlashList } from "@shopify/flash-list";
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
import { ITableDataRow } from '../../types/coin-table';
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
  const prevQueryRef = useRef(query);
  const prevBookMarksRef = useRef(bookMarks);
  const prevSortKeyRef = useRef(sortKey);
  const prevSortOrderRef = useRef(sortOrder);

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
    const queryChanged = prevQueryRef.current !== query;
    const bookMarksChanged = !isBookmarkEqual(prevBookMarksRef.current, bookMarks);
    const sortKeyChanged = prevSortKeyRef.current !== sortKey;
    const sortOrderChanged = prevSortOrderRef.current !== sortOrder;

    // console.log('queryChanged', queryChanged);
    // console.log('bookMarksChanged', bookMarksChanged);
    // console.log('sortKeyChanged', sortKeyChanged);
    // console.log('sortOrderChanged', sortOrderChanged);

    if (queryChanged || bookMarksChanged || sortKeyChanged || sortOrderChanged) {
      const lowerCaseQuery = query.toLowerCase()
      const bookMarkTableData: ITableDataRow[] = []
      const filteredData: CoinInfo[] = []
      for (const [symbol, info] of Object.entries(coinList)) {
        const rootSymbol = info.rootSymbol || '';
        const lowerRootSymbol = rootSymbol.toLowerCase();
        const lowerKorName = info.korName?.toLowerCase() || '';

        // currentKimp 갱신
        updateCurrentKimp(info.kimp ?? "0", symbol)

        // 북마크
        if (bookMarks[rootSymbol]) {
          bookMarkTableData.push(getTableDataRow(info))
          continue
        }

        // 필터
        if (lowerKorName.includes(lowerCaseQuery) || lowerRootSymbol.includes(lowerCaseQuery)) {
          filteredData.push(info)
        }
      }
      // console.log('bookMarkTableData', bookMarkTableData);

      filteredData.sort((a, b) => {
        let aValue: number | string = '';
        let bValue: number | string = '';
        if (sortKey === 'korName') {
          aValue = a.korName!;
          bValue = b.korName!;
        } else if (sortKey === 'kimp') {
          aValue = Number(a.kimp);
          bValue = Number(b.kimp);
        } else if (sortKey === 'volume') {
          aValue = Number(a.won24hVolume) / Number(a.usdt24hVolume);
          bValue = Number(b.won24hVolume) / Number(b.usdt24hVolume);
        }
        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });

      setTableData(
        bookMarkTableData.concat(filteredData.map(item => getTableDataRow(item)))
      )
      // console.log("IN !!!!!!!!!! ")
    } else {
      setTableData(prevTableData => {
        const newTableData: ITableDataRow[] = [];

        for (const value of prevTableData) {
          const symbol = `${value.symbol[0]}USDT`
          const kimp = value.kimpPrice[1];
          updateCurrentKimp(kimp, symbol)

          if (symbol in coinList) {
            const newValue = coinList[symbol]
            newTableData.push(getTableDataRow(newValue))
          } else {
            newTableData.push(value)
          }
        }

        return newTableData;
      });

      // console.log("OUT !!!!!!!!!! ")
    }

    prevQueryRef.current = query;
    prevBookMarksRef.current = bookMarks;
    prevSortKeyRef.current = sortKey;
    prevSortOrderRef.current = sortOrder;

    // console.log("coinList", coinList)
    // console.log('sortKey', sortKey);
    // console.log('sortOrder', sortOrder);
    // console.log('bookMarks', bookMarks);
    // console.log('query', query);
    // console.log('',);

  }, [coinList, query, bookMarks, sortKey, sortOrder])

  useEffect(() => {
    loadBookmarks().then(setBookMarks);
  }, []);

  const isBookmarkEqual = (
    prev: Record<string, boolean>,
    next: Record<string, boolean>
  ): boolean => {
    const prevSet = new Set(Object.keys(prev).filter(key => prev[key]));
    const nextSet = new Set(Object.keys(next).filter(key => next[key]));

    if (prevSet.size !== nextSet.size) {
      return false;
    }

    for (const prevItem of prevSet) {
      if (!nextSet.has(prevItem)) {
        return false;
      }
    }
    return true;
  }

  const updateCurrentKimp = (kimp: string, symbol: string) => {
    const currentKimp = Number(kimp);
    kimpHistoryRef.current[symbol] = currentKimp;
  }

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

    const tableDataRow: ITableDataRow = {
      symbol: [coinSymbol ?? "", value.korName ?? ""],
      kimpPrice: [kimpColor, kimpValue, kimpPriceText],
      volumeRatio: [volumeRatio, volumeRatioText],
    }

    return tableDataRow;
  }

  const toggleBookMark = useCallback((symbol?: string) => {
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
  }, []);

  const StarIcon = React.memo(({ isBookmarked }: { isBookmarked: boolean }) => {
    return (
      <Icon
        name={isBookmarked ? 'star' : 'staro'}
        size={20}
        color="#fff"
      />
    );
  });

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

  const handlePress = useCallback((symbol: string[]) => {
    const coinKey = symbol[0] + 'USDT';
    useSelectedCoin.getState().setCoin(coinKey);
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  const flexArr = [2, 2, 2, 1];

  const renderHeader = () => {
    return <View style={styles.row}>
      {headerTitles.map((title, index) => {
        const key = sortKeys[index];
        const isSortable = key !== 'none';

        return isSortable ? (
          <TouchableOpacity
            key={`thead-${index}`}
            style={{ flex: flexArr[index] }}
            onPress={() => handleSort(key as any)}>
            <Text style={styles.headerText}>
              {title}
              <SortIcon name="sort" size={15} style={styles.sort} />
            </Text>
          </TouchableOpacity>
        ) : (
          <View key={`thead-${index}`} style={{ flex: flexArr[index] }}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
        );
      })}
    </View>
  }

  const renderItem = ({ item }: { item: ITableDataRow }) => {
    return <View style={styles.row}>
      <View style={{ flex: flexArr[0] }}>
        <TouchableOpacity
          onPress={() => handlePress(item.symbol)}>
          <CellRenderer cellData={item.symbol} cellDataType={"symbol"} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: flexArr[1] }}>
        <CellRenderer cellData={item.kimpPrice} cellDataType={"kimpPrice"} />
      </View>
      <View style={{ flex: flexArr[2] }}>
        <CellRenderer cellData={item.volumeRatio} cellDataType={"volumeRatio"} />
      </View>
      <View style={{ flex: flexArr[3] }}>
        <TouchableOpacity
          style={styles.bookmarkContainer}
          onPress={() => toggleBookMark(item.symbol[0])}>
          <StarIcon isBookmarked={bookMarks[item.symbol[0]]} />
        </TouchableOpacity>
      </View>
    </View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <SearchBar query={query} handleSearch={handleSearch} />
        <ChartLegend />
      </View>
      <FlashList
        style={styles.scrollView}
        data={tableData}
        keyExtractor={(item) => item.symbol[0]}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
