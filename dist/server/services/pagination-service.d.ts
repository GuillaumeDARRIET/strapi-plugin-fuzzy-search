import { PaginationBaseQuery } from '../config/query.schema';
import { PaginatedModelResponse, RESTPaginationMeta, ResultsResponse } from '../interfaces/interfaces';
export declare const paginateRestResults: (pagination: Record<string, PaginationBaseQuery>, pluralNames: string[], resultsResponse: ResultsResponse) => Promise<{
    [x: string]: Record<string, unknown>[] | PaginatedModelResponse<RESTPaginationMeta>;
}>;
export declare const paginateGraphQlResults: (results: unknown[], { limit, start }: {
    limit: number;
    start: number;
}) => PaginatedModelResponse;
