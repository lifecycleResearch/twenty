"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "loadDefaultAiProviders", {
    enumerable: true,
    get: function() {
        return loadDefaultAiProviders;
    }
});
const _aiprovidersjson = /*#__PURE__*/ _interop_require_default(require("../ai-providers.json"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const loadDefaultAiProviders = ()=>{
    const raw = _aiprovidersjson.default;
    const result = {};
    for (const [key, config] of Object.entries(raw)){
        result[key] = {
            ...config,
            name: key,
            models: (config.models ?? []).map((model)=>({
                    ...model,
                    source: 'catalog'
                }))
        };
    }
    return result;
};

//# sourceMappingURL=load-default-ai-providers.util.js.map