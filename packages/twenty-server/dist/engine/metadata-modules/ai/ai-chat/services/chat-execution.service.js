"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChatExecutionService", {
    enumerable: true,
    get: function() {
        return ChatExecutionService;
    }
});
const _common = require("@nestjs/common");
const _ai = require("ai");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _usageoperationtypeenum = require("../../../../core-modules/usage/enums/usage-operation-type.enum");
const _workspacedomainsservice = require("../../../../core-modules/domain/workspace-domains/services/workspace-domains.service");
const _exceptionhandlerservice = require("../../../../core-modules/exception-handler/exception-handler.service");
const _commonpreloadtoolsconst = require("../../../../core-modules/tool-provider/constants/common-preload-tools.const");
const _wraptoolswithoutputserializationutil = require("../../../../core-modules/tool-provider/output-serialization/wrap-tools-with-output-serialization.util");
const _toolregistryservice = require("../../../../core-modules/tool-provider/services/tool-registry.service");
const _tools = require("../../../../core-modules/tool-provider/tools");
const _agentactorcontextservice = require("../../ai-agent-execution/services/agent-actor-context.service");
const _agentconfigconst = require("../../ai-agent/constants/agent-config.const");
const _repairtoolcallutil = require("../../ai-agent/utils/repair-tool-call.util");
const _aibillingservice = require("../../ai-billing/services/ai-billing.service");
const _extractcachecreationtokensutil = require("../../ai-billing/utils/extract-cache-creation-tokens.util");
const _systempromptbuilderservice = require("./system-prompt-builder.service");
const _extractcodeinterpreterfilesutil = require("../utils/extract-code-interpreter-files.util");
const _aisdkpackageconst = require("../../ai-models/constants/ai-sdk-package.const");
const _aitelemetryconst = require("../../ai-models/constants/ai-telemetry.const");
const _aimodelregistryservice = require("../../ai-models/services/ai-model-registry.service");
const _sdkproviderfactoryservice = require("../../ai-models/services/sdk-provider-factory.service");
const _skillservice = require("../../../skill/skill.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ChatExecutionService = class ChatExecutionService {
    async streamChat({ workspace, userWorkspaceId, messages, browsingContext, onCodeExecutionUpdate, modelId }) {
        const { actorContext, roleId, userId, userContext } = await this.agentActorContextService.buildUserAndAgentActorContext(userWorkspaceId, workspace.id);
        const toolContext = {
            workspaceId: workspace.id,
            roleId,
            actorContext,
            userId,
            userWorkspaceId,
            onCodeExecutionUpdate
        };
        const contextString = browsingContext ? this.buildContextFromBrowsingContext(workspace, browsingContext) : undefined;
        const toolCatalog = await this.toolRegistry.buildToolIndex(workspace.id, roleId, {
            userId,
            userWorkspaceId
        });
        const skillCatalog = await this.skillService.findAllFlatSkills(workspace.id);
        this.logger.log(`Built tool catalog with ${toolCatalog.length} tools, ${skillCatalog.length} skills available`);
        const preloadedTools = await this.toolRegistry.getToolsByName(_commonpreloadtoolsconst.COMMON_PRELOAD_TOOLS, toolContext);
        const resolvedModelId = modelId ?? workspace.smartModel;
        this.aiModelRegistryService.validateModelAvailability(resolvedModelId, workspace);
        const registeredModel = await this.aiModelRegistryService.resolveModelForAgent({
            modelId: resolvedModelId
        });
        const modelConfig = this.aiModelRegistryService.getEffectiveModelConfig(registeredModel.modelId);
        const { tools: nativeSearchTools, callableToolNames: searchToolNames } = this.getNativeWebSearchTools(registeredModel);
        // Direct tools: native provider tools + preloaded tools.
        // These are callable directly AND as fallback through execute_tool.
        const directTools = {
            ...(0, _wraptoolswithoutputserializationutil.wrapToolsWithOutputSerialization)(preloadedTools),
            ...nativeSearchTools
        };
        const preloadedToolNames = [
            ...Object.keys(preloadedTools),
            ...searchToolNames
        ];
        // ToolSet is constant for the entire conversation — no mutation.
        // learn_tools returns schemas as text; execute_tool dispatches to cached tools.
        const activeTools = {
            ...directTools,
            [_tools.LEARN_TOOLS_TOOL_NAME]: (0, _tools.createLearnToolsTool)(this.toolRegistry, toolContext),
            [_tools.EXECUTE_TOOL_TOOL_NAME]: (0, _tools.createExecuteToolTool)(this.toolRegistry, toolContext, directTools),
            [_tools.LOAD_SKILL_TOOL_NAME]: (0, _tools.createLoadSkillTool)((skillNames)=>this.skillService.findFlatSkillsByNames(skillNames, workspace.id))
        };
        const { processedMessages, extractedFiles } = (0, _extractcodeinterpreterfilesutil.extractCodeInterpreterFiles)(messages);
        let storedFiles = [];
        if (extractedFiles.length > 0) {
            storedFiles = await this.storeExtractedFiles(extractedFiles, workspace.id);
        }
        const systemPrompt = this.systemPromptBuilder.buildFullPrompt(toolCatalog, skillCatalog, preloadedToolNames, contextString, storedFiles, workspace.aiAdditionalInstructions ?? undefined, userContext);
        this.logger.log(`Starting chat execution with model ${registeredModel.modelId}, ${Object.keys(activeTools).length} active tools`);
        const systemMessage = {
            role: 'system',
            content: systemPrompt,
            providerOptions: registeredModel.sdkPackage === _aisdkpackageconst.AI_SDK_ANTHROPIC ? {
                anthropic: {
                    cacheControl: {
                        type: 'ephemeral'
                    }
                }
            } : registeredModel.sdkPackage === _aisdkpackageconst.AI_SDK_BEDROCK ? {
                bedrock: {
                    cacheControl: {
                        type: 'ephemeral'
                    }
                }
            } : undefined
        };
        const modelMessages = await (0, _ai.convertToModelMessages)(processedMessages);
        const stream = (0, _ai.streamText)({
            model: registeredModel.model,
            messages: [
                systemMessage,
                ...modelMessages
            ],
            tools: activeTools,
            stopWhen: (0, _ai.stepCountIs)(_agentconfigconst.AGENT_CONFIG.MAX_STEPS),
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
        Promise.all([
            stream.usage,
            stream.steps
        ]).then(([usage, steps])=>{
            const cacheCreationTokens = (0, _extractcachecreationtokensutil.extractCacheCreationTokensFromSteps)(steps);
            this.aiBillingService.calculateAndBillUsage(registeredModel.modelId, {
                usage,
                cacheCreationTokens
            }, workspace.id, _usageoperationtypeenum.UsageOperationType.AI_CHAT_TOKEN, null, userWorkspaceId);
        }).catch((error)=>{
            this.exceptionHandlerService.captureExceptions([
                error
            ]);
        });
        return {
            stream,
            modelConfig
        };
    }
    buildContextFromBrowsingContext(workspace, browsingContext) {
        if (browsingContext.type === 'recordPage') {
            return this.buildRecordPageContext(workspace, browsingContext.objectNameSingular, browsingContext.recordId, browsingContext.pageLayoutId, browsingContext.activeTabId);
        }
        if (browsingContext.type === 'listView') {
            return this.buildListViewContext(browsingContext);
        }
        return '';
    }
    buildRecordPageContext(workspace, objectNameSingular, recordId, pageLayoutId, activeTabId) {
        const resourceUrl = this.workspaceDomainsService.buildWorkspaceURL({
            workspace,
            pathname: (0, _utils.getAppPath)(_types.AppPath.RecordShowPage, {
                objectNameSingular,
                objectRecordId: recordId
            })
        });
        let context = `The user is viewing a ${objectNameSingular} record (ID: ${recordId}, URL: ${resourceUrl}). Use tools to fetch record details if needed.`;
        if ((0, _utils.isDefined)(pageLayoutId)) {
            context += `\nPage layout ID: ${pageLayoutId}.`;
        }
        if ((0, _utils.isDefined)(activeTabId)) {
            context += `\nActive tab ID: ${activeTabId}.`;
        }
        return context;
    }
    buildListViewContext(browsingContext) {
        const { objectNameSingular, viewId, viewName, filterDescriptions } = browsingContext;
        let context = `The user is viewing a list of ${objectNameSingular} records in a view called "${viewName}" (viewId: ${viewId}).`;
        if (filterDescriptions.length > 0) {
            context += `\nFilters applied: ${filterDescriptions.join(', ')}`;
        }
        context += `\nUse get_view_query_parameters tool with this viewId to get the exact filter/sort parameters for querying records.`;
        return context;
    }
    getNativeWebSearchTools(model) {
        const empty = {
            tools: {},
            callableToolNames: []
        };
        const providerName = model.providerName;
        if (!providerName) {
            return empty;
        }
        switch(model.sdkPackage){
            case _aisdkpackageconst.AI_SDK_ANTHROPIC:
                {
                    const provider = this.sdkProviderFactory.getRawAnthropicProvider(providerName);
                    if (!provider) {
                        return empty;
                    }
                    return {
                        tools: {
                            web_search: provider.tools.webSearch_20250305()
                        },
                        callableToolNames: [
                            'web_search'
                        ]
                    };
                }
            case _aisdkpackageconst.AI_SDK_BEDROCK:
                {
                    const provider = this.sdkProviderFactory.getRawBedrockProvider(providerName);
                    if (!provider) {
                        return empty;
                    }
                    return {
                        tools: {
                            web_search: provider.tools.webSearch_20250305()
                        },
                        callableToolNames: [
                            'web_search'
                        ]
                    };
                }
            case _aisdkpackageconst.AI_SDK_OPENAI:
                {
                    const provider = this.sdkProviderFactory.getRawOpenAIProvider(providerName);
                    if (!provider) {
                        return empty;
                    }
                    return {
                        tools: {
                            web_search: provider.tools.webSearch()
                        },
                        callableToolNames: [
                            'web_search'
                        ]
                    };
                }
            default:
                return empty;
        }
    }
    async storeExtractedFiles(files, _workspaceId) {
        return files.map((file)=>({
                filename: file.filename,
                fileId: file.fileId
            }));
    }
    constructor(toolRegistry, skillService, aiModelRegistryService, aiBillingService, agentActorContextService, workspaceDomainsService, systemPromptBuilder, exceptionHandlerService, sdkProviderFactory){
        this.toolRegistry = toolRegistry;
        this.skillService = skillService;
        this.aiModelRegistryService = aiModelRegistryService;
        this.aiBillingService = aiBillingService;
        this.agentActorContextService = agentActorContextService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.systemPromptBuilder = systemPromptBuilder;
        this.exceptionHandlerService = exceptionHandlerService;
        this.sdkProviderFactory = sdkProviderFactory;
        this.logger = new _common.Logger(ChatExecutionService.name);
    }
};
ChatExecutionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _toolregistryservice.ToolRegistryService === "undefined" ? Object : _toolregistryservice.ToolRegistryService,
        typeof _skillservice.SkillService === "undefined" ? Object : _skillservice.SkillService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _aibillingservice.AiBillingService === "undefined" ? Object : _aibillingservice.AiBillingService,
        typeof _agentactorcontextservice.AgentActorContextService === "undefined" ? Object : _agentactorcontextservice.AgentActorContextService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService,
        typeof _systempromptbuilderservice.SystemPromptBuilderService === "undefined" ? Object : _systempromptbuilderservice.SystemPromptBuilderService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        typeof _sdkproviderfactoryservice.SdkProviderFactoryService === "undefined" ? Object : _sdkproviderfactoryservice.SdkProviderFactoryService
    ])
], ChatExecutionService);

//# sourceMappingURL=chat-execution.service.js.map