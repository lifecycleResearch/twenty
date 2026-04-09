"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BlocklistReimportCalendarEventsJob", {
    enumerable: true,
    get: function() {
        return BlocklistReimportCalendarEventsJob;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("typeorm");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _calendarchanneldataaccessservice = require("../../../../engine/metadata-modules/calendar-channel/data-access/services/calendar-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _calendarchannelsyncstatusservice = require("../../common/services/calendar-channel-sync-status.service");
const _calendarchannelworkspaceentity = require("../../common/standard-objects/calendar-channel.workspace-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BlocklistReimportCalendarEventsJob = class BlocklistReimportCalendarEventsJob {
    async handle(data) {
        const workspaceId = data.workspaceId;
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            for (const eventPayload of data.events){
                const workspaceMemberId = eventPayload.properties.before.workspaceMemberId;
                const calendarChannels = await this.calendarChannelDataAccessService.find(workspaceId, {
                    select: [
                        'id'
                    ],
                    where: {
                        connectedAccount: {
                            accountOwnerId: workspaceMemberId
                        },
                        syncStage: (0, _typeorm.Not)(_calendarchannelworkspaceentity.CalendarChannelSyncStage.CALENDAR_EVENT_LIST_FETCH_PENDING)
                    }
                });
                await this.calendarChannelSyncStatusService.resetAndMarkAsCalendarEventListFetchPending(calendarChannels.map((calendarChannel)=>calendarChannel.id), workspaceId);
            }
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, calendarChannelDataAccessService, calendarChannelSyncStatusService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.calendarChannelDataAccessService = calendarChannelDataAccessService;
        this.calendarChannelSyncStatusService = calendarChannelSyncStatusService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(BlocklistReimportCalendarEventsJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof BlocklistReimportCalendarEventsJobData === "undefined" ? Object : BlocklistReimportCalendarEventsJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], BlocklistReimportCalendarEventsJob.prototype, "handle", null);
BlocklistReimportCalendarEventsJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.calendarQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _calendarchanneldataaccessservice.CalendarChannelDataAccessService === "undefined" ? Object : _calendarchanneldataaccessservice.CalendarChannelDataAccessService,
        typeof _calendarchannelsyncstatusservice.CalendarChannelSyncStatusService === "undefined" ? Object : _calendarchannelsyncstatusservice.CalendarChannelSyncStatusService
    ])
], BlocklistReimportCalendarEventsJob);

//# sourceMappingURL=blocklist-reimport-calendar-events.job.js.map