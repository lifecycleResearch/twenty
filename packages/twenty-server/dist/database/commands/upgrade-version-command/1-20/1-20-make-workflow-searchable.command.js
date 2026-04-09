"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MakeWorkflowSearchableCommand", {
    enumerable: true,
    get: function() {
        return MakeWorkflowSearchableCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
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
let MakeWorkflowSearchableCommand = class MakeWorkflowSearchableCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would set isSearchable=true on workflow object for workspace ${workspaceId}. Skipping.`);
            return;
        }
        const queryRunner = this.coreDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const result = await queryRunner.query(`UPDATE core."objectMetadata"
         SET "isSearchable" = true
         WHERE "workspaceId" = $1
           AND "nameSingular" = 'workflow'
           AND "isSearchable" = false`, [
                workspaceId
            ]);
            const updatedCount = result?.[1] ?? 0;
            if (updatedCount > 0) {
                this.logger.log(`Set isSearchable=true on workflow object for workspace ${workspaceId}`);
                await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
                    'flatObjectMetadataMaps'
                ]);
                await this.workspaceMetadataVersionService.incrementMetadataVersion(workspaceId);
                await this.workspaceCacheStorageService.flush(workspaceId);
            } else {
                this.logger.log(`Workflow already searchable or not found for workspace ${workspaceId}, skipping`);
            }
        } finally{
            await queryRunner.release();
        }
    }
    constructor(workspaceRepository, coreDataSource, twentyORMGlobalManager, dataSourceService, workspaceCacheService, workspaceCacheStorageService, workspaceMetadataVersionService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.coreDataSource = coreDataSource, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.workspaceCacheService = workspaceCacheService, this.workspaceCacheStorageService = workspaceCacheStorageService, this.workspaceMetadataVersionService = workspaceMetadataVersionService;
    }
};
MakeWorkflowSearchableCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:make-workflow-searchable',
        description: 'Set isSearchable to true on the workflow object metadata'
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
], MakeWorkflowSearchableCommand);

//# sourceMappingURL=1-20-make-workflow-searchable.command.js.map