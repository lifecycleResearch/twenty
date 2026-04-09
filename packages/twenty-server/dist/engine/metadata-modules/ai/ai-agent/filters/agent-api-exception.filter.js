"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentRestApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return AgentRestApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _httpexceptionhandlerservice = require("../../../../core-modules/exception-handler/http-exception-handler.service");
const _agentexception = require("../agent.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AgentRestApiExceptionFilter = class AgentRestApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        switch(exception.code){
            case _agentexception.AgentExceptionCode.AGENT_NOT_FOUND:
            case _agentexception.AgentExceptionCode.USER_WORKSPACE_ID_NOT_FOUND:
            case _agentexception.AgentExceptionCode.ROLE_NOT_FOUND:
                return this.httpExceptionHandlerService.handleError(exception, response, 404);
            case _agentexception.AgentExceptionCode.API_KEY_NOT_CONFIGURED:
                return this.httpExceptionHandlerService.handleError(exception, response, 503);
            case _agentexception.AgentExceptionCode.AGENT_EXECUTION_FAILED:
            case _agentexception.AgentExceptionCode.ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS:
            case _agentexception.AgentExceptionCode.INVALID_AGENT_INPUT:
            case _agentexception.AgentExceptionCode.AGENT_ALREADY_EXISTS:
            case _agentexception.AgentExceptionCode.AGENT_IS_STANDARD:
                return this.httpExceptionHandlerService.handleError(exception, response, 400);
            default:
                return this.httpExceptionHandlerService.handleError(exception, response, 500);
        }
    }
    constructor(httpExceptionHandlerService){
        this.httpExceptionHandlerService = httpExceptionHandlerService;
    }
};
AgentRestApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_agentexception.AgentException),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _httpexceptionhandlerservice.HttpExceptionHandlerService === "undefined" ? Object : _httpexceptionhandlerservice.HttpExceptionHandlerService
    ])
], AgentRestApiExceptionFilter);

//# sourceMappingURL=agent-api-exception.filter.js.map