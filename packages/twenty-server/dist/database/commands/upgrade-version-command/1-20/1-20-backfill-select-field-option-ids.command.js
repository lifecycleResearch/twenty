"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillSelectFieldOptionIdsCommand", {
    enumerable: true,
    get: function() {
        return BackfillSelectFieldOptionIdsCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
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
let BackfillSelectFieldOptionIdsCommand = class BackfillSelectFieldOptionIdsCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const dryRun = options?.dryRun ?? false;
        const selectFields = await this.coreDataSource.query(`SELECT "id", "options"
         FROM core."fieldMetadata"
         WHERE "workspaceId" = $1
           AND "type" IN ('SELECT', 'MULTI_SELECT')
           AND "options" IS NOT NULL`, [
            workspaceId
        ]);
        const fieldsToUpdate = selectFields.filter((field)=>field.options.some((option)=>!(0, _utils.isDefined)(option.id)));
        if (fieldsToUpdate.length === 0) {
            this.logger.log(`No SELECT/MULTI_SELECT options missing ids in workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${dryRun ? '[DRY RUN] ' : ''}Found ${fieldsToUpdate.length} field(s) with options missing ids in workspace ${workspaceId}`);
        if (dryRun) {
            return;
        }
        const queryRunner = this.coreDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const field of fieldsToUpdate){
                const patchedOptions = field.options.map((option)=>({
                        ...option,
                        id: (0, _utils.isDefined)(option.id) ? option.id : (0, _uuid.v4)()
                    }));
                await queryRunner.query(`UPDATE core."fieldMetadata"
           SET "options" = $1::jsonb
           WHERE "id" = $2`, [
                    JSON.stringify(patchedOptions),
                    field.id
                ]);
            }
            await queryRunner.commitTransaction();
            this.logger.log(`Backfilled option ids for ${fieldsToUpdate.length} field(s) in workspace ${workspaceId}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally{
            await queryRunner.release();
        }
    }
    constructor(workspaceRepository, coreDataSource, twentyORMGlobalManager, dataSourceService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.coreDataSource = coreDataSource, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService;
    }
};
BackfillSelectFieldOptionIdsCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:backfill-select-field-option-ids',
        description: 'Backfill missing ids on SELECT and MULTI_SELECT field metadata options'
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
], BackfillSelectFieldOptionIdsCommand);

//# sourceMappingURL=1-20-backfill-select-field-option-ids.command.js.map