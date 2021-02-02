export type OverrideType<T, R> = Omit<T, keyof R> & R;

export type Dict<T> = { [key: string]: T };
