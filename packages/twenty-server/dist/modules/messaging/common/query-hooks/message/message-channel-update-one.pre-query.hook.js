"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageChannelUpdateOnePreQueryHook", {
    enumerable: true,
    get: function() {
        return MessageChannelUpdateOnePreQueryHook;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _workspacequeryhookdecorator = require("../../../../../engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator");
const _workspacequeryrunnerexception = require("../../../../../engine/api/graphql/workspace-query-runner/workspace-query-runner.exception");
const _workspaceexception = require("../../../../../engine/core-modules/workspace/workspace.exception");
const _messagechanneldataaccessservice = require("../../../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _messagefolderdataaccessservice = require("../../../../../engine/metadata-modules/message-folder/data-access/services/message-folder-data-access.service");
const _globalworkspaceormmanager = require("../../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagechannelworkspaceentity = require("../../standard-objects/message-channel.workspace-entity");
const _messagefolderworkspaceentity = require("../../standard-objects/message-folder.workspace-entity");
const _messagingprocessgroupemailactionsservice = require("../../../message-import-manager/services/messaging-process-group-email-actions.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const ONGOING_SYNC_STAGES = [
    _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_ONGOING
];
let MessageChannelUpdateOnePreQueryHook = class MessageChannelUpdateOnePreQueryHook {
    async execute(authContext, _objectName, payload) {
        const workspace = authContext.workspace;
        (0, _utils.assertIsDefinedOrThrow)(workspace, _workspaceexception.WorkspaceNotFoundDefaultError);
        const systemAuthContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspace.id);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageChannel = await this.messageChannelDataAccessService.findOne(workspace.id, {
                where: {
                    id: payload.id
                }
            });
            if (!(0, _utils.isDefined)(messageChannel)) {
                throw new _workspacequeryrunnerexception.WorkspaceQueryRunnerException('Message channel not found', _workspacequeryrunnerexception.WorkspaceQueryRunnerExceptionCode.DATA_NOT_FOUND, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "LOU3x5",
                        message: "Message channel not found"
                    }
                });
            }
            const messageChannelWorkspace = messageChannel;
            const isSyncOngoing = ONGOING_SYNC_STAGES.includes(messageChannelWorkspace.syncStage);
            const messageFoldersWithPendingAction = await this.messageFolderDataAccessService.find(workspace.id, {
                messageChannelId: messageChannel.id,
                pendingSyncAction: (0, _typeorm.Not)(_messagefolderworkspaceentity.MessageFolderPendingSyncAction.NONE)
            });
            const messageFoldersWithPendingActionCount = messageFoldersWithPendingAction.length;
            const hasPendingFolderActions = messageFoldersWithPendingActionCount > 0;
            const hasPendingGroupEmailsAction = messageChannelWorkspace.pendingGroupEmailsAction !== _messagechannelworkspaceentity.MessageChannelPendingGroupEmailsAction.NONE;
            if (isSyncOngoing && (hasPendingFolderActions || hasPendingGroupEmailsAction)) {
                throw new _workspacequeryrunnerexception.WorkspaceQueryRunnerException('Cannot update message channel while sync is ongoing with pending actions', _workspacequeryrunnerexception.WorkspaceQueryRunnerExceptionCode.INVALID_QUERY_INPUT, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "PjZIyI",
                        message: "Cannot update message channel while sync is ongoing. Please wait for the sync to complete."
                    }
                });
            }
            const hasCompletedConfiguration = messageChannelWorkspace.syncStage !== _messagechannelworkspaceentity.MessageChannelSyncStage.PENDING_CONFIGURATION;
            if (!hasCompletedConfiguration) {
                this.logger.log(`MessageChannelId: ${messageChannelWorkspace.id} - Skipping pending action for message channel in PENDING_CONFIGURATION state`);
                return payload;
            }
            const excludeGroupEmailsChanged = (0, _utils.isDefined)(payload.data.excludeGroupEmails) && payload.data.excludeGroupEmails !== messageChannelWorkspace.excludeGroupEmails;
            if (excludeGroupEmailsChanged) {
                await this.messagingProcessGroupEmailActionsService.markMessageChannelAsPendingGroupEmailsAction(messageChannelWorkspace, workspace.id, payload.data.excludeGroupEmails ? _messagechannelworkspaceentity.MessageChannelPendingGroupEmailsAction.GROUP_EMAILS_DELETION : _messagechannelworkspaceentity.MessageChannelPendingGroupEmailsAction.GROUP_EMAILS_IMPORT);
            }
            return payload;
        }, systemAuthContext);
    }
    constructor(globalWorkspaceOrmManager, messageChannelDataAccessService, messageFolderDataAccessService, messagingProcessGroupEmailActionsService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
        this.messageFolderDataAccessService = messageFolderDataAccessService;
        this.messagingProcessGroupEmailActionsService = messagingProcessGroupEmailActionsService;
        this.logger = new _common.Logger(MessageChannelUpdateOnePreQueryHook.name);
    }
};
MessageChannelUpdateOnePreQueryHook = _ts_decorate([
    (0, _workspacequeryhookdecorator.WorkspaceQueryHook)(`messageChannel.updateOne`),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService,
        typeof _messagefolderdataaccessservice.MessageFolderDataAccessService === "undefined" ? Object : _messagefolderdataaccessservice.MessageFolderDataAccessService,
        typeof _messagingprocessgroupemailactionsservice.MessagingProcessGroupEmailActionsService === "undefined" ? Object : _messagingprocessgroupemailactionsservice.MessagingProcessGroupEmailActionsService
    ])
], MessageChannelUpdateOnePreQueryHook);

//# sourceMappingURL=message-channel-update-one.pre-query.hook.js.map