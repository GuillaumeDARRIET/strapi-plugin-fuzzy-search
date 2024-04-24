"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTransliteratedResult = exports.buildResult = void 0;
const fuzzysort_1 = __importDefault(require("fuzzysort"));
const transliteration_1 = require("transliteration");
const validation_service_1 = require("./validation-service");
const weightScores = (a, keys) => {
    const weightedScores = keys.map((key, index) => {
        const weight = key.weight || 0;
        // return lowest score
        return a[index] ? +a[index].score + weight : -9999;
    });
    return Math.max(...weightedScores);
};
const transformEntryKeysToString = (entries, keys) => entries.map((entry) => transformEntry(entry, keys, (value) => value === null || value === void 0 ? void 0 : value.toString()));
const limitCharacters = (entries, characterLimit, keys) => entries.map((entry) => transformEntry(entry, keys, (value) => value === null || value === void 0 ? void 0 : value.toString().slice(0, characterLimit)));
const transformEntry = (entry, keys, transformFn) => {
    const transformedEntry = { ...entry };
    const entryKeys = Object.keys(transformedEntry);
    entryKeys.forEach((key) => {
        if (!keys.includes(key))
            return;
        transformedEntry[key] = transformFn(transformedEntry[key]);
    });
    return transformedEntry;
};
const buildResult = ({ entries, fuzzysortOptions, keys, query, }) => {
    const transformedEntries = fuzzysortOptions.characterLimit
        ? limitCharacters(entries, fuzzysortOptions.characterLimit, keys)
        : transformEntryKeysToString(entries, keys);
    return fuzzysort_1.default.go(query, transformedEntries, {
        threshold: fuzzysortOptions.threshold,
        limit: fuzzysortOptions.limit,
        keys,
        scoreFn: (a) => weightScores(a, fuzzysortOptions.keys),
    });
};
exports.buildResult = buildResult;
const transliterateEntries = (entries) => entries.map((entry) => {
    const entryKeys = Object.keys(entry);
    entry.transliterations = {};
    entryKeys.forEach((key) => {
        if (!entry[key])
            return;
        entry.transliterations[key] = (0, transliteration_1.transliterate)(entry[key]);
    });
    return entry;
});
const buildTransliteratedResult = ({ entries, fuzzysortOptions, keys, query, result, }) => {
    const { keys: fuzzysortKeys, threshold, limit } = fuzzysortOptions;
    const transliteratedEntries = transliterateEntries(entries);
    const transliterationKeys = keys.map((key) => `transliterations.${key}`);
    const transliteratedResult = fuzzysort_1.default.go(query, transliteratedEntries, {
        threshold,
        limit,
        keys: transliterationKeys,
        scoreFn: (a) => weightScores(a, fuzzysortKeys),
    });
    // Remove transliterations key from entries
    entries.forEach((entry) => delete entry.transliterations);
    if (!result.total)
        return transliteratedResult;
    const newResults = [...result];
    // In the chance that a transliterated result scores higher than its non-transliterated counterpart,
    // overwrite the original result with the transliterated result and resort the results
    transliteratedResult.forEach((res) => {
        const origIndex = newResults.findIndex((origRes) => origRes.obj.id === res.obj.id && origRes.score <= res.score);
        if (origIndex >= 0)
            newResults[origIndex] = res;
    });
    newResults.sort((a, b) => b.score - a.score);
    /**
     * Typecasting here, as newResults is inferred as Fuzzysort.KeysResult<Entry>[] instead of Fuzzysort.KeysResults<Entry>.
     * Typecasting newResults during creation as Fuzzysort.KeysResults<Entry> results in a type error, as the KeysResults type is readonly
     * but needs to be mutable for the sort function.
     */
    return newResults;
};
exports.buildTransliteratedResult = buildTransliteratedResult;
async function getResult({ contentType, query, filters, populate, locale, }) {
    const buildFilteredEntries = async () => {
        await (0, validation_service_1.validateQuery)(contentType, locale);
        return (await strapi.entityService.findMany(contentType.uid, {
            ...(filters && { filters }),
            ...(locale && { locale }),
            ...(populate && { populate }),
        }));
    };
    const filteredEntries = await buildFilteredEntries();
    const keys = contentType.fuzzysortOptions.keys.map((key) => key.name);
    let result = (0, exports.buildResult)({
        entries: filteredEntries,
        fuzzysortOptions: contentType.fuzzysortOptions,
        keys,
        query,
    });
    if (contentType.transliterate) {
        result = (0, exports.buildTransliteratedResult)({
            entries: filteredEntries,
            fuzzysortOptions: contentType.fuzzysortOptions,
            keys,
            query,
            result,
        });
    }
    return {
        fuzzysortResults: result,
        schema: contentType,
    };
}
exports.default = getResult;
