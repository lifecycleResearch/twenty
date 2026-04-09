"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IdentifyPermissionFlagMetadataCommand", {
    enumerable: true,
    get: function() {
        return IdentifyPermissionFlagMetadataCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _utils = require("twenty-shared/utils");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _permissionflagentity = require("../../../../engine/metadata-modules/permission-flag/permission-flag.entity");
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
let IdentifyPermissionFlagMetadataCommand = class IdentifyPermissionFlagMetadataCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ options }) {
        if (this.hasRunOnce) {
            this.logger.log('Skipping has already been run once IdentifyPermissionFlagMetadataCommand');
            return;
        }
        if (options.dryRun) {
            return;
        }
        const queryRunner = this.coreDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const repository = queryRunner.manager.getRepository(_permissionflagentity.PermissionFlagEntity);
            const withNullApplicationId = await repository.find({
                where: {
                    applicationId: (0, _typeorm1.IsNull)()
                },
                relations: [
                    'role'
                ]
            });
            const toUpdate = withNullApplicationId.filter((permissionFlag)=>(0, _utils.isDefined)(permissionFlag.role?.applicationId));
            const toRemove = withNullApplicationId.filter((permissionFlag)=>!(0, _utils.isDefined)(permissionFlag.role?.applicationId));
            for (const permissionFlag of toUpdate){
                const flag = permissionFlag;
                flag.applicationId = permissionFlag.role.applicationId;
                flag.universalIdentifier = flag.universalIdentifier ?? (0, _uuid.v4)();
            }
            if (toUpdate.length > 0) {
                await repository.save(toUpdate);
            }
            if (toRemove.length > 0) {
                await repository.remove(toRemove);
            }
            const withNullUniversalIdentifier = await repository.find({
                where: {
                    universalIdentifier: (0, _typeorm1.IsNull)()
                }
            });
            for (const permissionFlag of withNullUniversalIdentifier){
                permissionFlag.universalIdentifier = (0, _uuid.v4)();
            }
            if (withNullUniversalIdentifier.length > 0) {
                await repository.save(withNullUniversalIdentifier);
            }
            await queryRunner.commitTransaction();
            this.logger.log('Successfully run IdentifyPermissionFlagMetadataCommand');
            this.hasRunOnce = true;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Rolling back IdentifyPermissionFlagMetadataCommand: ${error.message}`);
            throw error;
        } finally{
            await queryRunner.release();
        }
    }
    constructor(workspaceRepository, twentyORMGlobalManager, dataSourceService, coreDataSource){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.coreDataSource = coreDataSource, this.hasRunOnce = false;
    }
};
IdentifyPermissionFlagMetadataCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:identify-permission-flag-metadata',
        description: 'Identify permission flag metadata (backfill universalIdentifier and applicationId)'
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
], IdentifyPermissionFlagMetadataCommand);

//# sourceMappingURL=1-20-identify-permission-flag-metadata.command.js.map