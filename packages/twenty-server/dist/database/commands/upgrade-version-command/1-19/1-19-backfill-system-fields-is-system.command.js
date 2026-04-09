"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillSystemFieldsIsSystemCommand", {
    enumerable: true,
    get: function() {
        return BackfillSystemFieldsIsSystemCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _partialsystemflatfieldmetadatasconstant = require("../../../../engine/metadata-modules/object-metadata/constants/partial-system-flat-field-metadatas.constant");
const _workspacemetadataversionservice = require("../../../../engine/metadata-modules/workspace-metadata-version/services/workspace-metadata-version.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _workspacecachestorageservice = require("../../../../engine/workspace-cache-storage/workspace-cache-storage.service");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
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
const SYSTEM_FIELD_NAMES = Object.keys(_partialsystemflatfieldmetadatasconstant.PARTIAL_SYSTEM_FLAT_FIELD_METADATAS);
const POSITION_FIELDS_TO_FIX_TYPE = [
    _metadata.STANDARD_OBJECTS.favorite.fields.position.universalIdentifier,
    _metadata.STANDARD_OBJECTS.favoriteFolder.fields.position.universalIdentifier
];
const RELATION_FIELD_TYPES = [
    _types.FieldMetadataType.RELATION,
    _types.FieldMetadataType.MORPH_RELATION
];
let BackfillSystemFieldsIsSystemCommand = class BackfillSystemFieldsIsSystemCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const dryRun = options?.dryRun ?? false;
        this.logger.log(`${dryRun ? '[DRY RUN] ' : ''}Backfilling isSystem for system fields in workspace ${workspaceId}`);
        if (dryRun) {
            this.logger.log(`[DRY RUN] Would set isSystem=true for fields named [${SYSTEM_FIELD_NAMES.join(', ')}], set isSystem=false for relation fields, and fix position field types in workspace ${workspaceId}. Skipping.`);
            return;
        }
        const queryRunner = this.coreDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            let needsCacheInvalidation = false;
            const isSystemResult = await queryRunner.query(`UPDATE core."fieldMetadata"
         SET "isSystem" = true
         WHERE "workspaceId" = $1
           AND "name" = ANY($2)
           AND "isSystem" = false`, [
                workspaceId,
                SYSTEM_FIELD_NAMES
            ]);
            const isSystemUpdatedCount = isSystemResult?.[1] ?? 0;
            if (isSystemUpdatedCount > 0) {
                this.logger.log(`Set isSystem=true for ${isSystemUpdatedCount} field(s) in workspace ${workspaceId}`);
                needsCacheInvalidation = true;
            }
            const relationIsSystemResult = await queryRunner.query(`UPDATE core."fieldMetadata"
         SET "isSystem" = false
         WHERE "workspaceId" = $1
           AND "type" = ANY($2)
           AND "isSystem" = true`, [
                workspaceId,
                RELATION_FIELD_TYPES
            ]);
            const relationIsSystemUpdatedCount = relationIsSystemResult?.[1] ?? 0;
            if (relationIsSystemUpdatedCount > 0) {
                this.logger.log(`Set isSystem=false for ${relationIsSystemUpdatedCount} relation field(s) in workspace ${workspaceId}`);
                needsCacheInvalidation = true;
            }
            const positionTypeResult = await queryRunner.query(`UPDATE core."fieldMetadata"
         SET "type" = $1
         WHERE "workspaceId" = $2
           AND "universalIdentifier" = ANY($3)
           AND "type" = $4`, [
                _types.FieldMetadataType.POSITION,
                workspaceId,
                POSITION_FIELDS_TO_FIX_TYPE,
                _types.FieldMetadataType.NUMBER
            ]);
            const positionTypeUpdatedCount = positionTypeResult?.[1] ?? 0;
            if (positionTypeUpdatedCount > 0) {
                this.logger.log(`Fixed type from NUMBER to POSITION for ${positionTypeUpdatedCount} field(s) in workspace ${workspaceId}`);
                needsCacheInvalidation = true;
            }
            if (needsCacheInvalidation) {
                await this.invalidateCaches(workspaceId);
            } else {
                this.logger.log(`No fields needed updating in workspace ${workspaceId}`);
            }
        } finally{
            await queryRunner.release();
        }
    }
    async invalidateCaches(workspaceId) {
        const modifiedMetadataNames = [
            'fieldMetadata'
        ];
        const cacheKeysToInvalidate = [
            ...new Set(modifiedMetadataNames.flatMap((name)=>[
                    name,
                    ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)(name)
                ]).map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)),
            'ORMEntityMetadatas'
        ];
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, cacheKeysToInvalidate);
        await this.workspaceMetadataVersionService.incrementMetadataVersion(workspaceId);
        await this.workspaceCacheStorageService.flush(workspaceId);
        this.logger.log(`Cache invalidated and metadata version incremented for workspace ${workspaceId}`);
    }
    constructor(workspaceRepository, coreDataSource, twentyORMGlobalManager, dataSourceService, workspaceCacheService, workspaceCacheStorageService, workspaceMetadataVersionService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.coreDataSource = coreDataSource, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.workspaceCacheService = workspaceCacheService, this.workspaceCacheStorageService = workspaceCacheStorageService, this.workspaceMetadataVersionService = workspaceMetadataVersionService;
    }
};
BackfillSystemFieldsIsSystemCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-19:backfill-system-fields-is-system',
        description: 'Set isSystem to true for system field names, set isSystem to false for relation/morph_relation fields, and fix position field type for favorite/favoriteFolder'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(1, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacecachestorageservice.WorkspaceCacheStorageService === "undefined" ? Object : _workspacecachestorageservice.WorkspaceCacheStorageService,
        typeof _workspacemetadataversionservice.WorkspaceMetadataVersionService === "undefined" ? Object : _workspacemetadataversionservice.WorkspaceMetadataVersionService
    ])
], BackfillSystemFieldsIsSystemCommand);

//# sourceMappingURL=1-19-backfill-system-fields-is-system.command.js.map