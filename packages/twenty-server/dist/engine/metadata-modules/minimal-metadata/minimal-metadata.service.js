"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MinimalMetadataService", {
    enumerable: true,
    get: function() {
        return MinimalMetadataService;
    }
});
const _common = require("@nestjs/common");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _allflatentitymapspropertiesconstant = require("../flat-entity/constant/all-flat-entity-maps-properties.constant");
const _workspacemanyorallflatentitymapscacheservice = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _workspacecacheservice = require("../../workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const flatMapsKeyToMetadataName = (flatMapsKey)=>{
    const withoutPrefix = flatMapsKey.replace(/^flat/, '');
    const withoutSuffix = withoutPrefix.replace(/Maps$/, '');
    const metadataName = (0, _utils.uncapitalize)(withoutSuffix);
    return metadataName in _metadata.ALL_METADATA_NAME ? metadataName : undefined;
};
let MinimalMetadataService = class MinimalMetadataService {
    async getMinimalMetadata(workspaceId, userWorkspaceId) {
        const [{ flatObjectMetadataMaps, flatViewMaps }, cacheHashes] = await Promise.all([
            this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                workspaceId,
                flatMapsKeys: [
                    'flatObjectMetadataMaps',
                    'flatViewMaps'
                ]
            }),
            this.workspaceCacheService.getCacheHashes(workspaceId, _allflatentitymapspropertiesconstant.ALL_FLAT_ENTITY_MAPS_PROPERTIES)
        ]);
        const collectionHashes = Object.entries(cacheHashes).map(([cacheKey, hash])=>{
            const metadataName = flatMapsKeyToMetadataName(cacheKey);
            if (!(0, _utils.isDefined)(metadataName) || !(0, _utils.isDefined)(hash)) {
                return undefined;
            }
            return {
                collectionName: metadataName,
                hash
            };
        }).filter(_utils.isDefined);
        const objectMetadataItems = Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatObjectMetadata)=>flatObjectMetadata.isActive === true).map((flatObjectMetadata)=>({
                id: flatObjectMetadata.id,
                nameSingular: flatObjectMetadata.nameSingular,
                namePlural: flatObjectMetadata.namePlural,
                labelSingular: flatObjectMetadata.labelSingular,
                labelPlural: flatObjectMetadata.labelPlural,
                icon: flatObjectMetadata.icon ?? undefined,
                isCustom: flatObjectMetadata.isCustom,
                isActive: flatObjectMetadata.isActive,
                isSystem: flatObjectMetadata.isSystem,
                isRemote: flatObjectMetadata.isRemote
            }));
        const views = Object.values(flatViewMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((flatView)=>flatView.workspaceId === workspaceId).filter((flatView)=>flatView.deletedAt === null).filter((flatView)=>flatView.visibility === _types.ViewVisibility.WORKSPACE || flatView.visibility === _types.ViewVisibility.UNLISTED && (0, _utils.isDefined)(userWorkspaceId) && flatView.createdByUserWorkspaceId === userWorkspaceId).map((flatView)=>({
                id: flatView.id,
                type: flatView.type,
                key: flatView.key,
                objectMetadataId: flatView.objectMetadataId
            }));
        return {
            objectMetadataItems,
            views,
            collectionHashes
        };
    }
    constructor(flatEntityMapsCacheService, workspaceCacheService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.workspaceCacheService = workspaceCacheService;
    }
};
MinimalMetadataService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], MinimalMetadataService);

//# sourceMappingURL=minimal-metadata.service.js.map