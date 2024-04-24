import { PaginationBaseQuery } from '../config/query.schema';
import {
  PaginatedModelResponse,
  PaginatedResultsResponse,
  PaginationMeta,
  RESTPaginationMeta,
  ResultsResponse,
} from '../interfaces/interfaces';

const parsePaginationArgs = ({
  page: pageQuery = '1',
  pageSize: pageSizeQuery = '25',
  withCount: withCountQuery = 'true',
  start: pageStartQuery = '0',
  limit: pageLimitQuery = '-1',
}) => {
  const page = parseInt(pageQuery, 10);
  const pageSize = parseInt(pageSizeQuery, 10);
  const start = parseInt(pageStartQuery, 10);
  const limit = parseInt(pageLimitQuery, 10);
  const withCount = withCountQuery === 'true';
  return { page, pageSize, withCount, start, limit };
};

export const paginateRestResults = async (
  pagination: Record<string, PaginationBaseQuery>,
  pluralNames: string[],
  resultsResponse: ResultsResponse,
) => {
  const currentResult = { ...resultsResponse };
  const paginatedResult: PaginatedResultsResponse<RESTPaginationMeta> = {};

  const buildPaginatedResults = (pluralName: string) => {
    const { page, pageSize, withCount, start, limit } = parsePaginationArgs(pagination[pluralName]);

    paginatedResult[pluralName] = { data: [] };
  
    const startIndex = start >= 0 && limit > 0 ? start : pageSize * (page - 1);
    const endIndex = start >= 0 && limit > 0 ? start + limit : startIndex + pageSize;

    paginatedResult[pluralName].data = currentResult[pluralName].slice(startIndex,endIndex);
    const meta: RESTPaginationMeta = { pagination: {} };

    if (start >= 0 && limit > 0) {
      meta.pagination.start = start;
      meta.pagination.limit = limit;
    } else {
      meta.pagination.page = page;
      meta.pagination.pageSize = pageSize;
    }

    if (withCount) {
      meta.pagination.total = resultsResponse[pluralName].length;
      if (meta.pagination.pageSize) {
        meta.pagination.pageCount = Math.ceil(meta.pagination.total / pageSize);
      }
    }

    paginatedResult[pluralName].meta = meta;
  };

  pluralNames.forEach((pluralName) => {
    if (!pagination[pluralName]) return;

    buildPaginatedResults(pluralName);
  });

  return { ...resultsResponse, ...paginatedResult };
};

export const paginateGraphQlResults = (
  results: unknown[],
  { limit, start }: { limit: number; start: number },
): PaginatedModelResponse => {
  const resultsCopy = [...results];

  const data = resultsCopy.slice(start, start + limit);

  // Strapi only accepts start and limit at meta args
  // and calculates values in toEntityResponseCollection() util
  const meta: PaginationMeta = {
    start,
    limit,
  };

  return { data, meta };
};
