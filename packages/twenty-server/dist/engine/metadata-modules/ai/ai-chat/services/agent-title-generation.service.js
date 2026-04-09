"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentTitleGenerationService", {
    enumerable: true,
    get: function() {
        return AgentTitleGenerationService;
    }
});
const _common = require("@nestjs/common");
const _ai = require("ai");
const _aitelemetryconst = require("../../ai-models/constants/ai-telemetry.const");
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
let AgentTitleGenerationService = class AgentTitleGenerationService {
    async generateThreadTitle(messageContent) {
        try {
            const defaultModel = this.aiModelRegistryService.getDefaultSpeedModel();
            if (!defaultModel) {
                this.logger.warn('No default AI model available for title generation');
                return this.generateFallbackTitle(messageContent);
            }
            const result = await (0, _ai.generateText)({
                model: defaultModel.model,
                prompt: `Generate a concise, descriptive title (maximum 60 characters) for a chat thread based on the following message. The title should capture the main topic or purpose of the conversation. Return only the title, nothing else. Message: "${messageContent}"`,
                experimental_telemetry: _aitelemetryconst.AI_TELEMETRY_CONFIG
            });
            return this.cleanTitle(result.text);
        } catch (error) {
            this.logger.error('Failed to generate title with AI:', error);
            return this.generateFallbackTitle(messageContent);
        }
    }
    generateFallbackTitle(messageContent) {
        const cleanContent = messageContent.trim().replace(/\s+/g, ' ');
        const title = cleanContent.substring(0, 50);
        return cleanContent.length > 50 ? `${title}...` : title;
    }
    cleanTitle(title) {
        return title.replace(/^["']|["']$/g, '').trim().replace(/\s+/g, ' ');
    }
    constructor(aiModelRegistryService){
        this.aiModelRegistryService = aiModelRegistryService;
        this.logger = new _common.Logger(AgentTitleGenerationService.name);
    }
};
AgentTitleGenerationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService
    ])
], AgentTitleGenerationService);

//# sourceMappingURL=agent-title-generation.service.js.map