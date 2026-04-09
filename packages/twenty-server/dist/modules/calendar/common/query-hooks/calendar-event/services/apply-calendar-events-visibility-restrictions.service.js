"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplyCalendarEventsVisibilityRestrictionsService", {
    enumerable: true,
    get: function() {
        return ApplyCalendarEventsVisibilityRestrictionsService;
    }
});
const _common = require("@nestjs/common");
const _lodashgroupby = /*#__PURE__*/ _interop_require_default(require("lodash.groupby"));
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _connectedaccountdataaccessservice = require("../../../../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _calendarchannelworkspaceentity = require("../../../standard-objects/calendar-channel.workspace-entity");
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
let ApplyCalendarEventsVisibilityRestrictionsService = class ApplyCalendarEventsVisibilityRestrictionsService {
    async applyCalendarEventsVisibilityRestrictions(calendarEvents, workspaceId, userId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const calendarChannelEventAssociationRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'calendarChannelEventAssociation');
            const calendarChannelCalendarEventsAssociations = await calendarChannelEventAssociationRepository.find({
                where: {
                    calendarEventId: (0, _typeorm.In)(calendarEvents.map((event)=>event.id))
                },
                relations: [
                    'calendarChannel'
                ]
            });
            const workspaceMemberRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'workspaceMember');
            for(let i = calendarEvents.length - 1; i >= 0; i--){
                const calendarChannelCalendarEventAssociations = calendarChannelCalendarEventsAssociations.filter((association)=>association.calendarEventId === calendarEvents[i].id);
                const calendarChannels = calendarChannelCalendarEventAssociations.map((association)=>association.calendarChannel);
                const calendarChannelsGroupByVisibility = (0, _lodashgroupby.default)(calendarChannels, (channel)=>channel.visibility);
                if (calendarChannelsGroupByVisibility[_calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING]) {
                    continue;
                }
                if ((0, _utils.isDefined)(userId)) {
                    const workspaceMember = await workspaceMemberRepository.findOneByOrFail({
                        userId: userId
                    });
                    const connectedAccounts = await this.connectedAccountDataAccessService.find(workspaceId, {
                        calendarChannels: {
                            id: (0, _typeorm.In)(calendarChannels.map((channel)=>channel.id))
                        },
                        accountOwnerId: workspaceMember.id
                    });
                    if (connectedAccounts.length > 0) {
                        continue;
                    }
                }
                if (calendarChannelsGroupByVisibility[_calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA]) {
                    calendarEvents[i].title = _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED;
                    calendarEvents[i].description = _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED;
                    continue;
                }
                calendarEvents.splice(i, 1);
            }
            return calendarEvents;
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, connectedAccountDataAccessService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
    }
};
ApplyCalendarEventsVisibilityRestrictionsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService
    ])
], ApplyCalendarEventsVisibilityRestrictionsService);

//# sourceMappingURL=apply-calendar-events-visibility-restrictions.service.js.map