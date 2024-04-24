declare const _default: {
    bootstrap: () => void;
    register: ({ strapi }: {
        strapi: import("@strapi/types").Strapi;
    }) => void;
    config: {
        default(): {
            contentTypes: {};
        };
        validator(config: import("./interfaces/interfaces").Config): Promise<void>;
    };
    controllers: {
        searchController: () => {
            search(ctx: import("./interfaces/interfaces").Context): Promise<void | {
                [x: string]: Record<string, unknown>[] | import("./interfaces/interfaces").PaginatedModelResponse<import("./interfaces/interfaces").RESTPaginationMeta>;
            }>;
        };
    };
    routes: {
        'content-api': {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
            }[];
        };
    };
    services: {
        settingsService: () => import("./services/settings-service").SettingsService;
    };
};
export default _default;
