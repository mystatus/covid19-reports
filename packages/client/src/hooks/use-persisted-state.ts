import { useEffect, useState } from 'react';
import { Persist } from '../actions/persist.actions';
import { PersistSelector } from '../selectors/persist.selector';
import { useAppDispatch } from './use-app-dispatch';
import { useAppSelector } from './use-app-selector';

export default function usePersistedState<T>(persistKey: string | undefined, initialValue?: T) {
  const persistedValue = useAppSelector(PersistSelector.get<T>(persistKey));
  const [value, setValue] = useState<T>(persistedValue ?? initialValue!);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (persistKey) {
      dispatch(Persist.set(persistKey, value));
    }
  }, [dispatch, persistKey, setValue, value]);

  return [value, setValue] as const;
}
