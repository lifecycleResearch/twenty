"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useDirectExecution", {
    enumerable: true,
    get: function() {
        return useDirectExecution;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("graphql");
const _types = require("twenty-shared/types");
const _guards = require("@sniptt/guards");
const _querytimingcontextstorage = require("../../../../core-modules/graphql/storage/query-timing-context.storage");
const _computeskipworkspaceschemacreationutil = require("../utils/compute-skip-workspace-schema-creation.util");
const _findoperationdefinitionutil = require("../utils/find-operation-definition.util");
const _hasonlygeneratedworkspaceresolversutil = require("../utils/has-only-generated-workspace-resolvers.util");
const _issubscriptionoperationutil = require("../utils/is-subscription-operation.util");
const logger = new _common.Logger('GraphQLQueryTiming');
function useDirectExecution(config) {
    return {
        onRequest: async ({ endResponse, serverContext })=>{
            const req = serverContext.req;
            if (!req.workspace?.id || !req.body?.query) {
                return;
            }
            const isDirectExecutionEnabled = await config.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_DIRECT_GRAPHQL_EXECUTION_ENABLED, req.workspace.id);
            if (!isDirectExecutionEnabled) {
                return;
            }
            const generatedWorkspaceResolverNames = await config.directExecutionService.getGeneratedWorkspaceResolverNames(req.workspace.id);
            if (!generatedWorkspaceResolverNames) {
                return;
            }
            const queryString = req.body.query;
            const operationName = req.body.operationName;
            let document;
            try {
                document = (0, _graphql.parse)(queryString);
            } catch  {
                return;
            }
            if (!(0, _findoperationdefinitionutil.findOperationDefinition)(document, operationName) || (0, _issubscriptionoperationutil.isSubscriptionOperation)(document, operationName)) {
                return;
            }
            if ((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(queryString, document, operationName, generatedWorkspaceResolverNames)) {
                req.skipWorkspaceSchemaCreation = true;
            }
            if (!(0, _hasonlygeneratedworkspaceresolversutil.hasOnlyGeneratedWorkspaceResolvers)(document, operationName, generatedWorkspaceResolverNames)) {
                return;
            }
            const isTimingEnabled = await config.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_GRAPHQL_QUERY_TIMING_ENABLED, req.workspace.id);
            const resolvedOperationName = operationName ?? 'Anonymous';
            if (isTimingEnabled) {
                const startTime = performance.now();
                const timedResult = await _querytimingcontextstorage.queryTimingContextStorage.run(true, ()=>config.directExecutionService.execute(req, document));
                const durationMs = (performance.now() - startTime).toFixed(2);
                logger.log(`[direct-execution] ${resolvedOperationName} — ${durationMs}ms (workspace: ${req.workspace.id})`);
                if ((0, _guards.isNull)(timedResult)) {
                    return;
                }
                return endResponse(Response.json(timedResult));
            }
            const result = await config.directExecutionService.execute(req, document);
            if ((0, _guards.isNull)(result)) {
                return;
            }
            return endResponse(Response.json(result));
        }
    };
}

//# sourceMappingURL=use-direct-execution.hook.js.map