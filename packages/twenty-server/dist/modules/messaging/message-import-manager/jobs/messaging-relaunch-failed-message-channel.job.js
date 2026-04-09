"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingRelaunchFailedMessageChannelJob", {
    enumerable: true,
    get: function() {
        return MessagingRelaunchFailedMessageChannelJob;
    }
});
const _common = require("@nestjs/common");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagechanneldataaccessservice = require("../../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagechannelworkspaceentity = require("../../common/standard-objects/message-channel.workspace-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessagingRelaunchFailedMessageChannelJob = class MessagingRelaunchFailedMessageChannelJob {
    async handle(data) {
        const { workspaceId, messageChannelId } = data;
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageChannel = await this.messageChannelDataAccessService.findOne(workspaceId, {
                where: {
                    id: messageChannelId
                }
            });
            if (!messageChannel || messageChannel.syncStage !== _messagechannelworkspaceentity.MessageChannelSyncStage.FAILED || messageChannel.syncStatus !== _messagechannelworkspaceentity.MessageChannelSyncStatus.FAILED_UNKNOWN) {
                return;
            }
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: messageChannelId
            }, {
                syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
                syncStatus: _messagechannelworkspaceentity.MessageChannelSyncStatus.ACTIVE,
                throttleFailureCount: 0,
                throttleRetryAfter: null,
                syncStageStartedAt: null
            });
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, messageChannelDataAccessService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(MessagingRelaunchFailedMessageChannelJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof MessagingRelaunchFailedMessageChannelJobData === "undefined" ? Object : MessagingRelaunchFailedMessageChannelJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], MessagingRelaunchFailedMessageChannelJob.prototype, "handle", null);
MessagingRelaunchFailedMessageChannelJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.messagingQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService
    ])
], MessagingRelaunchFailedMessageChannelJob);

//# sourceMappingURL=messaging-relaunch-failed-message-channel.job.js.map