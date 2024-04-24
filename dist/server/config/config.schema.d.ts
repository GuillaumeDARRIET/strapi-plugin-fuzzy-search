import * as yup from 'yup';
declare const pluginConfigSchema: yup.ObjectSchema<{
    contentTypes: {
        transliterate?: boolean | undefined;
        uid: string;
        modelName: string;
        fuzzysortOptions: {
            threshold?: number | undefined;
            limit?: number | undefined;
            keys?: {
                weight?: number | undefined;
                name: string;
            }[] | undefined;
        };
    }[] | undefined;
}, yup.AnyObject, {
    contentTypes: "";
}, "">;
export default pluginConfigSchema;
