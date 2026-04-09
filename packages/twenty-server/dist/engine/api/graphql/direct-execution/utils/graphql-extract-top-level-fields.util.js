"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "graphQLExtractTopLevelFields", {
    enumerable: true,
    get: function() {
        return graphQLExtractTopLevelFields;
    }
});
const _graphql = require("graphql");
const _findoperationdefinitionutil = require("./find-operation-definition.util");
const graphQLExtractTopLevelFields = (document, operationName)=>{
    const operationDefinition = (0, _findoperationdefinitionutil.findOperationDefinition)(document, operationName);
    if (!operationDefinition) {
        return [];
    }
    return operationDefinition.selectionSet.selections.filter((selection)=>selection.kind === _graphql.Kind.FIELD);
};

//# sourceMappingURL=graphql-extract-top-level-fields.util.js.map