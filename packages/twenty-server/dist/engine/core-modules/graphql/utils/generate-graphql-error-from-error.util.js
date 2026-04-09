"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateGraphQLErrorFromError", {
    enumerable: true,
    get: function() {
        return generateGraphQLErrorFromError;
    }
});
const _common = require("@nestjs/common");
const _graphqlerrorsutil = require("./graphql-errors.util");
const _globalexceptionhandlerutil = require("../../../utils/global-exception-handler.util");
const _customexception = require("../../../../utils/custom-exception");
const generateGraphQLErrorFromError = (error, i18n)=>{
    const graphqlError = error instanceof _common.HttpException ? (0, _globalexceptionhandlerutil.convertExceptionToGraphQLError)(error) : new _graphqlerrorsutil.BaseGraphQLError(error.message, _graphqlerrorsutil.ErrorCode.INTERNAL_SERVER_ERROR);
    const defaultErrorMessage = /*i18n*/ {
        id: "XyOToQ",
        message: "An error occurred."
    };
    if (error instanceof _customexception.CustomException) {
        graphqlError.extensions.userFriendlyMessage = i18n._(error.userFriendlyMessage ?? defaultErrorMessage);
    } else {
        graphqlError.extensions.userFriendlyMessage = i18n._(defaultErrorMessage);
    }
    return graphqlError;
};

//# sourceMappingURL=generate-graphql-error-from-error.util.js.map