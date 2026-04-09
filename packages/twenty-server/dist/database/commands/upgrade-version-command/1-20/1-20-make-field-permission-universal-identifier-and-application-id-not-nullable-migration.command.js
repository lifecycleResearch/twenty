"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand", {
    enumerable: true,
    get: function() {
        return MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _1773400000000makefieldpermissionuniversalidentifierandapplicationidnotnullutil = require("../../../typeorm/core/migrations/utils/1773400000000-make-field-permission-universal-identifier-and-application-id-not-null.util");
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
let MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand = class MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ options }) {
        if (this.hasRunOnce) {
            this.logger.log('Skipping has already been run once MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand');
            return;
        }
        if (options.dryRun) {
            return;
        }
        const queryRunner = this.coreDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await (0, _1773400000000makefieldpermissionuniversalidentifierandapplicationidnotnullutil.makeFieldPermissionUniversalIdentifierAndApplicationIdNotNullQueries)(queryRunner);
            await queryRunner.commitTransaction();
            this.logger.log('Successfully run MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand');
            this.hasRunOnce = true;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Rolling back MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand: ${error.message}`);
            throw error;
        } finally{
            await queryRunner.release();
        }
    }
    constructor(workspaceRepository, twentyORMGlobalManager, dataSourceService, coreDataSource){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.coreDataSource = coreDataSource, this.hasRunOnce = false;
    }
};
MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:make-field-permission-universal-identifier-and-application-id-not-nullable-migration',
        description: 'Set NOT NULL on fieldPermission universalIdentifier and applicationId, add unique index and FK (run identify-field-permission-metadata first)'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(3, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand);

//# sourceMappingURL=1-20-make-field-permission-universal-identifier-and-application-id-not-nullable-migration.command.js.map