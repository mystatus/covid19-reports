// This is a more type safe wrapper for Object.assign, primarily to be used in redux.
import { Slice } from '@reduxjs/toolkit';

export function assign<TTarget>(target: TTarget, source: Partial<TTarget>) {
  return Object.assign(target, source);
}

export function exportSlice<TSlice extends Slice, TThunks extends object>(
  slice: TSlice,
  thunks?: TThunks,
) {
  return {
    ...slice.actions,
    ...thunks,
  } as TSlice['actions'] & TThunks;
}
