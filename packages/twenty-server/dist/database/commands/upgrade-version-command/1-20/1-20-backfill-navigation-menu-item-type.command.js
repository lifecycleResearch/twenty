"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillNavigationMenuItemTypeCommand", {
    enumerable: true,
    get: function() {
        return BackfillNavigationMenuItemTypeCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _1773681736596makeNavigationMenuItemTypeNotNullutil = require("../../../typeorm/core/migrations/utils/1773681736596-makeNavigationMenuItemTypeNotNull.util");
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
let BackfillNavigationMenuItemTypeCommand = class BackfillNavigationMenuItemTypeCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ options }) {
        if (this.hasRunOnce) {
            this.logger.warn('Skipping has already been run once BackfillNavigationMenuItemTypeCommand');
            return;
        }
        if (options.dryRun) {
            return;
        }
        const queryRunner = this.coreDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.backfillType(queryRunner);
            await this.cleanConflictingColumns(queryRunner);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Rolling back BackfillNavigationMenuItemTypeCommand data backfill: ${error.message}`);
            await queryRunner.release();
            return;
        }
        await queryRunner.startTransaction();
        try {
            await (0, _1773681736596makeNavigationMenuItemTypeNotNullutil.makeNavigationMenuItemTypeNotNullQueries)(queryRunner);
            await queryRunner.commitTransaction();
            this.logger.log('Successfully run BackfillNavigationMenuItemTypeCommand');
            this.hasRunOnce = true;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Rolling back BackfillNavigationMenuItemTypeCommand schema changes: ${error.message}`);
        } finally{
            await queryRunner.release();
        }
    }
    async backfillType(queryRunner) {
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "type" = 'OBJECT' WHERE "type" = 'VIEW' AND "targetObjectMetadataId" IS NOT NULL AND "targetRecordId" IS NULL`);
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "type" = 'RECORD' WHERE "type" IS NULL AND "targetRecordId" IS NOT NULL AND "targetObjectMetadataId" IS NOT NULL`);
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "type" = 'OBJECT' WHERE "type" IS NULL AND "targetObjectMetadataId" IS NOT NULL AND "targetRecordId" IS NULL`);
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "type" = 'VIEW' WHERE "type" IS NULL AND "viewId" IS NOT NULL`);
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "type" = 'LINK' WHERE "type" IS NULL AND "link" IS NOT NULL`);
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "type" = 'FOLDER' WHERE "type" IS NULL`);
    }
    async cleanConflictingColumns(queryRunner) {
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "targetRecordId" = NULL, "targetObjectMetadataId" = NULL, "link" = NULL WHERE "type" = 'VIEW'`);
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "viewId" = NULL, "link" = NULL WHERE "type" = 'RECORD'`);
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "viewId" = NULL, "targetRecordId" = NULL, "link" = NULL WHERE "type" = 'OBJECT'`);
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "viewId" = NULL, "targetRecordId" = NULL, "targetObjectMetadataId" = NULL WHERE "type" = 'LINK'`);
        await queryRunner.query(`UPDATE "core"."navigationMenuItem" SET "viewId" = NULL, "targetRecordId" = NULL, "targetObjectMetadataId" = NULL, "link" = NULL WHERE "type" = 'FOLDER'`);
    }
    constructor(workspaceRepository, twentyORMGlobalManager, dataSourceService, coreDataSource){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.coreDataSource = coreDataSource, this.hasRunOnce = false;
    }
};
BackfillNavigationMenuItemTypeCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:backfill-navigation-menu-item-type',
        description: 'Backfill navigation menu item type based on existing columns, then apply NOT NULL and CHECK constraints'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(3, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], BackfillNavigationMenuItemTypeCommand);

//# sourceMappingURL=1-20-backfill-navigation-menu-item-type.command.js.map