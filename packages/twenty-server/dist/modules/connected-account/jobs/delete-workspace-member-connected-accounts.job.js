"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeleteWorkspaceMemberConnectedAccountsCleanupJob", {
    enumerable: true,
    get: function() {
        return DeleteWorkspaceMemberConnectedAccountsCleanupJob;
    }
});
const _processdecorator = require("../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _connectedaccountdataaccessservice = require("../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DeleteWorkspaceMemberConnectedAccountsCleanupJob = class DeleteWorkspaceMemberConnectedAccountsCleanupJob {
    async handle(data) {
        const { workspaceId, workspaceMemberId } = data;
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.connectedAccountDataAccessService.delete(workspaceId, {
                accountOwnerId: workspaceMemberId
            });
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, connectedAccountDataAccessService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(DeleteWorkspaceMemberConnectedAccountsCleanupJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof DeleteWorkspaceMemberConnectedAccountsCleanupJobData === "undefined" ? Object : DeleteWorkspaceMemberConnectedAccountsCleanupJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], DeleteWorkspaceMemberConnectedAccountsCleanupJob.prototype, "handle", null);
DeleteWorkspaceMemberConnectedAccountsCleanupJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.deleteCascadeQueue),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService
    ])
], DeleteWorkspaceMemberConnectedAccountsCleanupJob);

//# sourceMappingURL=delete-workspace-member-connected-accounts.job.js.map