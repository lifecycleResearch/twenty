"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingCursorService", {
    enumerable: true,
    get: function() {
        return MessagingCursorService;
    }
});
const _common = require("@nestjs/common");
const _messagechanneldataaccessservice = require("../../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _messagefolderdataaccessservice = require("../../../../engine/metadata-modules/message-folder/data-access/services/message-folder-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessagingCursorService = class MessagingCursorService {
    async updateCursor(messageChannel, nextSyncCursor, workspaceId, folderId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            if (!folderId) {
                await this.messageChannelDataAccessService.update(workspaceId, {
                    id: messageChannel.id
                }, {
                    throttleFailureCount: 0,
                    throttleRetryAfter: null,
                    syncStageStartedAt: null,
                    syncCursor: !messageChannel.syncCursor || nextSyncCursor > messageChannel.syncCursor ? nextSyncCursor : messageChannel.syncCursor
                });
            } else {
                await this.messageFolderDataAccessService.update(workspaceId, {
                    id: folderId
                }, {
                    syncCursor: nextSyncCursor
                });
                await this.messageChannelDataAccessService.update(workspaceId, {
                    id: messageChannel.id
                }, {
                    throttleFailureCount: 0,
                    throttleRetryAfter: null,
                    syncStageStartedAt: null
                });
            }
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, messageChannelDataAccessService, messageFolderDataAccessService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
        this.messageFolderDataAccessService = messageFolderDataAccessService;
    }
};
MessagingCursorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService,
        typeof _messagefolderdataaccessservice.MessageFolderDataAccessService === "undefined" ? Object : _messagefolderdataaccessservice.MessageFolderDataAccessService
    ])
], MessagingCursorService);

//# sourceMappingURL=messaging-cursor.service.js.map