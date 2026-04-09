"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationModule", {
    enumerable: true,
    get: function() {
        return ApplicationModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _applicationentity = require("./application.entity");
const _applicationservice = require("./application.service");
const _workspaceflatapplicationmapcacheservice = require("./workspace-flat-application-map-cache.service");
const _featureflagmodule = require("../feature-flag/feature-flag.module");
const _twentyconfigmodule = require("../twenty-config/twenty-config.module");
const _workspaceentity = require("../workspace/workspace.entity");
const _workspacemanyorallflatentitymapscachemodule = require("../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module");
const _workspacecachemodule = require("../../workspace-cache/workspace-cache.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ApplicationModule = class ApplicationModule {
};
ApplicationModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _applicationentity.ApplicationEntity,
                _workspaceentity.WorkspaceEntity
            ]),
            _workspacemanyorallflatentitymapscachemodule.WorkspaceManyOrAllFlatEntityMapsCacheModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _twentyconfigmodule.TwentyConfigModule,
            _featureflagmodule.FeatureFlagModule
        ],
        exports: [
            _applicationservice.ApplicationService,
            _workspaceflatapplicationmapcacheservice.WorkspaceFlatApplicationMapCacheService
        ],
        providers: [
            _applicationservice.ApplicationService,
            _workspaceflatapplicationmapcacheservice.WorkspaceFlatApplicationMapCacheService
        ]
    })
], ApplicationModule);

//# sourceMappingURL=application.module.js.map