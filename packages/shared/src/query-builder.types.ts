export type QueryOp =
  | '='
  | '<>'
  | '~'
  | '>'
  | '<'
  | 'startsWith'
  | 'endsWith'
  | 'in'
  | 'between';

export type QueryValueScalarType = string | number | boolean;

export type QueryValueType = QueryValueScalarType | QueryValueScalarType[];
