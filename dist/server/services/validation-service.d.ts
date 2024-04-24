import { PopulationSchema, SearchQuery } from '../config/query.schema';
import { ContentType, PaginationParams } from '../interfaces/interfaces';
export declare const validateQueryParams: (query: SearchQuery, contentTypes: ContentType[], pagination: PaginationParams | undefined, populate: Record<string, PopulationSchema> | undefined, filteredContentTypes: string[] | null | undefined) => Promise<void>;
export declare const validateQuery: (contentType: ContentType, locale?: string) => Promise<void>;
