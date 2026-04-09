"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpgradeCommandRunner", {
    enumerable: true,
    get: function() {
        return UpgradeCommandRunner;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _chalk = /*#__PURE__*/ _interop_require_default(require("chalk"));
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("./active-or-suspended-workspaces-migration.command-runner");
const _coremigrationrunnerservice = require("../core-migration-runner/services/core-migration-runner.service");
const _coreengineversionservice = require("../../../engine/core-engine-version/services/core-engine-version.service");
const _twentyconfigservice = require("../../../engine/core-modules/twenty-config/twenty-config.service");
const _workspaceentity = require("../../../engine/core-modules/workspace/workspace.entity");
const _globalworkspaceormmanager = require("../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _workspaceversionservice = require("../../../engine/workspace-manager/workspace-version/services/workspace-version.service");
const _compareversionminorandmajor = require("../../../utils/version/compare-version-minor-and-major");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let UpgradeCommandRunner = class UpgradeCommandRunner extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    setUpgradeContextVersionsAndCommandsForCurrentAppVersion() {
        const upgradeContextIsAlreadyDefined = [
            this.currentAppVersion,
            this.commands,
            this.fromWorkspaceVersion
        ].every(_utils.isDefined);
        if (upgradeContextIsAlreadyDefined) {
            return;
        }
        const currentAppVersion = this.coreEngineVersionService.getCurrentVersion();
        const currentVersionMajorMinor = `${currentAppVersion.major}.${currentAppVersion.minor}.0`;
        const currentCommands = this.allCommands[currentVersionMajorMinor];
        if (!(0, _utils.isDefined)(currentCommands)) {
            throw new Error(`No command found for version ${currentAppVersion}. Please check the commands record.`);
        }
        const previousVersion = this.coreEngineVersionService.getPreviousVersion();
        this.commands = currentCommands;
        this.fromWorkspaceVersion = previousVersion;
        this.currentAppVersion = currentAppVersion;
        const message = [
            'Initialized upgrade context with:',
            `- currentVersion (migrating to): ${currentAppVersion}`,
            `- fromWorkspaceVersion: ${previousVersion}`,
            `- ${this.commands.length} commands`
        ];
        this.logger.log(_chalk.default.blue(message.join('\n   ')));
    }
    async runMigrationCommand(passedParams, options) {
        try {
            this.setUpgradeContextVersionsAndCommandsForCurrentAppVersion();
            // On fresh installs there are no workspaces yet, so skip the
            // per-workspace upgrade loop (core migrations already ran above).
            const hasWorkspaces = await this.workspaceVersionService.hasActiveOrSuspendedWorkspaces();
            if (!hasWorkspaces) {
                this.logger.log(_chalk.default.blue('Fresh installation detected, skipping migration'));
                return;
            }
            const workspacesThatAreBelowFromWorkspaceVersion = await this.workspaceVersionService.getWorkspacesBelowVersion(this.fromWorkspaceVersion.version);
            if (workspacesThatAreBelowFromWorkspaceVersion.length > 0) {
                this.migrationReport.fail.push(...workspacesThatAreBelowFromWorkspaceVersion.map((workspace)=>({
                        error: new Error(`Unable to run the upgrade command. Aborting the upgrade process.
Please ensure that all workspaces are on at least the previous minor version (${this.fromWorkspaceVersion.version}).
If any workspaces are not on the previous minor version, roll back to that version and run the upgrade command again.`),
                        workspaceId: workspace.id
                    })));
            }
        } catch (error) {
            this.migrationReport.fail.push({
                error,
                workspaceId: 'global'
            });
        }
        if (this.migrationReport.fail.length > 0) {
            this.migrationReport.fail.forEach(({ error, workspaceId })=>this.logger.error(`Error in workspace ${workspaceId}: ${error.message}`));
            return;
        }
        await this.coreMigrationRunnerService.run();
        await super.runMigrationCommand(passedParams, options);
    }
    async runOnWorkspace(args) {
        this.setUpgradeContextVersionsAndCommandsForCurrentAppVersion();
        const { workspaceId, index, total, options } = args;
        this.logger.log(_chalk.default.blue(`${options.dryRun ? '(dry run) ' : ''}Upgrading workspace ${workspaceId} from=${this.fromWorkspaceVersion} to=${this.currentAppVersion} ${index + 1}/${total}`));
        const workspaceVersionCompareResult = await this.retrieveWorkspaceVersionAndCompareToWorkspaceFromVersion(workspaceId);
        switch(workspaceVersionCompareResult){
            case 'lower':
                {
                    throw new Error(`WORKSPACE_VERSION_MISSMATCH Upgrade for workspace ${workspaceId} failed as its version is beneath fromWorkspaceVersion=${this.fromWorkspaceVersion.version}`);
                }
            case 'equal':
                {
                    for (const command of this.commands){
                        await command.runOnWorkspace(args);
                    }
                    if (!options.dryRun) {
                        await this.workspaceRepository.update({
                            id: workspaceId
                        }, {
                            version: this.currentAppVersion.version
                        });
                    }
                    this.logger.log(_chalk.default.blue(`Upgrade for workspace ${workspaceId} completed.`));
                    return;
                }
            case 'higher':
                {
                    this.logger.log(_chalk.default.blue(`Upgrade for workspace ${workspaceId} ignored as is already at a higher version.`));
                    return;
                }
            default:
                {
                    throw new Error(`Should never occur, encountered unexpected value from retrieveWorkspaceVersionAndCompareToWorkspaceFromVersion ${workspaceVersionCompareResult}`);
                }
        }
    }
    async retrieveWorkspaceVersionAndCompareToWorkspaceFromVersion(workspaceId) {
        const workspace = await this.workspaceRepository.findOneByOrFail({
            id: workspaceId
        });
        const currentWorkspaceVersion = workspace.version;
        if (!(0, _utils.isDefined)(currentWorkspaceVersion)) {
            throw new Error(`WORKSPACE_VERSION_NOT_DEFINED workspace=${workspaceId}`);
        }
        return (0, _compareversionminorandmajor.compareVersionMajorAndMinor)(currentWorkspaceVersion, this.fromWorkspaceVersion.version);
    }
    constructor(workspaceRepository, twentyConfigService, globalWorkspaceOrmManager, dataSourceService, coreEngineVersionService, workspaceVersionService, coreMigrationRunnerService){
        super(workspaceRepository, globalWorkspaceOrmManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyConfigService = twentyConfigService, this.globalWorkspaceOrmManager = globalWorkspaceOrmManager, this.dataSourceService = dataSourceService, this.coreEngineVersionService = coreEngineVersionService, this.workspaceVersionService = workspaceVersionService, this.coreMigrationRunnerService = coreMigrationRunnerService;
    }
};
UpgradeCommandRunner = _ts_decorate([
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof DataSourceService === "undefined" ? Object : DataSourceService,
        typeof _coreengineversionservice.CoreEngineVersionService === "undefined" ? Object : _coreengineversionservice.CoreEngineVersionService,
        typeof _workspaceversionservice.WorkspaceVersionService === "undefined" ? Object : _workspaceversionservice.WorkspaceVersionService,
        typeof _coremigrationrunnerservice.CoreMigrationRunnerService === "undefined" ? Object : _coremigrationrunnerservice.CoreMigrationRunnerService
    ])
], UpgradeCommandRunner);

//# sourceMappingURL=upgrade.command-runner.js.map