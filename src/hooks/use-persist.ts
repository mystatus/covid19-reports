import {
  Dispatch, SetStateAction, useEffect, useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Persist } from '../actions/persist.actions';
import { PersistSelector } from '../selectors/persist.selector';

export default function usePersist<T>(persistKey: string | undefined, [value, setValue]: [T, Dispatch<SetStateAction<T>>]): [T, Dispatch<SetStateAction<T>>] {
  const persistedValue = useSelector(PersistSelector.get<T>(persistKey));
  const firstRun = useRef(Boolean(persistedValue));
  const dispatch = useDispatch();

  useEffect(() => {
    if (persistKey) {
      if (firstRun.current) {
        if (persistedValue) {
          setValue(persistedValue);
        }
        firstRun.current = false;
      } else {
        dispatch(Persist.set(persistKey, value));
      }
    }
  }, [dispatch, persistedValue, persistKey, setValue, value]);

  if (persistKey) {
    return [persistedValue ?? value, setValue];
  }
  return [value, setValue];
}
