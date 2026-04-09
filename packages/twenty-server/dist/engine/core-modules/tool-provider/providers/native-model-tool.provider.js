"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeModelToolProvider", {
    enumerable: true,
    get: function() {
        return NativeModelToolProvider;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _toolcategoryenum = require("../enums/tool-category.enum");
const _agentmodelconfigservice = require("../../../metadata-modules/ai/ai-models/services/agent-model-config.service");
const _aimodelregistryservice = require("../../../metadata-modules/ai/ai-models/services/ai-model-registry.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let NativeModelToolProvider = class NativeModelToolProvider {
    async isAvailable(context) {
        return (0, _utils.isDefined)(context.agent);
    }
    async generateTools(context) {
        if (!context.agent) {
            return {};
        }
        const registeredModel = await this.aiModelRegistryService.resolveModelForAgent(context.agent);
        return this.agentModelConfigService.getNativeModelTools(registeredModel, context.agent);
    }
    constructor(agentModelConfigService, aiModelRegistryService){
        this.agentModelConfigService = agentModelConfigService;
        this.aiModelRegistryService = aiModelRegistryService;
        this.category = _toolcategoryenum.ToolCategory.NATIVE_MODEL;
    }
};
NativeModelToolProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _agentmodelconfigservice.AgentModelConfigService === "undefined" ? Object : _agentmodelconfigservice.AgentModelConfigService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService
    ])
], NativeModelToolProvider);

//# sourceMappingURL=native-model-tool.provider.js.map