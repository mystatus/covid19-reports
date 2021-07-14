export type PaginatedQuery = {
  limit: string
  page: string
};

export type Paginated<TData> = {
  rows: TData[]
  totalRowsCount: number
};
