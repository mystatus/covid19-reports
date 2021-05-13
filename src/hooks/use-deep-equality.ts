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


// export default function useDeepEquality<T>(value?: T | undefined, persistKey?: string): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
//   const [deep, setDeepValue] = usePersistState(persistKey, value);
//   // const [candidate, setCandidateValue] = useState(deep ?? value);

//   // console.log('deep', deep, candidate, value);
//   // useEffect(() => {
//   //   if (!deepEquals(candidate, deep)) {
//   //     setDeepValue(candidate);
//   //   }
//   // }, [candidate, deep, setDeepValue]);

//   const setIt = useCallback((v: SetStateAction<T | undefined>) => {
//     if (!deepEquals(v, deep)) {
//       setDeepValue(v);
//     }
//   }, [deep, setDeepValue]);

//   return [deep, setIt];
// }

