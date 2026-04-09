"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentAsyncExecutorService", {
    enumerable: true,
    get: function() {
        return AgentAsyncExecutorService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _ai = require("ai");
const _utils = require("twenty-shared/utils");
const _isuserauthcontextguard = require("../../../../core-modules/auth/guards/is-user-auth-context.guard");
const _toolcategoryenum = require("../../../../core-modules/tool-provider/enums/tool-category.enum");
const _toolregistryservice = require("../../../../core-modules/tool-provider/services/tool-registry.service");
const _extractcachecreationtokensutil = require("../../ai-billing/utils/extract-cache-creation-tokens.util");
const _mergelanguagemodelusageutil = require("../../ai-billing/utils/merge-language-model-usage.util");
const _agentexception = require("../../ai-agent/agent.exception");
const _agentconfigconst = require("../../ai-agent/constants/agent-config.const");
const _agentsystempromptsconst = require("../../ai-agent/constants/agent-system-prompts.const");
const _repairtoolcallutil = require("../../ai-agent/utils/repair-tool-call.util");
const _aitelemetryconst = require("../../ai-models/constants/ai-telemetry.const");
const _agentmodelconfigservice = require("../../ai-models/services/agent-model-config.service");
const _workspaceentity = require("../../../../core-modules/workspace/workspace.entity");
const _aimodelregistryservice = require("../../ai-models/services/ai-model-registry.service");
const _roletargetentity = require("../../../role-target/role-target.entity");
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
let AgentAsyncExecutorService = class AgentAsyncExecutorService {
    extractRoleIds(rolePermissionConfig) {
        if (!rolePermissionConfig) {
            return [];
        }
        if ('intersectionOf' in rolePermissionConfig) {
            return rolePermissionConfig.intersectionOf;
        }
        if ('unionOf' in rolePermissionConfig) {
            return rolePermissionConfig.unionOf;
        }
        return [];
    }
    async getEffectiveRolePermissionConfig(agentId, workspaceId, rolePermissionConfig) {
        const roleTarget = await this.roleTargetRepository.findOne({
            where: {
                agentId,
                workspaceId
            },
            select: [
                'roleId'
            ]
        });
        const agentRoleId = roleTarget?.roleId;
        const configRoleIds = this.extractRoleIds(rolePermissionConfig);
        const allRoleIds = agentRoleId ? [
            ...new Set([
                ...configRoleIds,
                agentRoleId
            ])
        ] : configRoleIds;
        if (allRoleIds.length === 0) {
            return undefined;
        }
        return {
            intersectionOf: allRoleIds
        };
    }
    async executeAgent({ agent, userPrompt, actorContext, rolePermissionConfig, authContext }) {
        try {
            if (agent) {
                const workspace = await this.workspaceRepository.findOneBy({
                    id: agent.workspaceId
                });
                if (workspace) {
                    this.aiModelRegistryService.validateModelAvailability(agent.modelId, workspace);
                }
            }
            const registeredModel = await this.aiModelRegistryService.resolveModelForAgent(agent);
            let tools = {};
            let providerOptions = {};
            if (agent) {
                const effectiveRoleConfig = await this.getEffectiveRolePermissionConfig(agent.id, agent.workspaceId, rolePermissionConfig);
                // Workflow context: DATABASE_CRUD, ACTION, and NATIVE_MODEL tools only
                // Workflow tools are excluded to prevent circular dependencies
                const roleId = this.extractRoleIds(effectiveRoleConfig)[0] ?? '';
                tools = await this.toolRegistry.getToolsByCategories({
                    workspaceId: agent.workspaceId,
                    roleId,
                    rolePermissionConfig: effectiveRoleConfig ?? {
                        unionOf: []
                    },
                    authContext,
                    actorContext,
                    agent: agent,
                    userId: (0, _utils.isDefined)(authContext) && (0, _isuserauthcontextguard.isUserAuthContext)(authContext) ? authContext.user.id : undefined,
                    userWorkspaceId: (0, _utils.isDefined)(authContext) && (0, _isuserauthcontextguard.isUserAuthContext)(authContext) ? authContext.userWorkspaceId : undefined
                }, {
                    categories: [
                        _toolcategoryenum.ToolCategory.DATABASE_CRUD,
                        _toolcategoryenum.ToolCategory.ACTION,
                        _toolcategoryenum.ToolCategory.NATIVE_MODEL
                    ],
                    wrapWithErrorContext: false
                });
                providerOptions = this.agentModelConfigService.getProviderOptions(registeredModel, agent);
            }
            this.logger.log(`Generated ${Object.keys(tools).length} tools for agent`);
            const textResponse = await (0, _ai.generateText)({
                system: `${_agentsystempromptsconst.WORKFLOW_SYSTEM_PROMPTS.BASE}\n\n${agent ? agent.prompt : ''}`,
                tools,
                model: registeredModel.model,
                prompt: userPrompt,
                stopWhen: (0, _ai.stepCountIs)(_agentconfigconst.AGENT_CONFIG.MAX_STEPS),
                providerOptions,
                experimental_telemetry: _aitelemetryconst.AI_TELEMETRY_CONFIG,
                experimental_repairToolCall: async ({ toolCall, tools: toolsForRepair, inputSchema, error })=>{
                    return (0, _repairtoolcallutil.repairToolCall)({
                        toolCall,
                        tools: toolsForRepair,
                        inputSchema,
                        error,
                        model: registeredModel.model
                    });
                }
            });
            const cacheCreationTokens = (0, _extractcachecreationtokensutil.extractCacheCreationTokensFromSteps)(textResponse.steps);
            const agentSchema = agent?.responseFormat?.type === 'json' ? agent.responseFormat.schema : undefined;
            if (!agentSchema) {
                return {
                    result: {
                        response: textResponse.text
                    },
                    usage: textResponse.usage,
                    cacheCreationTokens
                };
            }
            const structuredResult = await (0, _ai.generateText)({
                system: _agentsystempromptsconst.WORKFLOW_SYSTEM_PROMPTS.OUTPUT_GENERATOR,
                model: registeredModel.model,
                prompt: `Based on the following execution results, generate the structured output according to the schema:

                 Execution Results: ${textResponse.text}

                 Please generate the structured output based on the execution results and context above.`,
                output: _ai.Output.object({
                    schema: (0, _ai.jsonSchema)(agentSchema)
                }),
                experimental_telemetry: _aitelemetryconst.AI_TELEMETRY_CONFIG
            });
            if (structuredResult.output == null) {
                throw new _agentexception.AgentException('Failed to generate structured output from execution results', _agentexception.AgentExceptionCode.AGENT_EXECUTION_FAILED);
            }
            return {
                result: structuredResult.output,
                usage: (0, _mergelanguagemodelusageutil.mergeLanguageModelUsage)(textResponse.usage, structuredResult.usage),
                cacheCreationTokens
            };
        } catch (error) {
            if (error instanceof _agentexception.AgentException) {
                throw error;
            }
            throw new _agentexception.AgentException(error instanceof Error ? error.message : 'Agent execution failed', _agentexception.AgentExceptionCode.AGENT_EXECUTION_FAILED);
        }
    }
    constructor(aiModelRegistryService, agentModelConfigService, toolRegistry, roleTargetRepository, workspaceRepository){
        this.aiModelRegistryService = aiModelRegistryService;
        this.agentModelConfigService = agentModelConfigService;
        this.toolRegistry = toolRegistry;
        this.roleTargetRepository = roleTargetRepository;
        this.workspaceRepository = workspaceRepository;
        this.logger = new _common.Logger(AgentAsyncExecutorService.name);
    }
};
AgentAsyncExecutorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_roletargetentity.RoleTargetEntity)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _agentmodelconfigservice.AgentModelConfigService === "undefined" ? Object : _agentmodelconfigservice.AgentModelConfigService,
        typeof _toolregistryservice.ToolRegistryService === "undefined" ? Object : _toolregistryservice.ToolRegistryService,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository
    ])
], AgentAsyncExecutorService);

//# sourceMappingURL=agent-async-executor.service.js.map