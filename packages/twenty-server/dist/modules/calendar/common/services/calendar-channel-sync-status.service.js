"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarChannelSyncStatusService", {
    enumerable: true,
    get: function() {
        return CalendarChannelSyncStatusService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _cachestoragedecorator = require("../../../../engine/core-modules/cache-storage/decorators/cache-storage.decorator");
const _cachestorageservice = require("../../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _metricsservice = require("../../../../engine/core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../engine/core-modules/metrics/types/metrics-keys.type");
const _calendarchanneldataaccessservice = require("../../../../engine/metadata-modules/calendar-channel/data-access/services/calendar-channel-data-access.service");
const _connectedaccountdataaccessservice = require("../../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _calendarchannelworkspaceentity = require("../standard-objects/calendar-channel.workspace-entity");
const _accountstoreconnectservice = require("../../../connected-account/services/accounts-to-reconnect.service");
const _accountstoreconnectkeyvaluetype = require("../../../connected-account/types/accounts-to-reconnect-key-value.type");
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
let CalendarChannelSyncStatusService = class CalendarChannelSyncStatusService {
    async markAsCalendarEventListFetchPending(calendarChannelIds, workspaceId, preserveSyncStageStartedAt = false) {
        if (!calendarChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.calendarChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(calendarChannelIds)
            }, {
                syncStage: _calendarchannelworkspaceentity.CalendarChannelSyncStage.CALENDAR_EVENT_LIST_FETCH_PENDING,
                ...!preserveSyncStageStartedAt ? {
                    syncStageStartedAt: null
                } : {}
            });
        }, authContext);
    }
    async markAsCalendarEventListFetchOngoing(calendarChannelIds, workspaceId) {
        if (!calendarChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.calendarChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(calendarChannelIds)
            }, {
                syncStage: _calendarchannelworkspaceentity.CalendarChannelSyncStage.CALENDAR_EVENT_LIST_FETCH_ONGOING,
                syncStatus: _calendarchannelworkspaceentity.CalendarChannelSyncStatus.ONGOING,
                syncStageStartedAt: new Date().toISOString()
            });
        }, authContext);
    }
    async resetAndMarkAsCalendarEventListFetchPending(calendarChannelIds, workspaceId) {
        if (!calendarChannelIds.length) {
            return;
        }
        for (const calendarChannelId of calendarChannelIds){
            await this.cacheStorage.del(`calendar-events-to-import:${workspaceId}:${calendarChannelId}`);
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.calendarChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(calendarChannelIds)
            }, {
                syncCursor: '',
                syncStageStartedAt: null,
                throttleFailureCount: 0
            });
        }, authContext);
        await this.markAsCalendarEventListFetchPending(calendarChannelIds, workspaceId);
    }
    async resetSyncStageStartedAt(calendarChannelIds, workspaceId) {
        if (!calendarChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.calendarChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(calendarChannelIds)
            }, {
                syncStageStartedAt: null
            });
        }, authContext);
    }
    async markAsCalendarEventsImportPending(calendarChannelIds, workspaceId, preserveSyncStageStartedAt = false) {
        if (!calendarChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.calendarChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(calendarChannelIds)
            }, {
                syncStage: _calendarchannelworkspaceentity.CalendarChannelSyncStage.CALENDAR_EVENTS_IMPORT_PENDING,
                ...!preserveSyncStageStartedAt ? {
                    syncStageStartedAt: null
                } : {}
            });
        }, authContext);
    }
    async markAsCalendarEventsImportOngoing(calendarChannelIds, workspaceId) {
        if (!calendarChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.calendarChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(calendarChannelIds)
            }, {
                syncStage: _calendarchannelworkspaceentity.CalendarChannelSyncStage.CALENDAR_EVENTS_IMPORT_ONGOING,
                syncStatus: _calendarchannelworkspaceentity.CalendarChannelSyncStatus.ONGOING,
                syncStageStartedAt: new Date().toISOString()
            });
        }, authContext);
    }
    async markAsCompletedAndMarkAsCalendarEventListFetchPending(calendarChannelIds, workspaceId) {
        if (!calendarChannelIds.length) {
            return;
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.calendarChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(calendarChannelIds)
            }, {
                syncStage: _calendarchannelworkspaceentity.CalendarChannelSyncStage.CALENDAR_EVENT_LIST_FETCH_PENDING,
                syncStatus: _calendarchannelworkspaceentity.CalendarChannelSyncStatus.ACTIVE,
                throttleFailureCount: 0,
                syncStageStartedAt: null,
                syncedAt: new Date().toISOString()
            });
        }, authContext);
        await this.markAsCalendarEventListFetchPending(calendarChannelIds, workspaceId);
        await this.metricsService.batchIncrementCounter({
            key: _metricskeystype.MetricsKeys.CalendarEventSyncJobActive,
            eventIds: calendarChannelIds
        });
    }
    async markAsFailedUnknownAndFlushCalendarEventsToImport(calendarChannelIds, workspaceId) {
        if (!calendarChannelIds.length) {
            return;
        }
        for (const calendarChannelId of calendarChannelIds){
            await this.cacheStorage.del(`calendar-events-to-import:${workspaceId}:${calendarChannelId}`);
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.calendarChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(calendarChannelIds)
            }, {
                syncStatus: _calendarchannelworkspaceentity.CalendarChannelSyncStatus.FAILED_UNKNOWN,
                syncStage: _calendarchannelworkspaceentity.CalendarChannelSyncStage.FAILED
            });
        }, authContext);
        await this.metricsService.batchIncrementCounter({
            key: _metricskeystype.MetricsKeys.CalendarEventSyncJobFailedUnknown,
            eventIds: calendarChannelIds
        });
    }
    async markAsFailedInsufficientPermissionsAndFlushCalendarEventsToImport(calendarChannelIds, workspaceId) {
        if (!calendarChannelIds.length) {
            return;
        }
        for (const calendarChannelId of calendarChannelIds){
            await this.cacheStorage.del(`calendar-events-to-import:${workspaceId}:${calendarChannelId}`);
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.calendarChannelDataAccessService.update(workspaceId, {
                id: (0, _typeorm.In)(calendarChannelIds)
            }, {
                syncStatus: _calendarchannelworkspaceentity.CalendarChannelSyncStatus.FAILED_INSUFFICIENT_PERMISSIONS,
                syncStage: _calendarchannelworkspaceentity.CalendarChannelSyncStage.FAILED
            });
            const calendarChannels = await this.calendarChannelDataAccessService.find(workspaceId, {
                select: [
                    'id',
                    'connectedAccountId'
                ],
                where: {
                    id: (0, _typeorm.Any)(calendarChannelIds)
                }
            });
            const connectedAccountIds = calendarChannels.map((calendarChannel)=>calendarChannel.connectedAccountId);
            await this.connectedAccountDataAccessService.update(workspaceId, {
                id: (0, _typeorm.Any)(connectedAccountIds)
            }, {
                authFailedAt: new Date()
            });
            await this.addToAccountsToReconnect(calendarChannels.map((calendarChannel)=>calendarChannel.id), workspaceId);
        }, authContext);
        await this.metricsService.batchIncrementCounter({
            key: _metricskeystype.MetricsKeys.CalendarEventSyncJobFailedInsufficientPermissions,
            eventIds: calendarChannelIds
        });
    }
    async addToAccountsToReconnect(calendarChannelIds, workspaceId) {
        if (!calendarChannelIds.length) {
            return;
        }
        const calendarChannels = await this.calendarChannelDataAccessService.find(workspaceId, {
            select: [
                'id',
                'connectedAccountId'
            ],
            where: {
                id: (0, _typeorm.Any)(calendarChannelIds)
            }
        });
        const workspaceMemberRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'workspaceMember', {
            shouldBypassPermissionChecks: true
        });
        for (const calendarChannel of calendarChannels){
            const connectedAccount = await this.connectedAccountDataAccessService.findOne(workspaceId, {
                where: {
                    id: calendarChannel.connectedAccountId
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
            const userId = workspaceMember.userId;
            const connectedAccountId = connectedAccount.id;
            await this.accountsToReconnectService.addAccountToReconnectByKey(_accountstoreconnectkeyvaluetype.AccountsToReconnectKeys.ACCOUNTS_TO_RECONNECT_INSUFFICIENT_PERMISSIONS, userId, workspaceId, connectedAccountId);
        }
    }
    constructor(globalWorkspaceOrmManager, cacheStorage, calendarChannelDataAccessService, connectedAccountDataAccessService, accountsToReconnectService, metricsService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.cacheStorage = cacheStorage;
        this.calendarChannelDataAccessService = calendarChannelDataAccessService;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
        this.accountsToReconnectService = accountsToReconnectService;
        this.metricsService = metricsService;
    }
};
CalendarChannelSyncStatusService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _cachestoragedecorator.InjectCacheStorage)(_cachestoragenamespaceenum.CacheStorageNamespace.ModuleCalendar)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _cachestorageservice.CacheStorageService === "undefined" ? Object : _cachestorageservice.CacheStorageService,
        typeof _calendarchanneldataaccessservice.CalendarChannelDataAccessService === "undefined" ? Object : _calendarchanneldataaccessservice.CalendarChannelDataAccessService,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService,
        typeof _accountstoreconnectservice.AccountsToReconnectService === "undefined" ? Object : _accountstoreconnectservice.AccountsToReconnectService,
        typeof _metricsservice.MetricsService === "undefined" ? Object : _metricsservice.MetricsService
    ])
], CalendarChannelSyncStatusService);

//# sourceMappingURL=calendar-channel-sync-status.service.js.map