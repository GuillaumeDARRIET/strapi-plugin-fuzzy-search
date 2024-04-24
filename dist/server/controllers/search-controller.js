"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@strapi/utils");
const fuzzySearch_service_1 = __importDefault(require("../services/fuzzySearch-service"));
const response_transformation_service_1 = __importDefault(require("../services/response-transformation-service"));
const settings_service_1 = __importDefault(require("../services/settings-service"));
const validation_service_1 = require("../services/validation-service");
const { NotFoundError } = utils_1.errors;
exports.default = () => ({
    async search(ctx) {
        var _a;
        const { contentTypes } = (0, settings_service_1.default)().get();
        const { query, pagination, filters: filtersQuery, locale, populate, } = ctx.query;
        const { auth } = ctx.state;
        const queriedContentTypes = filtersQuery && filtersQuery.contentTypes
            ? (_a = filtersQuery.contentTypes) === null || _a === void 0 ? void 0 : _a.split(',')
            : undefined;
        try {
            await (0, validation_service_1.validateQueryParams)(ctx.query, contentTypes, pagination, populate, queriedContentTypes);
        }
        catch (err) {
            let message = 'unknown error';
            if (err instanceof Error)
                message = err.message;
            return ctx.badRequest('Invalid query', message);
        }
        const queriedContentTypesSet = new Set(queriedContentTypes);
        const filteredContentTypes = (filtersQuery === null || filtersQuery === void 0 ? void 0 : filtersQuery.contentTypes)
            ? [...contentTypes].filter((contentType) => queriedContentTypesSet.has(contentType.info.pluralName))
            : contentTypes;
        const results = await Promise.all(filteredContentTypes.map(async (contentType) => {
            var _a;
            return await (0, fuzzySearch_service_1.default)({
                contentType,
                query,
                filters: filtersQuery === null || filtersQuery === void 0 ? void 0 : filtersQuery[contentType.info.pluralName],
                populate: populate === null || populate === void 0 ? void 0 : populate[contentType.info.pluralName],
                locale: ((_a = filtersQuery === null || filtersQuery === void 0 ? void 0 : filtersQuery[contentType.info.pluralName]) === null || _a === void 0 ? void 0 : _a.locale) || locale,
            });
        }));
        const response = await (0, response_transformation_service_1.default)(results, auth, pagination, queriedContentTypes);
        if (response) {
            return response;
        }
        else {
            throw new NotFoundError();
        }
    },
});
