import { PaginationQuery } from 'src/types/api-query.type';
import { ExtraDataResponse } from 'src/types/api-response.type';

/**
 * Builds a standard pagination data according to the ExtraDataResponse contract.
 * - Places paginated data in the `data` field
 * - Pagination information is placed in the `extra_data` field (limit, page, total, total_pages, next_page, prev_page)
 *
 * @param data - The data for the current page
 * @param total - The total number of items without pagination
 * @param pagination - Pagination object from the QueryPagination decorator
 * @returns An object of type { data: T[]; extra_data: ExtraDataResponse }
 */
export const paginateData = async <T>(
  paginatedData: Promise<[T, number]>,
  pagination: PaginationQuery,
): Promise<{ data: T; extra_data: ExtraDataResponse }> => {
  const [data, total] = await paginatedData;
  const limit = pagination.page_size;
  const page = pagination.page;
  const totalPages = Math.max(1, Math.ceil(total / (limit || 1)));
  const nextPage = page < totalPages ? page + 1 : undefined;
  const prevPage = page > 1 ? page - 1 : undefined;

  return Promise.resolve({
    data,
    extra_data: {
      limit,
      page,
      total,
      total_pages: totalPages,
      next_page: nextPage,
      prev_page: prevPage,
    },
  });
};
