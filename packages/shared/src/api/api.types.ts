export type PaginatedQuery = {
  limit: string;
  page: string;
};

export type SortedQuery = {
  orderBy?: string;
  sortDirection?: 'ASC' | 'DESC';
};

export type PaginationParams = SortedQuery & PaginatedQuery;

export type Paginated<TData> = {
  rows: TData[];
  totalRowsCount: number;
};
