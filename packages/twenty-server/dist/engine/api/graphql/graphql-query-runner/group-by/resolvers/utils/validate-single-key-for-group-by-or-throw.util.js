"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validateSingleKeyForGroupByOrThrow", {
    enumerable: true,
    get: function() {
        return validateSingleKeyForGroupByOrThrow;
    }
});
const _standarderrormessageconstant = require("../../../../../common/common-query-runners/errors/standard-error-message.constant");
const _graphqlqueryrunnerexception = require("../../../errors/graphql-query-runner.exception");
const validateSingleKeyForGroupByOrThrow = ({ groupByKeys, errorMessage })=>{
    if (groupByKeys.length > 1) {
        throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(errorMessage, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.INVALID_QUERY_INPUT, {
            userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
        });
    }
};

//# sourceMappingURL=validate-single-key-for-group-by-or-throw.util.js.map