"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MigrateRichTextToTextCommand", {
    enumerable: true,
    get: function() {
        return MigrateRichTextToTextCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _types = require("twenty-shared/types");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _featureflagservice = require("../../../../engine/core-modules/feature-flag/services/feature-flag.service");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
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
let MigrateRichTextToTextCommand = class MigrateRichTextToTextCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isMigrated = await this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_RICH_TEXT_V1_MIGRATED, workspaceId);
        if (isMigrated) {
            this.logger.log(`Rich text migration already completed for workspace ${workspaceId}. Skipping.`);
            return;
        }
        const dryRun = options?.dryRun ?? false;
        if (dryRun) {
            this.logger.log(`[DRY RUN] Would update RICH_TEXT -> TEXT and RICH_TEXT_V2 -> RICH_TEXT in core.fieldMetadata for workspace ${workspaceId}. Skipping.`);
            return;
        }
        this.logger.log(`Migrating RICH_TEXT fields in workspace ${workspaceId}`);
        const queryRunner = this.coreDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const v1Result = await queryRunner.query(`UPDATE core."fieldMetadata"
         SET "type" = 'TEXT'
         WHERE "workspaceId" = $1
           AND "type" = 'RICH_TEXT'
         RETURNING "id"`, [
                workspaceId
            ]);
            const v1Count = v1Result.length;
            const renameResult = await queryRunner.query(`UPDATE core."fieldMetadata"
         SET "type" = 'RICH_TEXT'
         WHERE "workspaceId" = $1
           AND "type" = 'RICH_TEXT_V2'
         RETURNING "id"`, [
                workspaceId
            ]);
            const renameCount = renameResult.length;
            await queryRunner.commitTransaction();
            if (v1Count > 0) {
                this.logger.log(`Migrated ${v1Count} RICH_TEXT (V1) field(s) to TEXT in workspace ${workspaceId}`);
            }
            if (renameCount > 0) {
                this.logger.log(`Renamed ${renameCount} RICH_TEXT_V2 field(s) to RICH_TEXT in workspace ${workspaceId}`);
            }
            await this.featureFlagService.enableFeatureFlags([
                _types.FeatureFlagKey.IS_RICH_TEXT_V1_MIGRATED
            ], workspaceId);
            if (v1Count > 0 || renameCount > 0) {
                await this.invalidateCaches(workspaceId);
            } else {
                this.logger.log(`No RICH_TEXT or RICH_TEXT_V2 fields found in workspace ${workspaceId}`);
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
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
            'ORMEntityMetadatas',
            'featureFlagsMap'
        ];
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, cacheKeysToInvalidate);
        await this.workspaceMetadataVersionService.incrementMetadataVersion(workspaceId);
        await this.workspaceCacheStorageService.flush(workspaceId);
        this.logger.log(`Cache invalidated and metadata version incremented for workspace ${workspaceId}`);
    }
    constructor(workspaceRepository, coreDataSource, twentyORMGlobalManager, dataSourceService, featureFlagService, workspaceCacheService, workspaceCacheStorageService, workspaceMetadataVersionService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.coreDataSource = coreDataSource, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.featureFlagService = featureFlagService, this.workspaceCacheService = workspaceCacheService, this.workspaceCacheStorageService = workspaceCacheStorageService, this.workspaceMetadataVersionService = workspaceMetadataVersionService;
    }
};
MigrateRichTextToTextCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:migrate-rich-text-to-text',
        description: 'Migrate deprecated RICH_TEXT (V1) to TEXT and rename RICH_TEXT_V2 to RICH_TEXT. The underlying column type is already text, so only the metadata needs updating.'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(1, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacecachestorageservice.WorkspaceCacheStorageService === "undefined" ? Object : _workspacecachestorageservice.WorkspaceCacheStorageService,
        typeof _workspacemetadataversionservice.WorkspaceMetadataVersionService === "undefined" ? Object : _workspacemetadataversionservice.WorkspaceMetadataVersionService
    ])
], MigrateRichTextToTextCommand);

//# sourceMappingURL=1-20-migrate-rich-text-to-text.command.js.map