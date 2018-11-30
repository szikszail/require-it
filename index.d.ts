declare module "require-it" {
    export type Resolver = (module: string) => string;

    interface RequireIt {
        resolve: Resolver;
        directory: Resolver;
        global: {
            resolve: Resolver;
            directory: Resolver;
        }
    };

    export = RequireIt;
}