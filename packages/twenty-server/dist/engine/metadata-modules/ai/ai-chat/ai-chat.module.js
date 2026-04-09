"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiChatModule", {
    enumerable: true,
    get: function() {
        return AiChatModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _nestjsquerycore = require("@ptc-org/nestjs-query-core");
const _nestjsquerygraphql = require("@ptc-org/nestjs-query-graphql");
const _nestjsquerytypeorm = require("@ptc-org/nestjs-query-typeorm");
const _constants = require("twenty-shared/constants");
const _tokenmodule = require("../../../core-modules/auth/token/token.module");
const _billingmodule = require("../../../core-modules/billing/billing.module");
const _workspacedomainsmodule = require("../../../core-modules/domain/workspace-domains/workspace-domains.module");
const _featureflagmodule = require("../../../core-modules/feature-flag/feature-flag.module");
const _fileentity = require("../../../core-modules/file/entities/file.entity");
const _filemodule = require("../../../core-modules/file/file.module");
const _throttlermodule = require("../../../core-modules/throttler/throttler.module");
const _toolprovidermodule = require("../../../core-modules/tool-provider/tool-provider.module");
const _userworkspaceentity = require("../../../core-modules/user-workspace/user-workspace.entity");
const _userworkspacemodule = require("../../../core-modules/user-workspace/user-workspace.module");
const _featureflagguard = require("../../../guards/feature-flag.guard");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _aiagentexecutionmodule = require("../ai-agent-execution/ai-agent-execution.module");
const _aibillingmodule = require("../ai-billing/ai-billing.module");
const _permissionsmodule = require("../../permissions/permissions.module");
const _skillmodule = require("../../skill/skill.module");
const _twentyormmodule = require("../../../twenty-orm/twenty-orm.module");
const _workspacecachestoragemodule = require("../../../workspace-cache-storage/workspace-cache-storage.module");
const _workspacecachemodule = require("../../../workspace-cache/workspace-cache.module");
const _dashboardtoolsmodule = require("../../../../modules/dashboard/tools/dashboard-tools.module");
const _workflowtoolsmodule = require("../../../../modules/workflow/workflow-tools/workflow-tools.module");
const _agentchatcontroller = require("./controllers/agent-chat.controller");
const _agentchatthreaddto = require("./dtos/agent-chat-thread.dto");
const _agentchatthreadentity = require("./entities/agent-chat-thread.entity");
const _agentchatresolver = require("./resolvers/agent-chat.resolver");
const _agentchatstreamingservice = require("./services/agent-chat-streaming.service");
const _agentchatservice = require("./services/agent-chat.service");
const _agenttitlegenerationservice = require("./services/agent-title-generation.service");
const _chatexecutionservice = require("./services/chat-execution.service");
const _systempromptbuilderservice = require("./services/system-prompt-builder.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AiChatModule = class AiChatModule {
};
AiChatModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _agentchatthreadentity.AgentChatThreadEntity,
                _fileentity.FileEntity,
                _userworkspaceentity.UserWorkspaceEntity
            ]),
            _nestjsquerygraphql.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    _nestjsquerytypeorm.NestjsQueryTypeOrmModule.forFeature([
                        _agentchatthreadentity.AgentChatThreadEntity
                    ]),
                    _featureflagmodule.FeatureFlagModule,
                    _permissionsmodule.PermissionsModule
                ],
                resolvers: [
                    {
                        EntityClass: _agentchatthreadentity.AgentChatThreadEntity,
                        DTOClass: _agentchatthreaddto.AgentChatThreadDTO,
                        pagingStrategy: _nestjsquerygraphql.PagingStrategies.CURSOR,
                        read: {
                            defaultSort: [
                                {
                                    field: 'updatedAt',
                                    direction: _nestjsquerycore.SortDirection.DESC
                                }
                            ],
                            one: {
                                disabled: true
                            },
                            many: {
                                name: 'chatThreads'
                            }
                        },
                        create: {
                            disabled: true
                        },
                        update: {
                            disabled: true
                        },
                        delete: {
                            disabled: true
                        },
                        guards: [
                            _workspaceauthguard.WorkspaceAuthGuard,
                            _featureflagguard.FeatureFlagGuard,
                            (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.AI)
                        ]
                    }
                ]
            }),
            _aiagentexecutionmodule.AiAgentExecutionModule,
            _billingmodule.BillingModule,
            _throttlermodule.ThrottlerModule,
            _featureflagmodule.FeatureFlagModule,
            _filemodule.FileModule,
            _permissionsmodule.PermissionsModule,
            _skillmodule.SkillModule,
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacedomainsmodule.WorkspaceDomainsModule,
            _twentyormmodule.TwentyORMModule,
            _tokenmodule.TokenModule,
            _userworkspacemodule.UserWorkspaceModule,
            _aibillingmodule.AiBillingModule,
            _toolprovidermodule.ToolProviderModule,
            _dashboardtoolsmodule.DashboardToolsModule,
            _workflowtoolsmodule.WorkflowToolsModule
        ],
        controllers: [
            _agentchatcontroller.AgentChatController
        ],
        providers: [
            _agentchatresolver.AgentChatResolver,
            _agentchatservice.AgentChatService,
            _agentchatstreamingservice.AgentChatStreamingService,
            _agenttitlegenerationservice.AgentTitleGenerationService,
            _chatexecutionservice.ChatExecutionService,
            _systempromptbuilderservice.SystemPromptBuilderService
        ],
        exports: [
            _agentchatservice.AgentChatService,
            _agentchatstreamingservice.AgentChatStreamingService,
            _typeorm.TypeOrmModule.forFeature([
                _agentchatthreadentity.AgentChatThreadEntity
            ])
        ]
    })
], AiChatModule);

//# sourceMappingURL=ai-chat.module.js.map