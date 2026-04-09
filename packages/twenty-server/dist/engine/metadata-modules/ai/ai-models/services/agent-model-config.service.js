"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentModelConfigService", {
    enumerable: true,
    get: function() {
        return AgentModelConfigService;
    }
});
const _common = require("@nestjs/common");
const _agentconfigconst = require("../../ai-agent/constants/agent-config.const");
const _aisdkpackageconst = require("../constants/ai-sdk-package.const");
const _aimodelregistryservice = require("./ai-model-registry.service");
const _sdkproviderfactoryservice = require("./sdk-provider-factory.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AgentModelConfigService = class AgentModelConfigService {
    getProviderOptions(model, agent) {
        switch(model.sdkPackage){
            case _aisdkpackageconst.AI_SDK_XAI:
                return this.getXaiProviderOptions(agent);
            case _aisdkpackageconst.AI_SDK_ANTHROPIC:
                return this.getAnthropicProviderOptions(model);
            case _aisdkpackageconst.AI_SDK_BEDROCK:
                return this.getBedrockProviderOptions(model);
            default:
                return {};
        }
    }
    getNativeModelTools(model, agent) {
        const tools = {};
        if (!agent.modelConfiguration) {
            return tools;
        }
        switch(model.sdkPackage){
            case _aisdkpackageconst.AI_SDK_ANTHROPIC:
                if (agent.modelConfiguration.webSearch?.enabled) {
                    const anthropicProvider = model.providerName ? this.sdkProviderFactory.getRawAnthropicProvider(model.providerName) : undefined;
                    if (anthropicProvider) {
                        tools.web_search = anthropicProvider.tools.webSearch_20250305();
                    }
                }
                break;
            case _aisdkpackageconst.AI_SDK_BEDROCK:
                {
                    if (agent.modelConfiguration.webSearch?.enabled) {
                        const bedrockProvider = model.providerName ? this.sdkProviderFactory.getRawBedrockProvider(model.providerName) : undefined;
                        if (bedrockProvider) {
                            tools.web_search = bedrockProvider.tools.webSearch_20250305();
                        }
                    }
                    break;
                }
            case _aisdkpackageconst.AI_SDK_OPENAI:
                if (agent.modelConfiguration.webSearch?.enabled) {
                    const openaiProvider = model.providerName ? this.sdkProviderFactory.getRawOpenAIProvider(model.providerName) : undefined;
                    if (openaiProvider) {
                        tools.web_search = openaiProvider.tools.webSearch();
                    }
                }
                break;
        }
        return tools;
    }
    getXaiProviderOptions(agent) {
        if (!agent.modelConfiguration || !agent.modelConfiguration.webSearch?.enabled && !agent.modelConfiguration.twitterSearch?.enabled) {
            return {};
        }
        const sources = [];
        if (agent.modelConfiguration.webSearch?.enabled) {
            sources.push({
                type: 'web'
            });
        }
        if (agent.modelConfiguration.twitterSearch?.enabled) {
            sources.push({
                type: 'x'
            });
        }
        return {
            xai: {
                searchParameters: {
                    mode: 'auto',
                    ...sources.length > 0 && {
                        sources
                    }
                }
            }
        };
    }
    getAnthropicProviderOptions(model) {
        if (!model.supportsReasoning) {
            return {};
        }
        return {
            anthropic: {
                thinking: {
                    type: 'enabled',
                    budgetTokens: _agentconfigconst.AGENT_CONFIG.REASONING_BUDGET_TOKENS
                }
            }
        };
    }
    getBedrockProviderOptions(model) {
        if (!model.supportsReasoning) {
            return {};
        }
        return {
            bedrock: {
                thinking: {
                    type: 'enabled',
                    budgetTokens: _agentconfigconst.AGENT_CONFIG.REASONING_BUDGET_TOKENS
                }
            }
        };
    }
    constructor(aiModelRegistryService, sdkProviderFactory){
        this.aiModelRegistryService = aiModelRegistryService;
        this.sdkProviderFactory = sdkProviderFactory;
    }
};
AgentModelConfigService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _sdkproviderfactoryservice.SdkProviderFactoryService === "undefined" ? Object : _sdkproviderfactoryservice.SdkProviderFactoryService
    ])
], AgentModelConfigService);

//# sourceMappingURL=agent-model-config.service.js.map