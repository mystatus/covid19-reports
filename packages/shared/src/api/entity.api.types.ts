import {
  CustomColumnConfig,
  ColumnType,
} from '../entity.types';
import {
  FilteredQuery,
  PaginatedQuery,
  SortedQuery,
} from './api.types';

export type CustomColumnData = {
  type?: ColumnType;
  pii?: boolean;
  phi?: boolean;
  required?: boolean;
  config?: CustomColumnConfig;
  displayName?: string;
};

export type GetEntitiesQuery = PaginatedQuery & SortedQuery & FilteredQuery;

export type GetAllowedColumnsQuery = {
  includeRelationships?: string;
};
