import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationQuery } from 'src/types/api-query.type';

/**
 * Custom decorator to extract and sanitize pagination query parameters from the request.
 *
 * The decorator parses the following query parameters:
 * - search: Optional. Used as a search/filter keyword.
 * - page: Optional. Current page number, defaults to 1 if missing or invalid.
 * - page_size: Optional. Number of items per page, defaults to 10 and capped at 100.
 *
 * It then constructs the PaginationQuery object with calculated 'skip' and 'take' values
 * for use with pagination in database queries.
 *
 * Example usage in a controller:
 *   @Get()
 *   async list(@QueryPagination() pagination: PaginationQuery) {...}
 */
export const QueryPagination = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PaginationQuery => {
    // Get the request object from execution context and extract the query parameters
    const request = ctx.switchToHttp().getRequest();
    const query = request?.query || {};

    // Extract and set default values for search, page, and page_size
    // If search is absent, use an empty string
    const rawSearch = (query.search as string) ?? '';
    // If page or page_size are not set, use sensible defaults ('1' for page and '10' for page_size)
    const rawPage = (query.page as string) ?? '1';
    const rawPageSize = (query.page_size as string) ?? '10';

    /**
     * Helper to parse a string as a positive integer, or return a fallback if parsing fails.
     * This ensures pagination values are always safely usable in DB queries.
     */
    const toPositiveInt = (value: string, fallback: number) => {
      const parsed = Number.parseInt(String(value), 10);
      if (Number.isNaN(parsed) || parsed < 1) return fallback;
      return parsed;
    };

    // Enforce an upper bound to prevent accidental or malicious large queries
    const pageMaxSize = 100;
    // Parse the 'page' and 'page_size' values with validation and fallback
    const page = toPositiveInt(rawPage, 1);
    const pageSize = Math.min(toPositiveInt(rawPageSize, 10), pageMaxSize);

    // Calculate 'take' and 'skip' for database usage
    // 'take' is the number of items per page
    // 'skip' is the offset; for example, for page 2 and pageSize 10: skip = (2-1)*10 = 10
    const take = pageSize;
    const skip = (page - 1) * pageSize;

    // Return the unified PaginationQuery object
    return {
      search: rawSearch?.trim() || undefined,
      page,
      page_size: pageSize,
      skip,
      take,
    };
  },
);
