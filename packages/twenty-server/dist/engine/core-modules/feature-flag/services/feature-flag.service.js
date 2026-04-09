"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FeatureFlagService", {
    enumerable: true,
    get: function() {
        return FeatureFlagService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _featureflagentity = require("../feature-flag.entity");
const _featureflagexception = require("../feature-flag.exception");
const _featureflagvalidate = require("../validates/feature-flag.validate");
const _ispublicfeatureflagvalidate = require("../validates/is-public-feature-flag.validate");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
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
let FeatureFlagService = class FeatureFlagService {
    async isFeatureEnabled(key, workspaceId) {
        const featureFlagMap = await this.getWorkspaceFeatureFlagsMap(workspaceId);
        return !!featureFlagMap[key];
    }
    async getWorkspaceFeatureFlags(workspaceId) {
        const { featureFlagsMap: workspaceFeatureFlagsMap } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'featureFlagsMap'
        ]);
        return Object.entries(workspaceFeatureFlagsMap).map(([key, value])=>({
                key: key,
                value
            }));
    }
    async getWorkspaceFeatureFlagsMap(workspaceId) {
        const { featureFlagsMap: workspaceFeatureFlagsMap } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'featureFlagsMap'
        ]);
        return workspaceFeatureFlagsMap;
    }
    async enableFeatureFlags(keys, workspaceId) {
        if (keys.length > 0) {
            await this.featureFlagRepository.upsert(keys.map((key)=>({
                    workspaceId,
                    key,
                    value: true
                })), {
                conflictPaths: [
                    'workspaceId',
                    'key'
                ],
                skipUpdateIfNoValuesChanged: true
            });
            await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
                'featureFlagsMap'
            ]);
        }
    }
    async upsertWorkspaceFeatureFlag({ workspaceId, featureFlag, value, shouldBePublic = false }) {
        _featureflagvalidate.featureFlagValidator.assertIsFeatureFlagKey(featureFlag, new _featureflagexception.FeatureFlagException('Invalid feature flag key', _featureflagexception.FeatureFlagExceptionCode.INVALID_FEATURE_FLAG_KEY));
        if (shouldBePublic) {
            _ispublicfeatureflagvalidate.publicFeatureFlagValidator.assertIsPublicFeatureFlag(featureFlag, new _featureflagexception.FeatureFlagException('Invalid feature flag key, flag is not public', _featureflagexception.FeatureFlagExceptionCode.INVALID_FEATURE_FLAG_KEY));
        }
        const existingFeatureFlag = await this.featureFlagRepository.findOne({
            where: {
                key: featureFlag,
                workspaceId: workspaceId
            }
        });
        const featureFlagToSave = existingFeatureFlag ? {
            ...existingFeatureFlag,
            value
        } : {
            key: featureFlag,
            value,
            workspaceId: workspaceId
        };
        const result = await this.featureFlagRepository.save(featureFlagToSave);
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
            'featureFlagsMap'
        ]);
        return result;
    }
    constructor(featureFlagRepository, workspaceCacheService){
        this.featureFlagRepository = featureFlagRepository;
        this.workspaceCacheService = workspaceCacheService;
    }
};
FeatureFlagService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_featureflagentity.FeatureFlagEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], FeatureFlagService);

//# sourceMappingURL=feature-flag.service.js.map