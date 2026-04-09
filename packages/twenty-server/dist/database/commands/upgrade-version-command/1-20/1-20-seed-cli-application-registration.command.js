"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SeedCliApplicationRegistrationCommand", {
    enumerable: true,
    get: function() {
        return SeedCliApplicationRegistrationCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _applicationregistrationservice = require("../../../../engine/core-modules/application/application-registration/application-registration.service");
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
let SeedCliApplicationRegistrationCommand = class SeedCliApplicationRegistrationCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId: _, options }) {
        const dryRun = options.dryRun ?? false;
        if (this.hasRun) {
            return;
        }
        if (dryRun) {
            this.logger.log('[DRY RUN] Skipping CLI application registration seeding');
            return;
        }
        const result = await this.applicationRegistrationService.createCliRegistrationIfNotExists();
        this.hasRun = true;
        if (result) {
            this.logger.log(`CLI application registration created (clientId: ${result.oAuthClientId})`);
        } else {
            this.logger.log('CLI application registration already exists, skipping');
        }
    }
    constructor(workspaceRepository, twentyORMGlobalManager, dataSourceService, applicationRegistrationService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.applicationRegistrationService = applicationRegistrationService, this.hasRun = false;
    }
};
SeedCliApplicationRegistrationCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:seed-cli-application-registration',
        description: 'Seed the Twenty CLI application registration for OAuth-based CLI login'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService
    ])
], SeedCliApplicationRegistrationCommand);

//# sourceMappingURL=1-20-seed-cli-application-registration.command.js.map