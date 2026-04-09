"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RestApiModule", {
    enumerable: true,
    get: function() {
        return RestApiModule;
    }
});
const _common = require("@nestjs/common");
const _metadataquerybuildermodule = require("./metadata/query-builder/metadata-query-builder.module");
const _restapimetadataservice = require("./metadata/rest-api-metadata.service");
const _authmodule = require("../../core-modules/auth/auth.module");
const _securehttpclientmodule = require("../../core-modules/secure-http-client/secure-http-client.module");
const _workspacecachestoragemodule = require("../../workspace-cache-storage/workspace-cache-storage.module");
const _restapicoremodule = require("./core/rest-api-core.module");
const _restapiservice = require("./rest-api.service");
const _restapimetadatacontroller = require("./metadata/rest-api-metadata.controller");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let RestApiModule = class RestApiModule {
};
RestApiModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _metadataquerybuildermodule.MetadataQueryBuilderModule,
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _authmodule.AuthModule,
            _restapicoremodule.RestApiCoreModule,
            _permissionsmodule.PermissionsModule,
            _securehttpclientmodule.SecureHttpClientModule
        ],
        controllers: [
            _restapimetadatacontroller.RestApiMetadataController
        ],
        providers: [
            _restapiservice.RestApiService,
            _restapimetadataservice.RestApiMetadataService
        ],
        exports: [
            _restapimetadataservice.RestApiMetadataService,
            _restapiservice.RestApiService
        ]
    })
], RestApiModule);

//# sourceMappingURL=rest-api.module.js.map