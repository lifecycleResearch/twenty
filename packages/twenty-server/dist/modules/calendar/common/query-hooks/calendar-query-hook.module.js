"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarQueryHookModule", {
    enumerable: true,
    get: function() {
        return CalendarQueryHookModule;
    }
});
const _common = require("@nestjs/common");
const _connectedaccountdataaccessmodule = require("../../../../engine/metadata-modules/connected-account/data-access/connected-account-data-access.module");
const _calendareventfindmanypostqueryhook = require("./calendar-event/calendar-event-find-many.post-query.hook");
const _calendareventfindonepostqueryhook = require("./calendar-event/calendar-event-find-one.post-query.hook");
const _applycalendareventsvisibilityrestrictionsservice = require("./calendar-event/services/apply-calendar-events-visibility-restrictions.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CalendarQueryHookModule = class CalendarQueryHookModule {
};
CalendarQueryHookModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _connectedaccountdataaccessmodule.ConnectedAccountDataAccessModule
        ],
        providers: [
            _applycalendareventsvisibilityrestrictionsservice.ApplyCalendarEventsVisibilityRestrictionsService,
            _calendareventfindonepostqueryhook.CalendarEventFindOnePostQueryHook,
            _calendareventfindmanypostqueryhook.CalendarEventFindManyPostQueryHook
        ]
    })
], CalendarQueryHookModule);

//# sourceMappingURL=calendar-query-hook.module.js.map