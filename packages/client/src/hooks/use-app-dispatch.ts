import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

// Use throughout the app instead of `useDispatch`.
export const useAppDispatch = () => useDispatch<AppDispatch>();
