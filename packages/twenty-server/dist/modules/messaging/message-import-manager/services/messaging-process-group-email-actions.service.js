"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingProcessGroupEmailActionsService", {
    enumerable: true,
    get: function() {
        return MessagingProcessGroupEmailActionsService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _messagechanneldataaccessservice = require("../../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _messagefolderdataaccessservice = require("../../../../engine/metadata-modules/message-folder/data-access/services/message-folder-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagechannelworkspaceentity = require("../../common/standard-objects/message-channel.workspace-entity");
const _messagingdeletegroupemailmessagesservice = require("./messaging-delete-group-email-messages.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessagingProcessGroupEmailActionsService = class MessagingProcessGroupEmailActionsService {
    async markMessageChannelAsPendingGroupEmailsAction(messageChannel, workspaceId, pendingGroupEmailsAction) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: messageChannel.id
            }, {
                pendingGroupEmailsAction
            });
        }, authContext);
        this.logger.debug(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id} - Marked message channel as pending group emails action: ${pendingGroupEmailsAction}`);
    }
    async processGroupEmailActions(messageChannel, workspaceId) {
        const { pendingGroupEmailsAction } = messageChannel;
        if (!(0, _utils.isDefined)(pendingGroupEmailsAction) || pendingGroupEmailsAction === _messagechannelworkspaceentity.MessageChannelPendingGroupEmailsAction.NONE) {
            return;
        }
        this.logger.debug(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id} - Processing group email action: ${pendingGroupEmailsAction}`);
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceDataSource = await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();
            await workspaceDataSource?.transaction(async (transactionManager)=>{
                try {
                    switch(pendingGroupEmailsAction){
                        case _messagechannelworkspaceentity.MessageChannelPendingGroupEmailsAction.GROUP_EMAILS_DELETION:
                            await this.handleGroupEmailsDeletion(workspaceId, messageChannel.id, transactionManager);
                            break;
                        case _messagechannelworkspaceentity.MessageChannelPendingGroupEmailsAction.GROUP_EMAILS_IMPORT:
                            await this.handleGroupEmailsImport(workspaceId, messageChannel.id, transactionManager);
                            break;
                    }
                    await this.messageChannelDataAccessService.update(workspaceId, {
                        id: messageChannel.id
                    }, {
                        pendingGroupEmailsAction: _messagechannelworkspaceentity.MessageChannelPendingGroupEmailsAction.NONE
                    }, transactionManager);
                    this.logger.debug(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id} - Reset pendingGroupEmailsAction to NONE`);
                } catch (error) {
                    this.logger.error(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannel.id} - Error processing group email action: ${error.message}`, error.stack);
                    throw error;
                }
            });
        }, authContext);
    }
    async handleGroupEmailsDeletion(workspaceId, messageChannelId, transactionManager) {
        await this.messagingDeleteGroupEmailMessagesService.deleteGroupEmailMessages(workspaceId, messageChannelId);
        await this.resetCursors({
            workspaceId,
            messageChannelId,
            transactionManager
        });
        this.logger.debug(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannelId} - Completed GROUP_EMAILS_DELETION action`);
    }
    async handleGroupEmailsImport(workspaceId, messageChannelId, transactionManager) {
        await this.resetCursors({
            workspaceId,
            messageChannelId,
            transactionManager
        });
        this.logger.debug(`WorkspaceId: ${workspaceId}, MessageChannelId: ${messageChannelId} - Completed GROUP_EMAILS_IMPORT action`);
    }
    async resetCursors({ workspaceId, messageChannelId, transactionManager }) {
        await this.messageChannelDataAccessService.update(workspaceId, {
            id: messageChannelId
        }, {
            syncCursor: ''
        }, transactionManager);
        await this.messageFolderDataAccessService.update(workspaceId, {
            messageChannelId
        }, {
            syncCursor: ''
        }, transactionManager);
    }
    constructor(globalWorkspaceOrmManager, messageChannelDataAccessService, messageFolderDataAccessService, messagingDeleteGroupEmailMessagesService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
        this.messageFolderDataAccessService = messageFolderDataAccessService;
        this.messagingDeleteGroupEmailMessagesService = messagingDeleteGroupEmailMessagesService;
        this.logger = new _common.Logger(MessagingProcessGroupEmailActionsService.name);
    }
};
MessagingProcessGroupEmailActionsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService,
        typeof _messagefolderdataaccessservice.MessageFolderDataAccessService === "undefined" ? Object : _messagefolderdataaccessservice.MessageFolderDataAccessService,
        typeof _messagingdeletegroupemailmessagesservice.MessagingDeleteGroupEmailMessagesService === "undefined" ? Object : _messagingdeletegroupemailmessagesservice.MessagingDeleteGroupEmailMessagesService
    ])
], MessagingProcessGroupEmailActionsService);

//# sourceMappingURL=messaging-process-group-email-actions.service.js.map