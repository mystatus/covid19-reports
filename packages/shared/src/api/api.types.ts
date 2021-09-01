import { FilterConfig } from '../saved-filter.types';

export type PaginatedQuery = {
  limit: string;
  page: string;
};

export type SortedQuery = {
  orderBy?: string;
  sortDirection?: 'ASC' | 'DESC';
};

export type FilteredQuery = {
  filterConfig?: FilterConfig;
};

export type Paginated<TData> = {
  rows: TData[];
  totalRowsCount: number;
};
