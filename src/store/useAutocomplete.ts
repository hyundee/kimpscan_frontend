import { useEffect, useMemo, useState } from 'react';

type UseAutocompleteOptions<T> = {
  data: T[];
  extractText?: (item: T) => string;
};

export function useAutocomplete<T>({
  data,
  extractText = (item) => String(item),
}: UseAutocompleteOptions<T>) {
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<T[]>([]);


  useEffect(() => {
    if (query.trim().length === 0) {
      setFilteredSuggestions([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = data.filter((item) =>
      extractText(item).toLowerCase().includes(lowerQuery)
    );

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
