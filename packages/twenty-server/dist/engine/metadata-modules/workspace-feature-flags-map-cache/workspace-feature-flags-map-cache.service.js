"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceFeatureFlagsMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceFeatureFlagsMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _workspacecacheproviderservice = require("../../workspace-cache/interfaces/workspace-cache-provider.service");
const _featureflagentity = require("../../core-modules/feature-flag/feature-flag.entity");
const _workspacecachedecorator = require("../../workspace-cache/decorators/workspace-cache.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let WorkspaceFeatureFlagsMapCacheService = class WorkspaceFeatureFlagsMapCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    async computeForCache(workspaceId) {
        const workspaceFeatureFlags = await this.featureFlagRepository.find({
            where: {
                workspaceId
            }
        });
        const workspaceFeatureFlagsMap = workspaceFeatureFlags.reduce((result, currentFeatureFlag)=>{
            result[currentFeatureFlag.key] = currentFeatureFlag.value;
            return result;
        }, {});
        return workspaceFeatureFlagsMap;
    }
    constructor(featureFlagRepository){
        super(), this.featureFlagRepository = featureFlagRepository;
    }
};
WorkspaceFeatureFlagsMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('featureFlagsMap'),
    _ts_param(0, (0, _typeorm.InjectRepository)(_featureflagentity.FeatureFlagEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], WorkspaceFeatureFlagsMapCacheService);

//# sourceMappingURL=workspace-feature-flags-map-cache.service.js.map