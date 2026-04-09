"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AISystemPromptPreviewDTO () {
        return AISystemPromptPreviewDTO;
    },
    get AISystemPromptSectionDTO () {
        return AISystemPromptSectionDTO;
    }
});
const _graphql = require("@nestjs/graphql");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AISystemPromptSectionDTO = class AISystemPromptSectionDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], AISystemPromptSectionDTO.prototype, "title", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], AISystemPromptSectionDTO.prototype, "content", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], AISystemPromptSectionDTO.prototype, "estimatedTokenCount", void 0);
AISystemPromptSectionDTO = _ts_decorate([
    (0, _graphql.ObjectType)('AISystemPromptSection')
], AISystemPromptSectionDTO);
let AISystemPromptPreviewDTO = class AISystemPromptPreviewDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>[
            AISystemPromptSectionDTO
        ]),
    _ts_metadata("design:type", Array)
], AISystemPromptPreviewDTO.prototype, "sections", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    _ts_metadata("design:type", Number)
], AISystemPromptPreviewDTO.prototype, "estimatedTokenCount", void 0);
AISystemPromptPreviewDTO = _ts_decorate([
    (0, _graphql.ObjectType)('AISystemPromptPreview')
], AISystemPromptPreviewDTO);

//# sourceMappingURL=ai-system-prompt-preview.dto.js.map