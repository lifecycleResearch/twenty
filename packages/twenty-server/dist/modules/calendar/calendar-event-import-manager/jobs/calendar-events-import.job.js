"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarEventsImportJob", {
    enumerable: true,
    get: function() {
        return CalendarEventsImportJob;
    }
});
const _common = require("@nestjs/common");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _calendarchanneldataaccessservice = require("../../../../engine/metadata-modules/calendar-channel/data-access/services/calendar-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _calendareventsimportservice = require("../services/calendar-events-import.service");
const _calendarchannelsyncstatusservice = require("../../common/services/calendar-channel-sync-status.service");
const _calendarchannelworkspaceentity = require("../../common/standard-objects/calendar-channel.workspace-entity");
const _isthrottled = require("../../../connected-account/utils/is-throttled");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CalendarEventsImportJob = class CalendarEventsImportJob {
    async handle(data) {
        const { calendarChannelId, workspaceId } = data;
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const calendarChannel = await this.calendarChannelDataAccessService.findOne(workspaceId, {
                where: {
                    id: calendarChannelId,
                    isSyncEnabled: true
                },
                relations: [
                    'connectedAccount'
                ]
            });
            if (!calendarChannel?.isSyncEnabled) {
                return;
            }
            if (calendarChannel.syncStage !== _calendarchannelworkspaceentity.CalendarChannelSyncStage.CALENDAR_EVENTS_IMPORT_SCHEDULED) {
                return;
            }
            const syncStageStartedAt = calendarChannel.syncStageStartedAt;
            if ((0, _isthrottled.isThrottled)(syncStageStartedAt, calendarChannel.throttleFailureCount)) {
                await this.calendarChannelSyncStatusService.markAsCalendarEventsImportPending([
                    calendarChannel.id
                ], workspaceId, true);
                return;
            }
            await this.calendarEventsImportService.processCalendarEventsImport(calendarChannel, calendarChannel.connectedAccount, workspaceId);
        }, authContext);
    }
    constructor(calendarEventsImportService, calendarChannelSyncStatusService, globalWorkspaceOrmManager, calendarChannelDataAccessService){
        this.calendarEventsImportService = calendarEventsImportService;
        this.calendarChannelSyncStatusService = calendarChannelSyncStatusService;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.calendarChannelDataAccessService = calendarChannelDataAccessService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(CalendarEventsImportJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CalendarEventsImportJobData === "undefined" ? Object : CalendarEventsImportJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], CalendarEventsImportJob.prototype, "handle", null);
CalendarEventsImportJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.calendarQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _calendareventsimportservice.CalendarEventsImportService === "undefined" ? Object : _calendareventsimportservice.CalendarEventsImportService,
        typeof _calendarchannelsyncstatusservice.CalendarChannelSyncStatusService === "undefined" ? Object : _calendarchannelsyncstatusservice.CalendarChannelSyncStatusService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _calendarchanneldataaccessservice.CalendarChannelDataAccessService === "undefined" ? Object : _calendarchanneldataaccessservice.CalendarChannelDataAccessService
    ])
], CalendarEventsImportJob);

//# sourceMappingURL=calendar-events-import.job.js.map