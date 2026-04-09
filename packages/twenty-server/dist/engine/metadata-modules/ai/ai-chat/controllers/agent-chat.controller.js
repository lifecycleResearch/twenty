"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentChatController", {
    enumerable: true,
    get: function() {
        return AgentChatController;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _restapiexceptionfilter = require("../../../../api/rest/rest-api-exception.filter");
const _billingexception = require("../../../../core-modules/billing/billing.exception");
const _billingproductkeyenum = require("../../../../core-modules/billing/enums/billing-product-key.enum");
const _billingapiexceptionfilter = require("../../../../core-modules/billing/filters/billing-api-exception.filter");
const _billingservice = require("../../../../core-modules/billing/services/billing.service");
const _twentyconfigservice = require("../../../../core-modules/twenty-config/twenty-config.service");
const _authuserworkspaceiddecorator = require("../../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../../decorators/auth/auth-workspace.decorator");
const _jwtauthguard = require("../../../../guards/jwt-auth.guard");
const _settingspermissionguard = require("../../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../../guards/workspace-auth.guard");
const _agentexception = require("../../ai-agent/agent.exception");
const _agentapiexceptionfilter = require("../../ai-agent/filters/agent-api-exception.filter");
const _agentchatstreamingservice = require("../services/agent-chat-streaming.service");
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
let AgentChatController = class AgentChatController {
    async streamAgentChat(body, userWorkspaceId, workspace, response) {
        if (this.aiModelRegistryService.getAvailableModels().length === 0) {
            throw new _agentexception.AgentException('No AI models are available. Configure at least one AI provider.', _agentexception.AgentExceptionCode.API_KEY_NOT_CONFIGURED);
        }
        const resolvedModelId = body.modelId ?? workspace.smartModel;
        this.aiModelRegistryService.validateModelAvailability(resolvedModelId, workspace);
        if (this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            const canBill = await this.billingService.canBillMeteredProduct(workspace.id, _billingproductkeyenum.BillingProductKey.WORKFLOW_NODE_EXECUTION);
            if (!canBill) {
                throw new _billingexception.BillingException('Credits exhausted', _billingexception.BillingExceptionCode.BILLING_CREDITS_EXHAUSTED);
            }
        }
        this.agentStreamingService.streamAgentChat({
            threadId: body.threadId,
            messages: body.messages,
            browsingContext: body.browsingContext ?? null,
            modelId: body.modelId,
            userWorkspaceId,
            workspace,
            response
        });
    }
    constructor(agentStreamingService, billingService, twentyConfigService, aiModelRegistryService){
        this.agentStreamingService = agentStreamingService;
        this.billingService = billingService;
        this.twentyConfigService = twentyConfigService;
        this.aiModelRegistryService = aiModelRegistryService;
    }
};
_ts_decorate([
    (0, _common.Post)('stream'),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.AI)),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(3, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        typeof Response === "undefined" ? Object : Response
    ]),
    _ts_metadata("design:returntype", Promise)
], AgentChatController.prototype, "streamAgentChat", null);
AgentChatController = _ts_decorate([
    (0, _common.Controller)('rest/agent-chat'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _workspaceauthguard.WorkspaceAuthGuard),
    (0, _common.UseFilters)(_restapiexceptionfilter.RestApiExceptionFilter, _agentapiexceptionfilter.AgentRestApiExceptionFilter, _billingapiexceptionfilter.BillingRestApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _agentchatstreamingservice.AgentChatStreamingService === "undefined" ? Object : _agentchatstreamingservice.AgentChatStreamingService,
        typeof _billingservice.BillingService === "undefined" ? Object : _billingservice.BillingService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService
    ])
], AgentChatController);

//# sourceMappingURL=agent-chat.controller.js.map