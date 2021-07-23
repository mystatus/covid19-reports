import {
  TypedUseSelectorHook,
  useSelector,
} from 'react-redux';
import { AppState } from '../store';

// Use throughout the app instead of `useSelector`.
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
