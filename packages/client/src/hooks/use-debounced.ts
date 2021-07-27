import { useState, useEffect, useRef } from 'react';

export default function useDebounced<T>(value: T, delay: number) {
  const isInitialMount = useRef(true);
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const timeout = setTimeout(() => {
        setDebounced(value);
      }, delay);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [value, delay]);

  return debounced;
}
