"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalDavGetEventsService", {
    enumerable: true,
    get: function() {
        return CalDavGetEventsService;
    }
});
const _common = require("@nestjs/common");
const _caldavprovider = require("../providers/caldav.provider");
const _parsecaldaverrorutil = require("../utils/parse-caldav-error.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CalDavGetEventsService = class CalDavGetEventsService {
    async getCalendarEvents(connectedAccount, syncCursor) {
        this.logger.debug(`Getting calendar events for ${connectedAccount.handle}`);
        try {
            const caldavCalendarClient = await this.caldavCalendarClientProvider.getCalDavCalendarClient(connectedAccount);
            const startDate = new Date(Date.now() - CalDavGetEventsService.PAST_DAYS_WINDOW * 24 * 60 * 60 * 1000);
            const endDate = new Date(Date.now() + CalDavGetEventsService.FUTURE_DAYS_WINDOW * 24 * 60 * 60 * 1000);
            const result = await caldavCalendarClient.getEvents({
                startDate,
                endDate,
                syncCursor: syncCursor ? JSON.parse(syncCursor) : undefined
            });
            this.logger.debug(`Found ${result.events.length} calendar events for ${connectedAccount.handle}`);
            return {
                fullEvents: true,
                calendarEvents: result.events,
                nextSyncCursor: JSON.stringify(result.syncCursor)
            };
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    handleError(error) {
        this.logger.error(`Error in ${CalDavGetEventsService.name} - getCalendarEvents`, error);
        throw (0, _parsecaldaverrorutil.parseCalDAVError)(error);
    }
    constructor(caldavCalendarClientProvider){
        this.caldavCalendarClientProvider = caldavCalendarClientProvider;
        this.logger = new _common.Logger(CalDavGetEventsService.name);
    }
};
CalDavGetEventsService.PAST_DAYS_WINDOW = 365 * 5;
CalDavGetEventsService.FUTURE_DAYS_WINDOW = 365;
CalDavGetEventsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _caldavprovider.CalDavClientProvider === "undefined" ? Object : _caldavprovider.CalDavClientProvider
    ])
], CalDavGetEventsService);

//# sourceMappingURL=caldav-get-events.service.js.map