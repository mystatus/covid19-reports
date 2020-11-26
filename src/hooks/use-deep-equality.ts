import {
  useState, useEffect, SetStateAction, Dispatch,
} from 'react';
import deepEquals from 'fast-deep-equal';

export default function useDeepEquality<T>(value?: T | undefined): [T | undefined, Dispatch<SetStateAction<T | undefined>>, T | undefined] {
  const [deep, setDeepValue] = useState(value);
  const [candidate, setCandidateValue] = useState(value);

  useEffect(() => {
    if (!deepEquals(candidate, deep)) {
      setDeepValue(candidate);
    }
  }, [candidate, deep, setDeepValue]);

  return [deep, setCandidateValue, candidate];
}

