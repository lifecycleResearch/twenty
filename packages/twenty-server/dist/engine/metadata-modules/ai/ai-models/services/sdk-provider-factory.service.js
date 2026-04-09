"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SdkProviderFactoryService", {
    enumerable: true,
    get: function() {
        return SdkProviderFactoryService;
    }
});
const _common = require("@nestjs/common");
const _amazonbedrock = require("@ai-sdk/amazon-bedrock");
const _anthropic = require("@ai-sdk/anthropic");
const _google = require("@ai-sdk/google");
const _mistral = require("@ai-sdk/mistral");
const _openai = require("@ai-sdk/openai");
const _xai = require("@ai-sdk/xai");
const _aisdkpackageconst = require("../constants/ai-sdk-package.const");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let SdkProviderFactoryService = class SdkProviderFactoryService {
    createProvider(providerName, config) {
        const cached = this.providerInstances.get(providerName);
        if (cached) {
            return cached;
        }
        const instance = this.buildProviderInstance(config);
        this.providerInstances.set(providerName, instance);
        return instance;
    }
    getRawProvider(providerName, ...allowedPackages) {
        const instance = this.providerInstances.get(providerName);
        if (!instance || !allowedPackages.includes(instance.sdkPackage)) {
            return undefined;
        }
        return instance.rawProvider;
    }
    getRawBedrockProvider(providerName) {
        return this.getRawProvider(providerName, _aisdkpackageconst.AI_SDK_BEDROCK);
    }
    getRawAnthropicProvider(providerName) {
        return this.getRawProvider(providerName, _aisdkpackageconst.AI_SDK_ANTHROPIC);
    }
    getRawOpenAIProvider(providerName) {
        return this.getRawProvider(providerName, _aisdkpackageconst.AI_SDK_OPENAI, _aisdkpackageconst.AI_SDK_OPENAI_COMPATIBLE);
    }
    clearCache() {
        this.providerInstances.clear();
    }
    buildProviderInstance(config) {
        switch(config.npm){
            case _aisdkpackageconst.AI_SDK_OPENAI:
                return this.buildStandardProvider(config, _openai.createOpenAI);
            case _aisdkpackageconst.AI_SDK_ANTHROPIC:
                return this.buildStandardProvider(config, _anthropic.createAnthropic);
            case _aisdkpackageconst.AI_SDK_GOOGLE:
                return this.buildStandardProvider(config, _google.createGoogleGenerativeAI);
            case _aisdkpackageconst.AI_SDK_MISTRAL:
                return this.buildStandardProvider(config, _mistral.createMistral);
            case _aisdkpackageconst.AI_SDK_XAI:
                return this.buildStandardProvider(config, _xai.createXai);
            case _aisdkpackageconst.AI_SDK_BEDROCK:
                return this.buildBedrockProvider(config);
            case _aisdkpackageconst.AI_SDK_OPENAI_COMPATIBLE:
                return this.buildOpenAICompatibleProvider(config);
            default:
                throw new Error(`Unsupported SDK package: ${config.npm}`);
        }
    }
    buildStandardProvider(config, factory) {
        const provider = factory({
            ...config.apiKey && {
                apiKey: config.apiKey
            },
            ...config.baseUrl && {
                baseURL: config.baseUrl
            }
        });
        return {
            createModel: (modelId)=>provider(modelId),
            rawProvider: provider,
            sdkPackage: config.npm
        };
    }
    buildBedrockProvider(config) {
        const provider = (0, _amazonbedrock.createAmazonBedrock)({
            region: config.region ?? 'us-east-1',
            ...config.accessKeyId && config.secretAccessKey && {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                sessionToken: config.sessionToken
            }
        });
        return {
            createModel: (modelId)=>provider(modelId),
            rawProvider: provider,
            sdkPackage: _aisdkpackageconst.AI_SDK_BEDROCK
        };
    }
    buildOpenAICompatibleProvider(config) {
        if (!config.baseUrl) {
            throw new Error('baseUrl is required for openai-compatible providers');
        }
        const provider = (0, _openai.createOpenAI)({
            baseURL: config.baseUrl,
            apiKey: config.apiKey ?? ''
        });
        return {
            createModel: (modelId)=>provider(modelId),
            rawProvider: provider,
            sdkPackage: _aisdkpackageconst.AI_SDK_OPENAI_COMPATIBLE
        };
    }
    constructor(){
        this.providerInstances = new Map();
    }
};
SdkProviderFactoryService = _ts_decorate([
    (0, _common.Injectable)()
], SdkProviderFactoryService);

//# sourceMappingURL=sdk-provider-factory.service.js.map