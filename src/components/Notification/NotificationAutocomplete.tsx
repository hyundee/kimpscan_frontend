import { URLS } from "@/constants/urls";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import useDebounce from "@/hooks/useDebounce";
import authAxios from "@/lib/authAxios";
import { CoinName } from "@/types/coins";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, TextInput, Text, Alert } from "react-native";

interface INotificationAutocompleteProps {
  onSelect: (item: CoinName) => void;
}

export const NotificationAutocomplete = ({ onSelect }: INotificationAutocompleteProps) => {
  const [apiCoinData, setApiCoinData] = useState<CoinName[]>([]);
  const { query, setQuery, filteredSuggestions, clear } = useAutocomplete<CoinName>({
    data: apiCoinData,
    extractText: item => item.korName,
    maxLength: 5,
  });
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery) {
      setApiCoinData([]);
      return;
    }

    const fetchCoinData = async () => {
      try {
        const url = `${URLS.API_URL}/exchange/symbols/search?keyword=${encodeURIComponent(debouncedQuery)}&isStatusTrading=true`
        const response = await authAxios.get(url);
        setApiCoinData(response.data);
      } catch (e) {
        console.error("Failed to fetch coin data:", e);
        Alert.alert("오류", "코인 데이터를 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요.");
      }
    };

    fetchCoinData();
  }, [debouncedQuery])

  return <View style={styles.suggestionContainer}>
    <TextInput
      style={styles.input}
      placeholder="ex) 비트코인, BTC, btc"
      value={query}
      onChangeText={setQuery}
    />
    {filteredSuggestions.length > 0 && (
      <View style={styles.suggestionList}>
        <FlashList
          data={filteredSuggestions}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                onSelect(item);
                setQuery(`${item.korName}(${item.rootSymbol})`);
              }}
            >
              <Text>{`${item.korName}(${item.rootSymbol})`}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="always"
          estimatedItemSize={100}
        />
      </View>
    )}
  </View>
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 10,
  },
  suggestionContainer: {
    position: 'relative',
    zIndex: 2,
  },
  suggestionList: {
    position: 'absolute',
    top: 65,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: 'white',
    maxHeight: 200,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 100,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
