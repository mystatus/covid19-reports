import {
  Dispatch, SetStateAction, useCallback, useState,
} from 'react';
import deepEquals from 'fast-deep-equal';

export default function useDeepEquality<T>(initialValue?: T | undefined): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
  const [value, setValue] = useState(initialValue);

  const setIt = useCallback((state: SetStateAction<T | undefined>) => {
    if (!deepEquals(state, value)) {
      setValue(state);
    }
  }, [value, setValue]);

  return [value, setIt];
}
