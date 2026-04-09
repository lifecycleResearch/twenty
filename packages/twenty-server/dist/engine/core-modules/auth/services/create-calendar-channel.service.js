"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateCalendarChannelService", {
    enumerable: true,
    get: function() {
        return CreateCalendarChannelService;
    }
});
const _common = require("@nestjs/common");
const _uuid = require("uuid");
const _calendarchanneldataaccessservice = require("../../../metadata-modules/calendar-channel/data-access/services/calendar-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
const _calendarchannelworkspaceentity = require("../../../../modules/calendar/common/standard-objects/calendar-channel.workspace-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreateCalendarChannelService = class CreateCalendarChannelService {
    async createCalendarChannel(input) {
        const { workspaceId, connectedAccountId, handle, calendarVisibility, manager, skipMessageChannelConfiguration } = input;
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const newCalendarChannelId = (0, _uuid.v4)();
            await this.calendarChannelDataAccessService.save(workspaceId, {
                id: newCalendarChannelId,
                connectedAccountId,
                handle,
                visibility: calendarVisibility || _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING,
                syncStatus: skipMessageChannelConfiguration ? _calendarchannelworkspaceentity.CalendarChannelSyncStatus.ONGOING : _calendarchannelworkspaceentity.CalendarChannelSyncStatus.NOT_SYNCED,
                syncStage: skipMessageChannelConfiguration ? _calendarchannelworkspaceentity.CalendarChannelSyncStage.CALENDAR_EVENT_LIST_FETCH_PENDING : _calendarchannelworkspaceentity.CalendarChannelSyncStage.PENDING_CONFIGURATION
            }, manager);
            return newCalendarChannelId;
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, calendarChannelDataAccessService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.calendarChannelDataAccessService = calendarChannelDataAccessService;
    }
};
CreateCalendarChannelService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _calendarchanneldataaccessservice.CalendarChannelDataAccessService === "undefined" ? Object : _calendarchanneldataaccessservice.CalendarChannelDataAccessService
    ])
], CreateCalendarChannelService);

//# sourceMappingURL=create-calendar-channel.service.js.map