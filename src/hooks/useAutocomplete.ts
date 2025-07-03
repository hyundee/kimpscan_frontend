import { useEffect, useMemo, useState } from 'react';

type UseAutocompleteOptions<T> = {
  data: T[];
  extractText?: (item: T) => string;
  maxLength: number;
};

export function useAutocomplete<T>({
  data,
  extractText = (item) => String(item),
  maxLength = 5,
}: UseAutocompleteOptions<T>) {
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<T[]>([]);


  useEffect(() => {
    if (query.trim().length === 0) {
      setFilteredSuggestions([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    let results = data.filter((item) =>
      extractText(item).toLowerCase().includes(lowerQuery)
    );

    if (results.length > maxLength) {
      results = results.slice(0, maxLength);
    }

    setFilteredSuggestions(results);
  }, [query, data]);

  const clear = () => {
    setQuery('');
    setFilteredSuggestions([]);
  };

  return {
    query,
    setQuery,
    filteredSuggestions,
    clear,
  };
}
