"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BlocklistReimportMessagesJob", {
    enumerable: true,
    get: function() {
        return BlocklistReimportMessagesJob;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagechanneldataaccessservice = require("../../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagechannelsyncstatusservice = require("../../common/services/message-channel-sync-status.service");
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
let BlocklistReimportMessagesJob = class BlocklistReimportMessagesJob {
    async handle(data) {
        const workspaceId = data.workspaceId;
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            for (const eventPayload of data.events){
                const workspaceMemberId = eventPayload.properties.before.workspaceMemberId;
                const messageChannels = await this.messageChannelDataAccessService.find(workspaceId, {
                    connectedAccount: {
                        accountOwnerId: workspaceMemberId
                    },
                    syncStage: (0, _typeorm.Not)(_messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING)
                });
                await this.messagingChannelSyncStatusService.resetAndMarkAsMessagesListFetchPending(messageChannels.map((messageChannel)=>messageChannel.id), workspaceId);
            }
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, messageChannelDataAccessService, messagingChannelSyncStatusService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
        this.messagingChannelSyncStatusService = messagingChannelSyncStatusService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(BlocklistReimportMessagesJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof BlocklistReimportMessagesJobData === "undefined" ? Object : BlocklistReimportMessagesJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], BlocklistReimportMessagesJob.prototype, "handle", null);
BlocklistReimportMessagesJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.messagingQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService,
        typeof _messagechannelsyncstatusservice.MessageChannelSyncStatusService === "undefined" ? Object : _messagechannelsyncstatusservice.MessageChannelSyncStatusService
    ])
], BlocklistReimportMessagesJob);

//# sourceMappingURL=messaging-blocklist-reimport-messages.job.js.map