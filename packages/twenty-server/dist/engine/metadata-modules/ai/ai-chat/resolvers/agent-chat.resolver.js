"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentChatResolver", {
    enumerable: true,
    get: function() {
        return AgentChatResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _metadataresolverdecorator = require("../../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _todisplaycreditsutil = require("../../../../core-modules/usage/utils/to-display-credits.util");
const _authuserworkspaceiddecorator = require("../../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../../decorators/auth/auth-workspace.decorator");
const _featureflagguard = require("../../../../guards/feature-flag.guard");
const _settingspermissionguard = require("../../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../../guards/workspace-auth.guard");
const _agentmessagedto = require("../../ai-agent-execution/dtos/agent-message.dto");
const _agentchatthreaddto = require("../dtos/agent-chat-thread.dto");
const _aisystempromptpreviewdto = require("../dtos/ai-system-prompt-preview.dto");
const _agentchatservice = require("../services/agent-chat.service");
const _systempromptbuilderservice = require("../services/system-prompt-builder.service");
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
let AgentChatResolver = class AgentChatResolver {
    async chatThread(id, userWorkspaceId) {
        return this.agentChatService.getThreadById(id, userWorkspaceId);
    }
    async chatMessages(threadId, userWorkspaceId) {
        return this.agentChatService.getMessagesForThread(threadId, userWorkspaceId);
    }
    async createChatThread(userWorkspaceId) {
        return this.agentChatService.createThread(userWorkspaceId);
    }
    async getAISystemPromptPreview(workspace, userWorkspaceId) {
        return this.systemPromptBuilderService.buildPreview(workspace.id, userWorkspaceId, workspace.aiAdditionalInstructions ?? undefined);
    }
    totalInputCredits(thread) {
        return (0, _todisplaycreditsutil.toDisplayCredits)(thread.totalInputCredits);
    }
    totalOutputCredits(thread) {
        return (0, _todisplaycreditsutil.toDisplayCredits)(thread.totalOutputCredits);
    }
    constructor(agentChatService, systemPromptBuilderService){
        this.agentChatService = agentChatService;
        this.systemPromptBuilderService = systemPromptBuilderService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>_agentchatthreaddto.AgentChatThreadDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_AI_ENABLED),
    _ts_param(0, (0, _graphql.Args)('id', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AgentChatResolver.prototype, "chatThread", null);
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _agentmessagedto.AgentMessageDTO
        ]),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_AI_ENABLED),
    _ts_param(0, (0, _graphql.Args)('threadId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AgentChatResolver.prototype, "chatMessages", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_agentchatthreaddto.AgentChatThreadDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_AI_ENABLED),
    _ts_param(0, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AgentChatResolver.prototype, "createChatThread", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_aisystempromptpreviewdto.AISystemPromptPreviewDTO),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_AI_ENABLED),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AgentChatResolver.prototype, "getAISystemPromptPreview", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>_graphql.Float),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AgentChatThreadEntity === "undefined" ? Object : AgentChatThreadEntity
    ]),
    _ts_metadata("design:returntype", Number)
], AgentChatResolver.prototype, "totalInputCredits", null);
_ts_decorate([
    (0, _graphql.ResolveField)(()=>_graphql.Float),
    _ts_param(0, (0, _graphql.Parent)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AgentChatThreadEntity === "undefined" ? Object : AgentChatThreadEntity
    ]),
    _ts_metadata("design:returntype", Number)
], AgentChatResolver.prototype, "totalOutputCredits", null);
AgentChatResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _featureflagguard.FeatureFlagGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.AI)),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_agentchatthreaddto.AgentChatThreadDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _agentchatservice.AgentChatService === "undefined" ? Object : _agentchatservice.AgentChatService,
        typeof _systempromptbuilderservice.SystemPromptBuilderService === "undefined" ? Object : _systempromptbuilderservice.SystemPromptBuilderService
    ])
], AgentChatResolver);

//# sourceMappingURL=agent-chat.resolver.js.map