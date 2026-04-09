"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CoreGraphQLApiModule", {
    enumerable: true,
    get: function() {
        return CoreGraphQLApiModule;
    }
});
const _common = require("@nestjs/common");
const _scalarsexplorerservice = require("./services/scalars-explorer.service");
const _workspaceresolverbuildermodule = require("./workspace-resolver-builder/workspace-resolver-builder.module");
const _workspaceschemabuildermodule = require("./workspace-schema-builder/workspace-schema-builder.module");
const _featureflagmodule = require("../../core-modules/feature-flag/feature-flag.module");
const _datasourcemodule = require("../../metadata-modules/data-source/data-source.module");
const _workspacemanyorallflatentitymapscachemodule = require("../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _workspacecachestoragemodule = require("../../workspace-cache-storage/workspace-cache-storage.module");
const _workspaceschemafactory = require("./workspace-schema.factory");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CoreGraphQLApiModule = class CoreGraphQLApiModule {
};
CoreGraphQLApiModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _datasourcemodule.DataSourceModule,
            _workspaceschemabuildermodule.WorkspaceSchemaBuilderModule,
            _workspaceresolverbuildermodule.WorkspaceResolverBuilderModule,
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _featureflagmodule.FeatureFlagModule
        ],
        providers: [
            _workspaceschemafactory.WorkspaceSchemaFactory,
            _scalarsexplorerservice.ScalarsExplorerService
        ],
        exports: [
            _workspaceschemafactory.WorkspaceSchemaFactory
        ]
    })
], CoreGraphQLApiModule);

//# sourceMappingURL=core-graphql-api.module.js.map