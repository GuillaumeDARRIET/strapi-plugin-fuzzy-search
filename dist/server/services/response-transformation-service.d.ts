import { PaginationBaseQuery } from '../config/query.schema';
import { ContentType, Entry, Result, TransformedPagination } from '../interfaces/interfaces';
export declare const buildGraphqlResponse: (searchResult: Fuzzysort.KeysResults<Entry>, schema: ContentType, auth: Record<string, unknown>, pagination: TransformedPagination) => Promise<any>;
export declare const buildRestResponse: (searchResults: Result[], auth: unknown, pagination?: Record<string, PaginationBaseQuery>, queriedContentTypes?: string[]) => Promise<{
    [x: string]: Record<string, unknown>[] | import("../interfaces/interfaces").PaginatedModelResponse<import("../interfaces/interfaces").RESTPaginationMeta>;
}>;
export default buildRestResponse;
