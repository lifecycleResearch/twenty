"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingMessageCleanerRemoveOrphansCommand", {
    enumerable: true,
    get: function() {
        return MessagingMessageCleanerRemoveOrphansCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../../../database/commands/command-runners/active-or-suspended-workspaces-migration.command-runner");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _messagingmessagecleanerservice = require("../services/messaging-message-cleaner.service");
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
let MessagingMessageCleanerRemoveOrphansCommand = class MessagingMessageCleanerRemoveOrphansCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId }) {
        try {
            await this.messagingMessageCleanerService.cleanOrphanMessagesAndThreads(workspaceId);
        } catch (error) {
            this.logger.error('Error while deleting workflowRun', error);
        }
    }
    constructor(workspaceRepository, globalWorkspaceOrmManager, messagingMessageCleanerService, dataSourceService){
        super(workspaceRepository, globalWorkspaceOrmManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.globalWorkspaceOrmManager = globalWorkspaceOrmManager, this.messagingMessageCleanerService = messagingMessageCleanerService, this.dataSourceService = dataSourceService;
    }
};
MessagingMessageCleanerRemoveOrphansCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'messaging:message-cleaner-remove-orphans',
        description: 'Remove orphan message and threads from messaging'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagingmessagecleanerservice.MessagingMessageCleanerService === "undefined" ? Object : _messagingmessagecleanerservice.MessagingMessageCleanerService,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService
    ])
], MessagingMessageCleanerRemoveOrphansCommand);

//# sourceMappingURL=messaging-message-clearner-remove-orphans.command.js.map