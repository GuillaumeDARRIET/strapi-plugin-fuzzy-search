"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers_config_1 = __importDefault(require("./resolvers-config"));
const types_1 = __importDefault(require("./types"));
const registerGraphlQLQuery = (strapi) => {
    // build plugins schema extension
    const extension = ({ nexus }) => ({
        types: (0, types_1.default)(strapi, nexus),
        resolversConfig: (0, resolvers_config_1.default)(),
    });
    strapi.plugin('graphql').service('extension').use(extension);
};
exports.default = registerGraphlQLQuery;
