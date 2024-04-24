import { WhereQuery } from '@strapi/utils/dist/convert-query-params';
import { ContentType, Entry, FuzzySortOptions, Result } from '../interfaces/interfaces';
export declare const buildResult: ({ entries, fuzzysortOptions, keys, query, }: {
    entries: Entry[];
    fuzzysortOptions: FuzzySortOptions;
    keys: string[];
    query: string;
}) => Fuzzysort.KeysResults<Entry>;
export declare const buildTransliteratedResult: ({ entries, fuzzysortOptions, keys, query, result, }: {
    entries: Entry[];
    fuzzysortOptions: FuzzySortOptions;
    keys: string[];
    query: string;
    result: Fuzzysort.KeysResults<Entry>;
}) => Fuzzysort.KeysResults<Entry>;
export default function getResult({ contentType, query, filters, populate, locale, }: {
    contentType: ContentType;
    query: string;
    filters?: WhereQuery;
    populate?: string;
    locale?: string;
}): Promise<Result>;
