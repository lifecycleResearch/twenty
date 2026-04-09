"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ActiveOrSuspendedWorkspacesMigrationCommandRunner", {
    enumerable: true,
    get: function() {
        return ActiveOrSuspendedWorkspacesMigrationCommandRunner;
    }
});
const _workspace = require("twenty-shared/workspace");
const _workspacesmigrationcommandrunner = require("./workspaces-migration.command-runner");
let ActiveOrSuspendedWorkspacesMigrationCommandRunner = class ActiveOrSuspendedWorkspacesMigrationCommandRunner extends _workspacesmigrationcommandrunner.WorkspacesMigrationCommandRunner {
    constructor(workspaceRepository, globalWorkspaceOrmManager, dataSourceService){
        super(workspaceRepository, globalWorkspaceOrmManager, dataSourceService, [
            _workspace.WorkspaceActivationStatus.ACTIVE,
            _workspace.WorkspaceActivationStatus.SUSPENDED
        ]), this.workspaceRepository = workspaceRepository, this.globalWorkspaceOrmManager = globalWorkspaceOrmManager, this.dataSourceService = dataSourceService;
    }
};

//# sourceMappingURL=active-or-suspended-workspaces-migration.command-runner.js.map