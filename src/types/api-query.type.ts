export interface PaginationQuery {
  search?: string;
  page: number;
  page_size: number;
  skip: number;
  take: number;
}
