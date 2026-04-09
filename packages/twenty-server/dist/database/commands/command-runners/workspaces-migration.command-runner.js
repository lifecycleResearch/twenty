"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspacesMigrationCommandRunner", {
    enumerable: true,
    get: function() {
        return WorkspacesMigrationCommandRunner;
    }
});
const _chalk = /*#__PURE__*/ _interop_require_default(require("chalk"));
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _migrationcommandrunner = require("./migration.command-runner");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkspacesMigrationCommandRunner = class WorkspacesMigrationCommandRunner extends _migrationcommandrunner.MigrationCommandRunner {
    parseStartFromWorkspaceId(val) {
        this.startFromWorkspaceId = val;
        return val;
    }
    parseWorkspaceCountLimit(val) {
        this.workspaceCountLimit = parseInt(val);
        if (isNaN(this.workspaceCountLimit)) {
            throw new Error('Workspace count limit must be a number');
        }
        if (this.workspaceCountLimit <= 0) {
            throw new Error('Workspace count limit must be greater than 0');
        }
        return this.workspaceCountLimit;
    }
    parseWorkspaceId(val) {
        this.workspaceIds.add(val);
        return this.workspaceIds;
    }
    async fetchWorkspaceIds() {
        const workspaces = await this.workspaceRepository.find({
            select: [
                'id'
            ],
            where: {
                activationStatus: (0, _typeorm.In)(this.activationStatuses),
                ...this.startFromWorkspaceId ? {
                    id: (0, _typeorm.MoreThanOrEqual)(this.startFromWorkspaceId)
                } : {}
            },
            order: {
                id: 'ASC'
            },
            take: this.workspaceCountLimit
        });
        return workspaces.map((workspace)=>workspace.id);
    }
    async runMigrationCommand(_passedParams, options) {
        const workspaceIdsToProcess = this.workspaceIds.size > 0 ? Array.from(this.workspaceIds) : await this.fetchWorkspaceIds();
        if (options.dryRun) {
            this.logger.log(_chalk.default.yellow('Dry run mode: No changes will be applied'));
        }
        for (const [index, workspaceId] of workspaceIdsToProcess.entries()){
            this.logger.log(`Upgrading workspace ${workspaceId} ${index + 1}/${workspaceIdsToProcess.length}`);
            try {
                const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
                await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
                    const workspaceHasDataSource = await this.dataSourceService.getLastDataSourceMetadataFromWorkspaceId(workspaceId);
                    const dataSource = (0, _utils.isDefined)(workspaceHasDataSource) ? await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource() : undefined;
                    await this.runOnWorkspace({
                        options,
                        workspaceId,
                        dataSource,
                        index: index,
                        total: workspaceIdsToProcess.length
                    });
                }, authContext);
                this.migrationReport.success.push({
                    workspaceId
                });
            } catch (error) {
                this.migrationReport.fail.push({
                    error,
                    workspaceId
                });
                this.logger.warn(_chalk.default.red(`Error in workspace ${workspaceId}: ${error.message}`));
            }
        }
        this.migrationReport.fail.forEach(({ error, workspaceId })=>this.logger.error(`Error in workspace ${workspaceId}: ${error.message}`, error.stack));
    }
    constructor(workspaceRepository, globalWorkspaceOrmManager, dataSourceService, activationStatuses){
        super(), this.workspaceRepository = workspaceRepository, this.globalWorkspaceOrmManager = globalWorkspaceOrmManager, this.dataSourceService = dataSourceService, this.activationStatuses = activationStatuses, this.workspaceIds = new Set(), this.migrationReport = {
            fail: [],
            success: []
        };
    }
};
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--start-from-workspace-id [workspace_id]',
        description: 'Start from a specific workspace id. Workspaces are processed in ascending order of id.',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", String)
], WorkspacesMigrationCommandRunner.prototype, "parseStartFromWorkspaceId", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--workspace-count-limit [count]',
        description: 'Limit the number of workspaces to process. Workspaces are processed in ascending order of id.',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Number)
], WorkspacesMigrationCommandRunner.prototype, "parseWorkspaceCountLimit", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-w, --workspace-id [workspace_id]',
        description: 'workspace id. Command runs on all workspaces matching the activation statuses if not provided.',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", typeof Set === "undefined" ? Object : Set)
], WorkspacesMigrationCommandRunner.prototype, "parseWorkspaceId", null);

//# sourceMappingURL=workspaces-migration.command-runner.js.map