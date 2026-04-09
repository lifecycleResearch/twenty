"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useGraphQLQueryTiming", {
    enumerable: true,
    get: function() {
        return useGraphQLQueryTiming;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("graphql");
const _types = require("twenty-shared/types");
const _querytimingcontextstorage = require("../storage/query-timing-context.storage");
const logger = new _common.Logger('GraphQLQueryTiming');
const useGraphQLQueryTiming = (options)=>{
    return {
        async onExecute ({ args, executeFn, setExecuteFn }) {
            const workspaceId = args.contextValue.req?.workspace?.id;
            if (!workspaceId) {
                return;
            }
            const isEnabled = await options.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_GRAPHQL_QUERY_TIMING_ENABLED, workspaceId);
            if (!isEnabled) {
                return;
            }
            const rootOperation = args.document.definitions.find((definition)=>definition.kind === _graphql.Kind.OPERATION_DEFINITION);
            const operationName = args.operationName || rootOperation?.name?.value || 'Anonymous';
            const operationType = rootOperation?.operation ?? 'unknown';
            const startTime = performance.now();
            setExecuteFn((executeArgs)=>_querytimingcontextstorage.queryTimingContextStorage.run(true, ()=>executeFn(executeArgs)));
            return {
                onExecuteDone () {
                    const durationMs = (performance.now() - startTime).toFixed(2);
                    logger.log(`[${operationType}] ${operationName} — ${durationMs}ms (workspace: ${workspaceId})`);
                }
            };
        }
    };
};

//# sourceMappingURL=use-graphql-query-timing.hook.js.map