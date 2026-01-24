import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

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
const QueryPaginationRaw = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PaginationQuery => {
    // Get the request object from execution context and extract the query parameters
    const request = ctx.switchToHttp().getRequest();
    const query = request?.query || {};

    const rawSearch = (query.search as string) ?? '';
    const rawPage = (query.page as string) ?? '1';
    const rawPageSize = (query.page_size as string) ?? '10';

    const toPositiveInt = (value: string, fallback: number) => {
      const parsed = Number.parseInt(String(value), 10);
      if (Number.isNaN(parsed) || parsed < 1) return fallback;
      return parsed;
    };

    const pageMaxSize = 100;
    const page = toPositiveInt(rawPage, 1);
    const pageSize = Math.min(toPositiveInt(rawPageSize, 10), pageMaxSize);

    const take = pageSize;
    const skip = (page - 1) * pageSize;

    return {
      search: rawSearch?.trim() || undefined,
      page,
      page_size: pageSize,
      skip,
      take,
    };
  },
);

/**
 * Custom decorator to extract and sanitize pagination query parameters from the request
 * AND automatically add Swagger documentation.
 *
 * It then constructs the PaginationQuery object with calculated 'skip' and 'take' values
 * for use with pagination in database queries.
 *
 * Example usage in a controller:
 *   @Get()
 *   async list(@QueryPagination() pagination: PaginationQuery) {...}
 */
export const QueryPagination = () => {
  return (target: any, key: string | symbol, index: number) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, key);

    if (descriptor) {
      ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Search keyword for filtering results',
      })(target, key, descriptor);

      ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (starts from 1)',
        example: 1,
      })(target, key, descriptor);

      ApiQuery({
        name: 'page_size',
        required: false,
        type: Number,
        description: 'Number of items per page (max 100)',
        example: 10,
      })(target, key, descriptor);
    }

    // Apply the parameter decorator logic
    QueryPaginationRaw()(target, key, index);
  };
};
