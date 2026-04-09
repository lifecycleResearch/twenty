"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "metadataModuleFactory", {
    enumerable: true,
    get: function() {
        return metadataModuleFactory;
    }
});
const _graphqltypejson = /*#__PURE__*/ _interop_require_default(require("graphql-type-json"));
const _nodeenvironmentinterface = require("../../core-modules/twenty-config/interfaces/node-environment.interface");
const _usecachedmetadata = require("./graphql-config/hooks/use-cached-metadata");
const _metadatagraphqlapimodule = require("./metadata-graphql-api.module");
const _clientconfigentity = require("../../core-modules/client-config/client-config.entity");
const _usedisableintrospectionandsuggestionsforunauthenticatedusershook = require("../../core-modules/graphql/hooks/use-disable-introspection-and-suggestions-for-unauthenticated-users.hook");
const _usegraphqlerrorhandlerhook = require("../../core-modules/graphql/hooks/use-graphql-error-handler.hook");
const _usegraphqlquerytiminghook = require("../../core-modules/graphql/hooks/use-graphql-query-timing.hook");
const _usevalidategraphqlquerycomplexityhook = require("../../core-modules/graphql/hooks/use-validate-graphql-query-complexity.hook");
const _renderapolloplaygroundutil = require("../../utils/render-apollo-playground.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const metadataModuleFactory = async (twentyConfigService, exceptionHandlerService, dataloaderService, cacheStorageService, metricsService, i18nService, featureFlagService)=>{
    const config = {
        autoSchemaFile: true,
        include: [
            _metadatagraphqlapimodule.MetadataGraphQLApiModule
        ],
        resolverSchemaScope: 'metadata',
        buildSchemaOptions: {
            orphanedTypes: [
                _clientconfigentity.ClientConfig
            ]
        },
        renderGraphiQL () {
            return (0, _renderapolloplaygroundutil.renderApolloPlayground)({
                path: 'metadata'
            });
        },
        resolvers: {
            JSON: _graphqltypejson.default
        },
        plugins: [
            (0, _usegraphqlquerytiminghook.useGraphQLQueryTiming)({
                featureFlagService
            }),
            (0, _usegraphqlerrorhandlerhook.useGraphQLErrorHandlerHook)({
                metricsService: metricsService,
                exceptionHandlerService,
                i18nService,
                twentyConfigService
            }),
            (0, _usecachedmetadata.useCachedMetadata)({
                cacheGetter: cacheStorageService.get.bind(cacheStorageService),
                cacheSetter: cacheStorageService.set.bind(cacheStorageService),
                operationsToCache: [
                    'ObjectMetadataItems',
                    'FindAllViews'
                ]
            }),
            (0, _usedisableintrospectionandsuggestionsforunauthenticatedusershook.useDisableIntrospectionAndSuggestionsForUnauthenticatedUsers)(twentyConfigService.get('NODE_ENV') === _nodeenvironmentinterface.NodeEnvironment.PRODUCTION),
            (0, _usevalidategraphqlquerycomplexityhook.useValidateGraphqlQueryComplexity)({
                maximumAllowedFields: twentyConfigService.get('GRAPHQL_MAX_FIELDS'),
                maximumAllowedRootResolvers: 10,
                maximumAllowedNestedFields: 10,
                checkDuplicateRootResolvers: true
            })
        ],
        path: '/metadata',
        context: ()=>({
                loaders: dataloaderService.createLoaders()
            })
    };
    if (twentyConfigService.get('NODE_ENV') === _nodeenvironmentinterface.NodeEnvironment.DEVELOPMENT) {
        config.renderGraphiQL = ()=>{
            return (0, _renderapolloplaygroundutil.renderApolloPlayground)({
                path: 'metadata'
            });
        };
    }
    return config;
};

//# sourceMappingURL=metadata.module-factory.js.map