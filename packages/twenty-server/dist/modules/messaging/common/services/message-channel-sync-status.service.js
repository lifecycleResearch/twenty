"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageChannelSyncStatusService", {
    enumerable: true,
    get: function() {
        return MessageChannelSyncStatusService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _cachestoragedecorator = require("../../../../engine/core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _metricsservice = require("../../../../engine/core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../engine/core-modules/metrics/types/metrics-keys.type");
const _connectedaccountdataaccessservice = require("../../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _messagechanneldataaccessservice = require("../../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _messagefolderdataaccessservice = require("../../../../engine/metadata-modules/message-folder/data-access/services/message-folder-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _accountstoreconnectservice = require("../../../connected-account/services/accounts-to-reconnect.service");
const _accountstoreconnectkeyvaluetype = require("../../../connected-account/types/accounts-to-reconnect-key-value.type");
const _messagechannelworkspaceentity = require("../standard-objects/message-channel.workspace-entity");
const _messagefolderworkspaceentity = require("../standard-objects/message-folder.workspace-entity");
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
let MessageChannelSyncStatusService = class MessageChannelSyncStatusService {
    async markAsMessagesListFetchPending(messageChannelIds, workspaceId, preserveSyncStageStartedAt = false) {
        if (!messageChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
                ...!preserveSyncStageStartedAt ? {
                    syncStageStartedAt: null
                } : {}
            });
        }, authContext);
    }
    async markAsMessagesImportPending(messageChannelIds, workspaceId, preserveSyncStageStartedAt = false) {
        if (!messageChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGES_IMPORT_PENDING,
                ...!preserveSyncStageStartedAt ? {
                    syncStageStartedAt: null
                } : {}
            });
        }, authContext);
    }
    async resetAndMarkAsMessagesListFetchPending(messageChannelIds, workspaceId) {
        if (!messageChannelIds.length) {
            return;
        }
        for (const messageChannelId of messageChannelIds){
            await this.cacheStorage.del(`messages-to-import:${workspaceId}:${messageChannelId}`);
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncCursor: '',
                syncStageStartedAt: null,
                throttleFailureCount: 0,
                throttleRetryAfter: null,
                pendingGroupEmailsAction: _messagechannelworkspaceentity.MessageChannelPendingGroupEmailsAction.NONE
            });
            await this.messageFolderDataAccessService.update(workspaceId, {
                messageChannelId: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncCursor: '',
                pendingSyncAction: _messagefolderworkspaceentity.MessageFolderPendingSyncAction.NONE
            });
        }, authContext);
        await this.markAsMessagesListFetchPending(messageChannelIds, workspaceId);
    }
    async resetSyncStageStartedAt(messageChannelIds, workspaceId) {
        if (!messageChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncStageStartedAt: null
            });
        }, authContext);
    }
    async markAsMessagesListFetchScheduled(messageChannelIds, workspaceId) {
        if (!messageChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_SCHEDULED,
                syncStatus: _messagechannelworkspaceentity.MessageChannelSyncStatus.ONGOING,
                syncStageStartedAt: new Date().toISOString()
            });
        }, authContext);
    }
    async markAsMessagesListFetchOngoing(messageChannelIds, workspaceId) {
        if (!messageChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_ONGOING,
                syncStatus: _messagechannelworkspaceentity.MessageChannelSyncStatus.ONGOING,
                syncStageStartedAt: new Date().toISOString()
            });
        }, authContext);
    }
    async markAsCompletedAndMarkAsMessagesListFetchPending(messageChannelIds, workspaceId) {
        if (!messageChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncStatus: _messagechannelworkspaceentity.MessageChannelSyncStatus.ACTIVE,
                syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
                throttleFailureCount: 0,
                throttleRetryAfter: null,
                syncStageStartedAt: null,
                syncedAt: new Date().toISOString()
            });
        }, authContext);
        await this.metricsService.batchIncrementCounter({
            key: _metricskeystype.MetricsKeys.MessageChannelSyncJobActive,
            eventIds: messageChannelIds
        });
    }
    async markAsMessagesImportScheduled(messageChannelIds, workspaceId) {
        if (!messageChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGES_IMPORT_SCHEDULED
            });
        }, authContext);
    }
    async markAsMessagesImportOngoing(messageChannelIds, workspaceId) {
        if (!messageChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGES_IMPORT_ONGOING,
                syncStatus: _messagechannelworkspaceentity.MessageChannelSyncStatus.ONGOING,
                syncStageStartedAt: new Date().toISOString()
            });
        }, authContext);
    }
    async markAsFailed(messageChannelIds, workspaceId, syncStatus) {
        if (!messageChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.messageChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(messageChannelIds)
            }, {
                syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.FAILED,
                syncStatus: syncStatus,
                throttleRetryAfter: null
            });
            const metricsKey = syncStatus === _messagechannelworkspaceentity.MessageChannelSyncStatus.FAILED_INSUFFICIENT_PERMISSIONS ? _metricskeystype.MetricsKeys.MessageChannelSyncJobFailedInsufficientPermissions : _metricskeystype.MetricsKeys.MessageChannelSyncJobFailedUnknown;
            await this.metricsService.batchIncrementCounter({
                key: metricsKey,
                eventIds: messageChannelIds
            });
            if (syncStatus === _messagechannelworkspaceentity.MessageChannelSyncStatus.FAILED_INSUFFICIENT_PERMISSIONS) {
                const messageChannels = await this.messageChannelDataAccessService.find(workspaceId, {
                    id: (0, _typeorm.In)(messageChannelIds)
                });
                const connectedAccountIds = messageChannels.map((messageChannel)=>messageChannel.connectedAccountId);
                await this.connectedAccountDataAccessService.update(workspaceId, {
                    id: (0, _typeorm.Any)(connectedAccountIds)
                }, {
                    authFailedAt: new Date()
                });
                await this.addToAccountsToReconnect(messageChannels.map((messageChannel)=>messageChannel.id), workspaceId);
            }
        }, authContext);
    }
    async addToAccountsToReconnect(messageChannelIds, workspaceId) {
        if (!messageChannelIds.length) {
            return;
        }
        const messageChannels = await this.messageChannelDataAccessService.findMany(workspaceId, {
            where: {
                id: (0, _typeorm.In)(messageChannelIds)
            }
        });
        const workspaceMemberRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'workspaceMember', {
            shouldBypassPermissionChecks: true
        });
        for (const messageChannel of messageChannels){
            const connectedAccount = await this.connectedAccountDataAccessService.findOne(workspaceId, {
                where: {
                    id: messageChannel.connectedAccountId
                }
            });
            if (!connectedAccount) {
                continue;
            }
            const workspaceMember = await workspaceMemberRepository.findOne({
                where: {
                    id: connectedAccount.accountOwnerId
                }
            });
            if (!workspaceMember) {
                continue;
            }
            await this.accountsToReconnectService.addAccountToReconnectByKey(_accountstoreconnectkeyvaluetype.AccountsToReconnectKeys.ACCOUNTS_TO_RECONNECT_INSUFFICIENT_PERMISSIONS, workspaceMember.userId, workspaceId, connectedAccount.id);
        }
    }
    constructor(cacheStorage, globalWorkspaceOrmManager, messageChannelDataAccessService, messageFolderDataAccessService, connectedAccountDataAccessService, accountsToReconnectService, metricsService){
        this.cacheStorage = cacheStorage;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
        this.messageFolderDataAccessService = messageFolderDataAccessService;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
        this.accountsToReconnectService = accountsToReconnectService;
        this.metricsService = metricsService;
    }
};
MessageChannelSyncStatusService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.ModuleMessaging)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService,
        typeof _messagefolderdataaccessservice.MessageFolderDataAccessService === "undefined" ? Object : _messagefolderdataaccessservice.MessageFolderDataAccessService,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService,
        typeof _accountstoreconnectservice.AccountsToReconnectService === "undefined" ? Object : _accountstoreconnectservice.AccountsToReconnectService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], MessageChannelSyncStatusService);

//# sourceMappingURL=message-channel-sync-status.service.js.map