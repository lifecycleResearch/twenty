"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineCalendarEventService", {
    enumerable: true,
    get: function() {
        return TimelineCalendarEventService;
    }
});
const _common = require("@nestjs/common");
const _lodashomit = /*#__PURE__*/ _interop_require_default(require("lodash.omit"));
const _constants = require("twenty-shared/constants");
const _typeorm = require("typeorm");
const _calendarconstants = require("./constants/calendar.constants");
const _globalworkspaceormmanager = require("../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../twenty-orm/utils/build-system-auth-context.util");
const _calendarchannelworkspaceentity = require("../../../modules/calendar/common/standard-objects/calendar-channel.workspace-entity");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TimelineCalendarEventService = class TimelineCalendarEventService {
    async getCalendarEventsFromPersonIds({ currentWorkspaceMemberId, personIds, workspaceId, page = 1, pageSize = _calendarconstants.TIMELINE_CALENDAR_EVENTS_DEFAULT_PAGE_SIZE }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const offset = (page - 1) * pageSize;
            const calendarEventRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'calendarEvent');
            const calendarEventIds = await calendarEventRepository.find({
                where: {
                    calendarEventParticipants: {
                        personId: (0, _typeorm.Any)(personIds)
                    }
                },
                select: {
                    id: true,
                    startsAt: true
                },
                skip: offset,
                take: pageSize,
                order: {
                    startsAt: 'DESC'
                }
            });
            const ids = calendarEventIds.map(({ id })=>id);
            if (ids.length <= 0) {
                return {
                    totalNumberOfCalendarEvents: 0,
                    timelineCalendarEvents: []
                };
            }
            const [events, total] = await calendarEventRepository.findAndCount({
                where: {
                    id: (0, _typeorm.Any)(ids)
                },
                relations: {
                    calendarEventParticipants: {
                        person: true,
                        workspaceMember: true
                    },
                    calendarChannelEventAssociations: {
                        calendarChannel: {
                            connectedAccount: {
                                accountOwner: true
                            }
                        }
                    }
                }
            });
            const orderedEvents = events.sort((a, b)=>ids.indexOf(a.id) - ids.indexOf(b.id));
            const timelineCalendarEvents = orderedEvents.map((event)=>{
                const participants = event.calendarEventParticipants.map((participant)=>({
                        calendarEventId: event.id,
                        personId: participant.personId ?? null,
                        workspaceMemberId: participant.workspaceMemberId ?? null,
                        firstName: participant.person?.name?.firstName || participant.workspaceMember?.name.firstName || '',
                        lastName: participant.person?.name?.lastName || participant.workspaceMember?.name.lastName || '',
                        displayName: participant.person?.name?.firstName || participant.person?.name?.lastName || participant.workspaceMember?.name.firstName || participant.workspaceMember?.name.lastName || participant.displayName || participant.handle || '',
                        avatarUrl: participant.person?.avatarUrl || participant.workspaceMember?.avatarUrl || '',
                        handle: participant.handle ?? ''
                    }));
                const isCalendarEventImportedByCurrentWorkspaceMember = event.calendarChannelEventAssociations.some((association)=>association.calendarChannel.connectedAccount.accountOwnerId === currentWorkspaceMemberId);
                const visibility = event.calendarChannelEventAssociations.some((association)=>association.calendarChannel.visibility === 'SHARE_EVERYTHING') || isCalendarEventImportedByCurrentWorkspaceMember ? _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING : _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA;
                return {
                    ...(0, _lodashomit.default)(event, [
                        'calendarEventParticipants',
                        'calendarChannelEventAssociations'
                    ]),
                    title: visibility === _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA ? _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED : event.title ?? '',
                    description: visibility === _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA ? _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED : event.description ?? '',
                    startsAt: event.startsAt,
                    endsAt: event.endsAt,
                    participants,
                    visibility,
                    location: event.location ?? '',
                    conferenceSolution: event.conferenceSolution ?? ''
                };
            });
            return {
                totalNumberOfCalendarEvents: total,
                timelineCalendarEvents
            };
        }, authContext);
    }
    async getCalendarEventsFromCompanyId({ currentWorkspaceMemberId, companyId, workspaceId, page = 1, pageSize = _calendarconstants.TIMELINE_CALENDAR_EVENTS_DEFAULT_PAGE_SIZE }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const personRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'person', {
                shouldBypassPermissionChecks: true
            });
            const personIds = await personRepository.find({
                where: {
                    companyId
                },
                select: {
                    id: true
                }
            });
            if (personIds.length <= 0) {
                return {
                    totalNumberOfCalendarEvents: 0,
                    timelineCalendarEvents: []
                };
            }
            const formattedPersonIds = personIds.map(({ id })=>id);
            const calendarEvents = await this.getCalendarEventsFromPersonIds({
                currentWorkspaceMemberId,
                personIds: formattedPersonIds,
                workspaceId,
                page,
                pageSize
            });
            return calendarEvents;
        }, authContext);
    }
    async getCalendarEventsFromOpportunityId({ currentWorkspaceMemberId, opportunityId, workspaceId, page = 1, pageSize = _calendarconstants.TIMELINE_CALENDAR_EVENTS_DEFAULT_PAGE_SIZE }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const opportunityRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'opportunity', {
                shouldBypassPermissionChecks: true
            });
            const opportunity = await opportunityRepository.findOne({
                where: {
                    id: opportunityId
                },
                select: {
                    companyId: true
                }
            });
            if (!opportunity?.companyId) {
                return {
                    totalNumberOfCalendarEvents: 0,
                    timelineCalendarEvents: []
                };
            }
            const calendarEvents = await this.getCalendarEventsFromCompanyId({
                currentWorkspaceMemberId,
                companyId: opportunity.companyId,
                workspaceId,
                page,
                pageSize
            });
            return calendarEvents;
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
    }
};
TimelineCalendarEventService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager
    ])
], TimelineCalendarEventService);

//# sourceMappingURL=timeline-calendar-event.service.js.map