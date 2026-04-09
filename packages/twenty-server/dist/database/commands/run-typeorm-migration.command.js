"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RunTypeormMigrationCommand", {
    enumerable: true,
    get: function() {
        return RunTypeormMigrationCommand;
    }
});
const _common = require("@nestjs/common");
const _chalk = /*#__PURE__*/ _interop_require_default(require("chalk"));
const _nestcommander = require("nest-commander");
const _coremigrationrunnerservice = require("./core-migration-runner/services/core-migration-runner.service");
const _coreengineversionservice = require("../../engine/core-engine-version/services/core-engine-version.service");
const _workspaceversionservice = require("../../engine/workspace-manager/workspace-version/services/workspace-version.service");
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
let RunTypeormMigrationCommand = class RunTypeormMigrationCommand extends _nestcommander.CommandRunner {
    parseForce() {
        return true;
    }
    async run(_passedParams, options) {
        if (options.force) {
            this.logger.warn(_chalk.default.yellow('Skipping workspace version check (--force flag used)'));
        } else {
            const previousVersion = this.coreEngineVersionService.getPreviousVersion();
            const workspacesBelow = await this.workspaceVersionService.getWorkspacesBelowVersion(previousVersion.version);
            if (workspacesBelow.length > 0) {
                for (const workspace of workspacesBelow){
                    this.logger.error(_chalk.default.red(`Workspace ${workspace.id} (${workspace.displayName}) is at version ${workspace.version ?? 'undefined'}, which is below the minimum required version.`));
                }
                throw new Error('Unable to run TypeORM migrations. Some workspace(s) are below the minimum required version.\n' + 'Please ensure all workspaces are on at least the previous minor version before running migrations.\n' + 'Use --force to bypass this check (not recommended).');
            }
        }
        await this.coreMigrationRunnerService.run();
    }
    constructor(coreEngineVersionService, workspaceVersionService, coreMigrationRunnerService){
        super(), this.coreEngineVersionService = coreEngineVersionService, this.workspaceVersionService = workspaceVersionService, this.coreMigrationRunnerService = coreMigrationRunnerService, this.logger = new _common.Logger(RunTypeormMigrationCommand.name);
    }
};
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '-f, --force',
        description: 'Skip workspace version safety check',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Boolean)
], RunTypeormMigrationCommand.prototype, "parseForce", null);
RunTypeormMigrationCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'run-typeorm-migration',
        description: 'Run TypeORM core migrations with workspace version safety check'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _coreengineversionservice.CoreEngineVersionService === "undefined" ? Object : _coreengineversionservice.CoreEngineVersionService,
        typeof _workspaceversionservice.WorkspaceVersionService === "undefined" ? Object : _workspaceversionservice.WorkspaceVersionService,
        typeof _coremigrationrunnerservice.CoreMigrationRunnerService === "undefined" ? Object : _coremigrationrunnerservice.CoreMigrationRunnerService
    ])
], RunTypeormMigrationCommand);

//# sourceMappingURL=run-typeorm-migration.command.js.map