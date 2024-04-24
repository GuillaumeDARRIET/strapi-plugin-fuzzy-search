"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fuzzySearch_service_1 = __importDefault(require("../services/fuzzySearch-service"));
const response_transformation_service_1 = require("../services/response-transformation-service");
const settings_service_1 = __importDefault(require("../services/settings-service"));
const getCustomTypes = (strapi, nexus) => {
    const { service: getService } = strapi.plugin('graphql');
    const { naming } = getService('utils');
    const { utils } = getService('builders');
    const { contentTypes } = (0, settings_service_1.default)().get();
    const { getEntityResponseCollectionName, getFindQueryName, getFiltersInputTypeName, } = naming;
    const { transformArgs } = utils;
    // Extend the SearchResponse type for each registered model
    const extendSearchType = (nexus, model) => {
        return nexus.extendType({
            type: 'SearchResponse',
            definition(t) {
                t.field(getFindQueryName(model), {
                    type: getEntityResponseCollectionName(model),
                    args: {
                        pagination: nexus.arg({ type: 'PaginationArg' }),
                        filters: nexus.arg({ type: getFiltersInputTypeName(model) }),
                        locale: nexus.arg({ type: 'I18NLocaleCode' }),
                    },
                    async resolve(parent, args, ctx, auth) {
                        const { query, locale: parentLocaleQuery } = parent;
                        const { pagination, filters, locale: contentTypeLocaleQuery, } = args;
                        const locale = contentTypeLocaleQuery || parentLocaleQuery;
                        const { start: transformedStart, limit: transformedLimit, filters: transformedFilters, } = transformArgs({ pagination, filters }, {
                            contentType: model,
                            usePagination: true,
                        });
                        const contentType = contentTypes.find((contentType) => contentType.modelName === model.modelName);
                        if (!contentType)
                            return;
                        const results = await (0, fuzzySearch_service_1.default)({
                            contentType,
                            query,
                            filters: transformedFilters,
                            populate: undefined,
                            locale,
                        });
                        const resultsResponse = await (0, response_transformation_service_1.buildGraphqlResponse)(results.fuzzysortResults, contentType, auth, { start: transformedStart, limit: transformedLimit });
                        if (resultsResponse)
                            return resultsResponse;
                        throw new Error(ctx.koaContext.response.message);
                    },
                });
            },
        });
    };
    const searchResponseType = nexus.extendType({
        type: 'Query',
        definition(t) {
            t.field('search', {
                type: 'SearchResponse',
                args: {
                    query: nexus.nonNull(nexus.stringArg('The query string by which the models are searched')),
                    locale: nexus.stringArg('The locale by which to filter the models'),
                },
                async resolve(_parent, args, ctx) {
                    const { query, locale } = args;
                    const { auth } = ctx.state;
                    return { query, locale, auth };
                },
            });
        },
    });
    const returnTypes = [searchResponseType];
    contentTypes.forEach((type) => {
        returnTypes.unshift(extendSearchType(nexus, type));
    });
    return returnTypes;
};
exports.default = getCustomTypes;
