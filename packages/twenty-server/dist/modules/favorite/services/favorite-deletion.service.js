"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FavoriteDeletionService", {
    enumerable: true,
    get: function() {
        return FavoriteDeletionService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _typeorm1 = require("typeorm");
const _fieldmetadataentity = require("../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _objectmetadataentity = require("../../../engine/metadata-modules/object-metadata/object-metadata.entity");
const _globalworkspaceormmanager = require("../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _favoritedeletionbatchsize = require("../constants/favorite-deletion-batch-size");
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
let FavoriteDeletionService = class FavoriteDeletionService {
    async deleteFavoritesForDeletedRecords(deletedRecordIds, workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const favoriteRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'favorite');
            const favoriteObjectMetadata = await this.objectMetadataRepository.findOne({
                where: {
                    nameSingular: 'favorite',
                    workspaceId
                }
            });
            if (!favoriteObjectMetadata) {
                throw new Error('Favorite object metadata not found');
            }
            const favoriteFields = await this.fieldMetadataRepository.find({
                where: {
                    objectMetadataId: favoriteObjectMetadata.id,
                    type: _types.FieldMetadataType.RELATION
                }
            });
            const favoritesToDelete = await favoriteRepository.find({
                select: {
                    id: true
                },
                where: favoriteFields.map((field)=>({
                        [`${field.name}Id`]: (0, _typeorm1.In)(deletedRecordIds)
                    })),
                withDeleted: true
            });
            if (favoritesToDelete.length === 0) {
                return;
            }
            const favoriteIdsToDelete = favoritesToDelete.map((favorite)=>favorite.id);
            const batches = [];
            for(let i = 0; i < favoriteIdsToDelete.length; i += _favoritedeletionbatchsize.FAVORITE_DELETION_BATCH_SIZE){
                batches.push(favoriteIdsToDelete.slice(i, i + _favoritedeletionbatchsize.FAVORITE_DELETION_BATCH_SIZE));
            }
            for (const batch of batches){
                await favoriteRepository.delete(batch);
            }
        }, authContext);
    }
    constructor(objectMetadataRepository, fieldMetadataRepository, globalWorkspaceOrmManager){
        this.objectMetadataRepository = objectMetadataRepository;
        this.fieldMetadataRepository = fieldMetadataRepository;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
    }
};
FavoriteDeletionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_objectmetadataentity.ObjectMetadataEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager
    ])
], FavoriteDeletionService);

//# sourceMappingURL=favorite-deletion.service.js.map