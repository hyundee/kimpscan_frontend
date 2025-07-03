import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 value를 debouncedValue로 설정하는 타이머
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup 함수: value나 delay가 변경되거나 컴포넌트가 언마운트될 때 이전 타이머를 클리어
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // value나 delay가 변경될 때마다 useEffect 재실행

  return debouncedValue;
}

export default useDebounce;