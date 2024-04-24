"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = exports.populationSchema = exports.paginationSchema = void 0;
const yup_1 = require("yup");
exports.paginationSchema = (0, yup_1.object)({
    pageSize: (0, yup_1.string)().matches(/^\d+$/, 'pageSize must be an integer'),
    page: (0, yup_1.string)().matches(/^\d+$/, 'page must be an integer'),
    withCount: (0, yup_1.string)().oneOf(['true', 'false'], "withCount must either be 'true' or 'false'"),
});
exports.populationSchema = (0, yup_1.string)().required();
exports.querySchema = (0, yup_1.object)({
    query: (0, yup_1.string)().required(),
    locale: (0, yup_1.string)(),
    filters: (0, yup_1.object)({
        contentTypes: (0, yup_1.string)(),
    }),
});
