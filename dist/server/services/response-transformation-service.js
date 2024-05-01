"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRestResponse = exports.buildGraphqlResponse = void 0;
const utils_1 = require("@strapi/utils");
const pagination_service_1 = require("./pagination-service");
const { contentAPI } = utils_1.sanitize;
const sanitizeOutput = (data, contentType, auth) => contentAPI.output(data, contentType, { auth });
// Destructure search results and return them in appropriate/sanitized format
const buildGraphqlResponse = async (searchResult, schema, auth, pagination) => {
    const { service: getService } = strapi.plugin('graphql');
    const { returnTypes } = getService('format');
    const { toEntityResponseCollection } = returnTypes;
    const results = await Promise.all(searchResult.map(async (fuzzyRes) => await contentAPI.output(fuzzyRes.obj, schema, auth)));
    const { data: nodes, meta } = (0, pagination_service_1.paginateGraphQlResults)(results, pagination);
    return toEntityResponseCollection(nodes, {
        args: meta,
        resourceUID: schema.uid,
    });
};
exports.buildGraphqlResponse = buildGraphqlResponse;
const buildRestResponse = async (searchResults, auth, pagination, queriedContentTypes) => {
    const resultsResponse = {};
    for (const res of searchResults) {
        const sanitizeEntry = async (fuzzyRes) => {
            fuzzyRes.obj.__score = fuzzyRes.score;
            return await sanitizeOutput(fuzzyRes.obj, res.schema, auth);
        };
        const buildSanitizedEntries = async () => res.fuzzysortResults.map(async (fuzzyRes) => await sanitizeEntry(fuzzyRes));
        // Since sanitizeOutput returns a promise --> Resolve all promises in async for loop so that results can be awaited correctly
        resultsResponse[res.schema.info.pluralName] = (await Promise.all(await buildSanitizedEntries()));
    }
    if (!pagination)
        return resultsResponse;
    const modelNames = queriedContentTypes || Object.keys(pagination);
    return await (0, pagination_service_1.paginateRestResults)(pagination, modelNames, resultsResponse);
};
exports.buildRestResponse = buildRestResponse;
exports.default = exports.buildRestResponse;
