import { useAutocomplete } from "@/store/useAutocomplete";
import { CoinName } from "@/types/coins";
import { FlashList } from "@shopify/flash-list";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, TextInput, Text } from "react-native";

const coinData = [
  { symbol: "BTCUSDT", rootSymbol: "BTC", korName: "비트코인" },
  { symbol: "BTCUSDT1", rootSymbol: "BTC", korName: "비트코인1" },
  { symbol: "BTCUSDT2", rootSymbol: "BTC", korName: "비트코인2" },
  { symbol: "BTCUSDT3", rootSymbol: "BTC", korName: "비트코인3" },
  { symbol: "ETHUSDT", rootSymbol: "ETH", korName: "이더리움" },
];

export const NotificationAutocomplete = () => {
  const { query, setQuery, filteredSuggestions, clear } = useAutocomplete<CoinName>({
    data: coinData,
    extractText: item => item.korName
  });

  useEffect(() => {
    console.log('filteredSuggestions', filteredSuggestions);
  }, [filteredSuggestions])

  return <View style={styles.suggestionContainer}>
    <TextInput
      style={styles.input}
      placeholder="Search framework..."
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
                setQuery(`${item.korName}(${item.rootSymbol})`);
                clear();
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
