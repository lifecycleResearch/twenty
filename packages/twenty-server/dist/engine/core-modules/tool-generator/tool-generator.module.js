"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ToolGeneratorModule", {
    enumerable: true,
    get: function() {
        return ToolGeneratorModule;
    }
});
const _common = require("@nestjs/common");
const _workspacemanyorallflatentitymapscachemodule = require("../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
const _perobjecttoolgeneratorservice = require("./services/per-object-tool-generator.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ToolGeneratorModule = class ToolGeneratorModule {
};
ToolGeneratorModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule
        ],
        providers: [
            _perobjecttoolgeneratorservice.PerObjectToolGeneratorService
        ],
        exports: [
            _perobjecttoolgeneratorservice.PerObjectToolGeneratorService
        ]
    })
], ToolGeneratorModule);

//# sourceMappingURL=tool-generator.module.js.map