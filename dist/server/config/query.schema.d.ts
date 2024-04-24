import { InferType } from 'yup';
export declare const paginationSchema: import("yup").ObjectSchema<{
    pageSize: string | undefined;
    page: string | undefined;
    withCount: string | undefined;
}, import("yup").AnyObject, {
    pageSize: undefined;
    page: undefined;
    withCount: undefined;
}, "">;
export declare const populationSchema: import("yup").StringSchema<string, import("yup").AnyObject, undefined, "">;
export declare const querySchema: import("yup").ObjectSchema<{
    query: string;
    locale: string | undefined;
    filters: {
        contentTypes?: string | undefined;
    };
}, import("yup").AnyObject, {
    query: undefined;
    locale: undefined;
    filters: {
        contentTypes: undefined;
    };
}, "">;
export type PaginationBaseQuery = InferType<typeof paginationSchema>;
export type PopulationSchema = InferType<typeof populationSchema>;
type QuerySchema = InferType<typeof querySchema>;
export type SearchQuery = Omit<QuerySchema, 'filters'> & {
    pagination?: Record<string, PaginationBaseQuery>;
    populate?: Record<string, PopulationSchema>;
    filters?: QuerySchema['filters'] & Record<string, any>;
};
export {};
