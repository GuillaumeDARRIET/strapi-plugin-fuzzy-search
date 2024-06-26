import { Schema } from '@strapi/types';
import { sanitize } from '@strapi/utils';
import { PaginationBaseQuery } from '../config/query.schema';
import {
  ContentType,
  Entry,
  Result,
  ResultsResponse,
  TransformedPagination,
} from '../interfaces/interfaces';
import {
  paginateGraphQlResults,
  paginateRestResults,
} from './pagination-service';

const { contentAPI } = sanitize;

const sanitizeOutput = (
  data: unknown,
  contentType: Schema.ContentType,
  auth: unknown,
) => contentAPI.output(data, contentType, { auth });

// Destructure search results and return them in appropriate/sanitized format
export const buildGraphqlResponse = async (
  searchResult: Fuzzysort.KeysResults<Entry>,
  schema: ContentType,
  auth: Record<string, unknown>,
  pagination: TransformedPagination,
) => {
  const { service: getService } = strapi.plugin('graphql');
  const { returnTypes } = getService('format');
  const { toEntityResponseCollection } = returnTypes;

  const results = await Promise.all(
    searchResult.map(
      async (fuzzyRes) => await contentAPI.output(fuzzyRes.obj, schema, auth),
    ),
  );

  const { data: nodes, meta } = paginateGraphQlResults(results, pagination);
  return toEntityResponseCollection(nodes, {
    args: meta,
    resourceUID: schema.uid,
  });
};

export const buildRestResponse = async (
  searchResults: Result[],
  auth: unknown,
  pagination?: Record<string, PaginationBaseQuery>,
  queriedContentTypes?: string[],
) => {
  const resultsResponse: ResultsResponse = {};

  for (const res of searchResults) {
    const sanitizeEntry = async (fuzzyRes: Fuzzysort.KeysResult<Entry>) => {
      fuzzyRes.obj.__score = fuzzyRes.score;
      return await sanitizeOutput(fuzzyRes.obj, res.schema, auth);
    };

    const buildSanitizedEntries = async () =>
      res.fuzzysortResults.map(
        async (fuzzyRes) => await sanitizeEntry(fuzzyRes),
      );

    // Since sanitizeOutput returns a promise --> Resolve all promises in async for loop so that results can be awaited correctly
    resultsResponse[res.schema.info.pluralName] = (await Promise.all(
      await buildSanitizedEntries(),
    )) as Array<Record<string, unknown>>;
  }

  if (!pagination) return resultsResponse;

  const modelNames = queriedContentTypes || Object.keys(pagination);
  return await paginateRestResults(pagination, modelNames, resultsResponse);
};

export default buildRestResponse;
