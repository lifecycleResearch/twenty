"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "agentGraphqlApiExceptionHandler", {
    enumerable: true,
    get: function() {
        return agentGraphqlApiExceptionHandler;
    }
});
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../../../core-modules/graphql/utils/graphql-errors.util");
const _agentexception = require("../agent.exception");
const agentGraphqlApiExceptionHandler = (error)=>{
    if (error instanceof _agentexception.AgentException) {
        switch(error.code){
            case _agentexception.AgentExceptionCode.AGENT_NOT_FOUND:
            case _agentexception.AgentExceptionCode.ROLE_NOT_FOUND:
                throw new _graphqlerrorsutil.NotFoundError(error);
            case _agentexception.AgentExceptionCode.INVALID_AGENT_INPUT:
                throw new _graphqlerrorsutil.UserInputError(error);
            case _agentexception.AgentExceptionCode.AGENT_ALREADY_EXISTS:
                throw new _graphqlerrorsutil.ConflictError(error);
            case _agentexception.AgentExceptionCode.AGENT_IS_STANDARD:
            case _agentexception.AgentExceptionCode.ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS:
                throw new _graphqlerrorsutil.ForbiddenError(error);
            case _agentexception.AgentExceptionCode.AGENT_EXECUTION_FAILED:
            case _agentexception.AgentExceptionCode.API_KEY_NOT_CONFIGURED:
            case _agentexception.AgentExceptionCode.USER_WORKSPACE_ID_NOT_FOUND:
                throw error;
            default:
                {
                    return (0, _utils.assertUnreachable)(error.code);
                }
        }
    }
    throw error;
};

//# sourceMappingURL=agent-graphql-api-exception-handler.util.js.map