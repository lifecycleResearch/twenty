"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingMessageListFetchJob", {
    enumerable: true,
    get: function() {
        return MessagingMessageListFetchJob;
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
const _messagingimportexceptionhandlerservice = require("../services/messaging-import-exception-handler.service");
const _messagingmessagelistfetchservice = require("../services/messaging-message-list-fetch.service");
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
let MessagingMessageListFetchJob = class MessagingMessageListFetchJob {
    async handle(data) {
        const { messageChannelId, workspaceId } = data;
        await this.messagingMonitoringService.track({
            eventName: 'message_list_fetch_job.triggered',
            messageChannelId,
            workspaceId
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
                    eventName: 'message_list_fetch_job.error.message_channel_not_found',
                    messageChannelId,
                    workspaceId
                });
                return;
            }
            if (messageChannel.syncStage !== _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_SCHEDULED) {
                return;
            }
            try {
                if ((0, _isthrottled.isThrottled)(toIsoStringOrNull(messageChannel.syncStageStartedAt), messageChannel.throttleFailureCount, toIsoStringOrNull(messageChannel.throttleRetryAfter))) {
                    await this.messageChannelSyncStatusService.markAsMessagesListFetchPending([
                        messageChannel.id
                    ], workspaceId, true);
                    return;
                }
                await this.messagingMonitoringService.track({
                    eventName: 'message_list_fetch.started',
                    workspaceId,
                    connectedAccountId: messageChannel.connectedAccount.id,
                    messageChannelId: messageChannel.id
                });
                await this.messagingMessageListFetchService.processMessageListFetch(messageChannel, workspaceId);
                await this.messagingMonitoringService.track({
                    eventName: 'message_list_fetch.completed',
                    workspaceId,
                    connectedAccountId: messageChannel.connectedAccount.id,
                    messageChannelId: messageChannel.id
                });
            } catch (error) {
                await this.messageImportErrorHandlerService.handleDriverException(error, _messagingimportexceptionhandlerservice.MessageImportSyncStep.MESSAGE_LIST_FETCH, messageChannel, workspaceId);
            }
        }, authContext);
    }
    constructor(messagingMessageListFetchService, messagingMonitoringService, globalWorkspaceOrmManager, messageChannelDataAccessService, messageImportErrorHandlerService, messageChannelSyncStatusService){
        this.messagingMessageListFetchService = messagingMessageListFetchService;
        this.messagingMonitoringService = messagingMonitoringService;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
        this.messageImportErrorHandlerService = messageImportErrorHandlerService;
        this.messageChannelSyncStatusService = messageChannelSyncStatusService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(MessagingMessageListFetchJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof MessagingMessageListFetchJobData === "undefined" ? Object : MessagingMessageListFetchJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], MessagingMessageListFetchJob.prototype, "handle", null);
MessagingMessageListFetchJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.messagingQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagingmessagelistfetchservice.MessagingMessageListFetchService === "undefined" ? Object : _messagingmessagelistfetchservice.MessagingMessageListFetchService,
        typeof _messagingmonitoringservice.MessagingMonitoringService === "undefined" ? Object : _messagingmonitoringservice.MessagingMonitoringService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService,
        typeof _messagingimportexceptionhandlerservice.MessageImportExceptionHandlerService === "undefined" ? Object : _messagingimportexceptionhandlerservice.MessageImportExceptionHandlerService,
        typeof _messagechannelsyncstatusservice.MessageChannelSyncStatusService === "undefined" ? Object : _messagechannelsyncstatusservice.MessageChannelSyncStatusService
    ])
], MessagingMessageListFetchJob);

//# sourceMappingURL=messaging-message-list-fetch.job.js.map