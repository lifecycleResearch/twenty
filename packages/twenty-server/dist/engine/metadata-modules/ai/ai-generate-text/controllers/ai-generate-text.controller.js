"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiGenerateTextController", {
    enumerable: true,
    get: function() {
        return AiGenerateTextController;
    }
});
const _common = require("@nestjs/common");
const _ai = require("ai");
const _constants = require("twenty-shared/constants");
const _restapiexceptionfilter = require("../../../../api/rest/rest-api-exception.filter");
const _authworkspacedecorator = require("../../../../decorators/auth/auth-workspace.decorator");
const _jwtauthguard = require("../../../../guards/jwt-auth.guard");
const _settingspermissionguard = require("../../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../../guards/workspace-auth.guard");
const _agentexception = require("../../ai-agent/agent.exception");
const _agentapiexceptionfilter = require("../../ai-agent/filters/agent-api-exception.filter");
const _generatetextinputdto = require("../dtos/generate-text-input.dto");
const _aimodelregistryservice = require("../../ai-models/services/ai-model-registry.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AiGenerateTextController = class AiGenerateTextController {
    async handleGenerateText(body, workspace) {
        if (this.aiModelRegistryService.getAvailableModels().length === 0) {
            throw new _agentexception.AgentException('No AI models are available. Please configure at least one AI provider API key.', _agentexception.AgentExceptionCode.API_KEY_NOT_CONFIGURED);
        }
        const resolvedModelId = body.modelId ?? workspace.fastModel;
        this.aiModelRegistryService.validateModelAvailability(resolvedModelId, workspace);
        const registeredModel = await this.aiModelRegistryService.resolveModelForAgent({
            modelId: resolvedModelId
        });
        const result = await (0, _ai.generateText)({
            model: registeredModel.model,
            system: body.systemPrompt,
            prompt: body.userPrompt
        });
        return {
            text: result.text,
            usage: {
                inputTokens: result.usage?.inputTokens ?? 0,
                outputTokens: result.usage?.outputTokens ?? 0
            }
        };
    }
    constructor(aiModelRegistryService){
        this.aiModelRegistryService = aiModelRegistryService;
    }
};
_ts_decorate([
    (0, _common.Post)('generate-text'),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.AI)),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _generatetextinputdto.GenerateTextInput === "undefined" ? Object : _generatetextinputdto.GenerateTextInput,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], AiGenerateTextController.prototype, "handleGenerateText", null);
AiGenerateTextController = _ts_decorate([
    (0, _common.Controller)('rest/ai'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UseFilters)(_agentapiexceptionfilter.AgentRestApiExceptionFilter, _restapiexceptionfilter.RestApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService
    ])
], AiGenerateTextController);

//# sourceMappingURL=ai-generate-text.controller.js.map