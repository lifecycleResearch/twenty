"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AgentException () {
        return AgentException;
    },
    get AgentExceptionCode () {
        return AgentExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../../utils/custom-exception");
var AgentExceptionCode = /*#__PURE__*/ function(AgentExceptionCode) {
    AgentExceptionCode["AGENT_NOT_FOUND"] = "AGENT_NOT_FOUND";
    AgentExceptionCode["AGENT_EXECUTION_FAILED"] = "AGENT_EXECUTION_FAILED";
    AgentExceptionCode["API_KEY_NOT_CONFIGURED"] = "API_KEY_NOT_CONFIGURED";
    AgentExceptionCode["USER_WORKSPACE_ID_NOT_FOUND"] = "USER_WORKSPACE_ID_NOT_FOUND";
    AgentExceptionCode["ROLE_NOT_FOUND"] = "ROLE_NOT_FOUND";
    AgentExceptionCode["ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS"] = "ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS";
    AgentExceptionCode["INVALID_AGENT_INPUT"] = "INVALID_AGENT_INPUT";
    AgentExceptionCode["AGENT_ALREADY_EXISTS"] = "AGENT_ALREADY_EXISTS";
    AgentExceptionCode["AGENT_IS_STANDARD"] = "AGENT_IS_STANDARD";
    return AgentExceptionCode;
}({});
const getAgentExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "AGENT_NOT_FOUND":
            return /*i18n*/ {
                id: "UxwIFr",
                message: "Agent not found."
            };
        case "AGENT_EXECUTION_FAILED":
            return /*i18n*/ {
                id: "kmAKx+",
                message: "Agent execution failed."
            };
        case "API_KEY_NOT_CONFIGURED":
            return /*i18n*/ {
                id: "fRWsMD",
                message: "API key is not configured."
            };
        case "USER_WORKSPACE_ID_NOT_FOUND":
            return /*i18n*/ {
                id: "lUEEso",
                message: "User workspace not found."
            };
        case "ROLE_NOT_FOUND":
            return /*i18n*/ {
                id: "/BTyf+",
                message: "Role not found."
            };
        case "ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS":
            return /*i18n*/ {
                id: "rExecr",
                message: "This role cannot be assigned to agents."
            };
        case "INVALID_AGENT_INPUT":
            return /*i18n*/ {
                id: "D/IcuN",
                message: "Invalid agent input."
            };
        case "AGENT_ALREADY_EXISTS":
            return /*i18n*/ {
                id: "Wnol69",
                message: "An agent with this name already exists."
            };
        case "AGENT_IS_STANDARD":
            return /*i18n*/ {
                id: "7XNKWU",
                message: "Standard agents cannot be modified."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let AgentException = class AgentException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getAgentExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=agent.exception.js.map