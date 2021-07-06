import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Persist } from '../actions/persist.actions';
import { PersistSelector } from '../selectors/persist.selector';

export default function usePersistedState<T>(persistKey: string | undefined, initialValue?: T) {
  const persistedValue = useSelector(PersistSelector.get<T>(persistKey));
  const [value, setValue] = useState<T>(persistedValue ?? initialValue!);
  const dispatch = useDispatch();

  useEffect(() => {
    if (persistKey) {
      dispatch(Persist.set(persistKey, value));
    }
  }, [dispatch, persistKey, setValue, value]);

  return [value, setValue] as const;
}
