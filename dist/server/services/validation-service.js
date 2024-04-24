"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateQueryParams = void 0;
const utils_1 = require("@strapi/utils");
const query_schema_1 = require("../config/query.schema");
const { ValidationError } = utils_1.errors;
const validateFilteredContentTypes = (configModels, filterModel) => {
    if (!configModels.has(filterModel))
        throw new Error(`'${filterModel}' was found in contentTypes filter query, however this model is not configured in the fuzzy-search config`);
};
const validatePaginationQueryParams = async (configModels, pagination) => {
    const paginatedEntries = Object.entries(pagination);
    for (const [pluralName, paginationValues] of paginatedEntries) {
        if (!configModels.has(pluralName)) {
            throw new Error(`Pagination queries for model '${pluralName}' were found, however this model is not configured in the fuzzy-search config`);
        }
        await query_schema_1.paginationSchema.validate(paginationValues);
    }
};
const validateNestedQueryParams = (configModels, nestedParams) => {
    const filterKeys = Object.keys(nestedParams);
    filterKeys.forEach((key) => {
        if (key !== 'contentTypes' && !configModels.has(key)) {
            throw new Error(`Query params for model '${key}' were found, however this model is not configured in the fuzzy-search config`);
        }
    });
};
const validateQueryParams = async (query, contentTypes, pagination, populate, filteredContentTypes) => {
    const configModels = new Set(contentTypes.map((contentType) => contentType.info.pluralName));
    await query_schema_1.querySchema.validate(query);
    if (pagination)
        await validatePaginationQueryParams(configModels, pagination);
    if (query.filters)
        validateNestedQueryParams(configModels, query.filters);
    if (populate)
        validateNestedQueryParams(configModels, populate);
    if (filteredContentTypes)
        filteredContentTypes.forEach((model) => validateFilteredContentTypes(configModels, model));
};
exports.validateQueryParams = validateQueryParams;
const validateQuery = async (contentType, locale) => {
    if (contentType.kind !== 'collectionType')
        throw new ValidationError(`Content type: '${contentType.modelName}' is not a collectionType`);
    contentType.fuzzysortOptions.keys.forEach((key) => {
        const attributeKeys = Object.keys(contentType.attributes);
        if (!attributeKeys.includes(key.name))
            throw new ValidationError(`Key: '${key.name}' is not a valid field for model: '${contentType.modelName}`);
    });
    if (!locale)
        return;
    const isLocalizedContentType = await strapi.plugins.i18n.services['content-types'].isLocalizedContentType(contentType);
    if (!isLocalizedContentType) {
        throw new ValidationError(`A query for the locale: '${locale}' was found, however model: '${contentType.modelName}' is not a localized content type. Enable localization for all content types if you want to query for localized entries via the locale parameter.`);
    }
};
exports.validateQuery = validateQuery;
