"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataQueryBuilderModule", {
    enumerable: true,
    get: function() {
        return MetadataQueryBuilderModule;
    }
});
const _common = require("@nestjs/common");
const _authmodule = require("../../../../core-modules/auth/auth.module");
const _metadataquerybuilderfactory = require("./metadata-query-builder.factory");
const _metadatafactories = require("./factories/metadata-factories");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MetadataQueryBuilderModule = class MetadataQueryBuilderModule {
};
MetadataQueryBuilderModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _authmodule.AuthModule
        ],
        providers: [
            ..._metadatafactories.metadataQueryBuilderFactories,
            _metadataquerybuilderfactory.MetadataQueryBuilderFactory
        ],
        exports: [
            _metadataquerybuilderfactory.MetadataQueryBuilderFactory
        ]
    })
], MetadataQueryBuilderModule);

//# sourceMappingURL=metadata-query-builder.module.js.map