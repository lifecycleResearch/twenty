"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeSkipWorkspaceSchemaCreation", {
    enumerable: true,
    get: function() {
        return computeSkipWorkspaceSchemaCreation;
    }
});
const _graphqlextracttoplevelfieldsutil = require("./graphql-extract-top-level-fields.util");
const INTROSPECTION_PATTERN = /__schema|__type(?!name)/;
const computeSkipWorkspaceSchemaCreation = (queryString, document, operationName, generatedWorkspaceResolverNames)=>{
    if (INTROSPECTION_PATTERN.test(queryString)) {
        return false;
    }
    const topLevelFields = (0, _graphqlextracttoplevelfieldsutil.graphQLExtractTopLevelFields)(document, operationName);
    const hasCore = topLevelFields.some((field)=>!generatedWorkspaceResolverNames.has(field.name.value));
    const hasGenerated = topLevelFields.some((field)=>generatedWorkspaceResolverNames.has(field.name.value));
    return !(hasCore && hasGenerated);
};

//# sourceMappingURL=compute-skip-workspace-schema-creation.util.js.map