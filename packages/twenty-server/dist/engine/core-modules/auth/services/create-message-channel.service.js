"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateMessageChannelService", {
    enumerable: true,
    get: function() {
        return CreateMessageChannelService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _messagechanneldataaccessservice = require("../../../metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
const _messagechannelworkspaceentity = require("../../../../modules/messaging/common/standard-objects/message-channel.workspace-entity");
const _syncmessagefoldersservice = require("../../../../modules/messaging/message-folder-manager/services/sync-message-folders.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateMessageChannelService = class CreateMessageChannelService {
    async createMessageChannel(input) {
        const { workspaceId, connectedAccountId, handle, messageVisibility, manager, skipMessageChannelConfiguration } = input;
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const newMessageChannelId = (0, _uuid.v4)();
            await this.messageChannelDataAccessService.save(workspaceId, {
                id: newMessageChannelId,
                connectedAccountId,
                type: _messagechannelworkspaceentity.MessageChannelType.EMAIL,
                handle,
                visibility: messageVisibility || _messagechannelworkspaceentity.MessageChannelVisibility.SHARE_EVERYTHING,
                syncStatus: skipMessageChannelConfiguration ? _messagechannelworkspaceentity.MessageChannelSyncStatus.ONGOING : _messagechannelworkspaceentity.MessageChannelSyncStatus.NOT_SYNCED,
                syncStage: skipMessageChannelConfiguration ? _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING : _messagechannelworkspaceentity.MessageChannelSyncStage.PENDING_CONFIGURATION,
                pendingGroupEmailsAction: _messagechannelworkspaceentity.MessageChannelPendingGroupEmailsAction.NONE
            }, manager);
            const createdMessageChannel = await this.messageChannelDataAccessService.findOne(workspaceId, {
                where: {
                    id: newMessageChannelId
                },
                relations: [
                    'connectedAccount',
                    'messageFolders'
                ]
            });
            if (!(0, _utils.isDefined)(createdMessageChannel)) {
                throw new Error('Message channel not found');
            }
            await this.syncMessageFoldersService.syncMessageFolders({
                messageChannel: createdMessageChannel,
                workspaceId
            });
            return newMessageChannelId;
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, messageChannelDataAccessService, syncMessageFoldersService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
        this.syncMessageFoldersService = syncMessageFoldersService;
    }
};
CreateMessageChannelService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService,
        typeof _syncmessagefoldersservice.SyncMessageFoldersService === "undefined" ? Object : _syncmessagefoldersservice.SyncMessageFoldersService
    ])
], CreateMessageChannelService);

//# sourceMappingURL=create-message-channel.service.js.map