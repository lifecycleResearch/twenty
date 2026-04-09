"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingMessagesImportJob", {
    enumerable: true,
    get: function() {
        return MessagingMessagesImportJob;
    }
});
const _common = require("@nestjs/common");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagechanneldataaccessservice = require("../../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _isthrottled = require("../../../connected-account/utils/is-throttled");
const _messagechannelsyncstatusservice = require("../../common/services/message-channel-sync-status.service");
const _messagechannelworkspaceentity = require("../../common/standard-objects/message-channel.workspace-entity");
const _messagingmessagesimportservice = require("../services/messaging-messages-import.service");
const _messagingmonitoringservice = require("../../monitoring/services/messaging-monitoring.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const toIsoStringOrNull = (value)=>{
    if (value == null) {
        return null;
    }
    return value instanceof Date ? value.toISOString() : value;
};
let MessagingMessagesImportJob = class MessagingMessagesImportJob {
    async handle(data) {
        const { messageChannelId, workspaceId } = data;
        await this.messagingMonitoringService.track({
            eventName: 'messages_import.triggered',
            workspaceId,
            messageChannelId
        });
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageChannel = await this.messageChannelDataAccessService.findOne(workspaceId, {
                where: {
                    id: messageChannelId
                },
                relations: [
                    'connectedAccount',
                    'messageFolders'
                ]
            });
            if (!messageChannel) {
                await this.messagingMonitoringService.track({
                    eventName: 'messages_import.error.message_channel_not_found',
                    messageChannelId,
                    workspaceId
                });
                return;
            }
            if (!messageChannel?.isSyncEnabled) {
                return;
            }
            if (messageChannel.syncStage !== _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGES_IMPORT_SCHEDULED) {
                return;
            }
            if ((0, _isthrottled.isThrottled)(toIsoStringOrNull(messageChannel.syncStageStartedAt), messageChannel.throttleFailureCount, toIsoStringOrNull(messageChannel.throttleRetryAfter))) {
                await this.messageChannelSyncStatusService.markAsMessagesImportPending([
                    messageChannel.id
                ], workspaceId, true);
                return;
            }
            const messageChannelWorkspace = messageChannel;
            await this.messagingMessagesImportService.processMessageBatchImport(messageChannelWorkspace, messageChannelWorkspace.connectedAccount, workspaceId);
        }, authContext);
    }
    constructor(messagingMessagesImportService, messagingMonitoringService, messageChannelSyncStatusService, globalWorkspaceOrmManager, messageChannelDataAccessService){
        this.messagingMessagesImportService = messagingMessagesImportService;
        this.messagingMonitoringService = messagingMonitoringService;
        this.messageChannelSyncStatusService = messageChannelSyncStatusService;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(MessagingMessagesImportJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof MessagingMessagesImportJobData === "undefined" ? Object : MessagingMessagesImportJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], MessagingMessagesImportJob.prototype, "handle", null);
MessagingMessagesImportJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.messagingQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagingmessagesimportservice.MessagingMessagesImportService === "undefined" ? Object : _messagingmessagesimportservice.MessagingMessagesImportService,
        typeof _messagingmonitoringservice.MessagingMonitoringService === "undefined" ? Object : _messagingmonitoringservice.MessagingMonitoringService,
        typeof _messagechannelsyncstatusservice.MessageChannelSyncStatusService === "undefined" ? Object : _messagechannelsyncstatusservice.MessageChannelSyncStatusService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService
    ])
], MessagingMessagesImportJob);

//# sourceMappingURL=messaging-messages-import.job.js.map