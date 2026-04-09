"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdateStandardIndexViewNamesCommand", {
    enumerable: true,
    get: function() {
        return UpdateStandardIndexViewNamesCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
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
let UpdateStandardIndexViewNamesCommand = class UpdateStandardIndexViewNamesCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const dryRun = options?.dryRun ?? false;
        if (dryRun) {
            this.logger.log(`[DRY RUN] Would update standard index view names for workspace ${workspaceId}. Skipping.`);
            return;
        }
        const queryRunner = this.coreDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const result = await queryRunner.query(`
        UPDATE core."view"
        SET name = 'All {objectLabelPlural}'
        WHERE "workspaceId" = $1
          AND "isCustom" = false
          AND key = 'INDEX'
          AND name LIKE 'All %'
          AND name != 'All {objectLabelPlural}'
        `, [
                workspaceId
            ]);
            const updateCount = result?.[1] ?? 0;
            if (updateCount === 0) {
                this.logger.log(`No standard index views needed updating for workspace ${workspaceId}`);
            } else {
                this.logger.log(`Updated ${updateCount} standard index view(s) for workspace ${workspaceId}`);
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            this.logger.error(`Error updating standard index view names for workspace ${workspaceId}`, error);
            throw error;
        } finally{
            await queryRunner.release();
        }
    }
    constructor(workspaceRepository, coreDataSource, twentyORMGlobalManager, dataSourceService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.coreDataSource = coreDataSource, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService;
    }
};
UpdateStandardIndexViewNamesCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:update-standard-index-view-names',
        description: 'Update standard index view names to use translatable template placeholders'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(1, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService
    ])
], UpdateStandardIndexViewNamesCommand);

//# sourceMappingURL=1-20-update-standard-index-view-names.command.js.map