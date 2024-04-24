"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_schema_1 = __importDefault(require("./config.schema"));
exports.default = {
    default() {
        return {
            contentTypes: {},
        };
    },
    async validator(config) {
        await config_schema_1.default.validate(config);
    },
};
