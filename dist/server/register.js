"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = __importDefault(require("./graphql"));
const settings_service_1 = __importDefault(require("./services/settings-service"));
exports.default = ({ strapi }) => {
    const { get: getSettings, build: buildSettings, set: setSettings, } = (0, settings_service_1.default)();
    const settings = getSettings();
    // build settings structure
    const normalizedSettings = buildSettings(settings);
    // reset plugin settings
    setSettings(normalizedSettings);
    if (strapi.plugin('graphql')) {
        strapi.log.info('[fuzzy-search] graphql detected, registering queries');
        (0, graphql_1.default)(strapi);
    }
};
