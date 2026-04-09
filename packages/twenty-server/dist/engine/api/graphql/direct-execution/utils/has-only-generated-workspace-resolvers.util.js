"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasOnlyGeneratedWorkspaceResolvers", {
    enumerable: true,
    get: function() {
        return hasOnlyGeneratedWorkspaceResolvers;
    }
});
const _graphqlextracttoplevelfieldsutil = require("./graphql-extract-top-level-fields.util");
const hasOnlyGeneratedWorkspaceResolvers = (document, operationName, generatedWorkspaceResolverNames)=>{
    const topLevelFields = (0, _graphqlextracttoplevelfieldsutil.graphQLExtractTopLevelFields)(document, operationName);
    return topLevelFields.every((field)=>generatedWorkspaceResolverNames.has(field.name.value));
};

//# sourceMappingURL=has-only-generated-workspace-resolvers.util.js.map