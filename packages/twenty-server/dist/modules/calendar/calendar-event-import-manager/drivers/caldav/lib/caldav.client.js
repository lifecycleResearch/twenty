"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalDAVClient", {
    enumerable: true,
    get: function() {
        return CalDAVClient;
    }
});
const _common = require("@nestjs/common");
const _nodeical = /*#__PURE__*/ _interop_require_wildcard(require("node-ical"));
const _tsdav = require("tsdav");
const _icalDataExtractPropertyValue = require("./utils/icalDataExtractPropertyValue");
const _caldavgeteventsservice = require("../services/caldav-get-events.service");
const _calendareventparticipantworkspaceentity = require("../../../../common/standard-objects/calendar-event-participant.workspace-entity");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
const DEFAULT_CALENDAR_TYPE = 'caldav';
let CalDAVClient = class CalDAVClient {
    hasFileExtension(url) {
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        return fileName.includes('.') && !fileName.substring(fileName.lastIndexOf('.')).includes('/');
    }
    getFileExtension(url) {
        if (!this.hasFileExtension(url)) return 'ics';
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    }
    isValidFormat(url) {
        const allowedExtensions = [
            'eml',
            'ics'
        ];
        return allowedExtensions.includes(this.getFileExtension(url));
    }
    async getAccount() {
        return (0, _tsdav.createAccount)({
            account: {
                serverUrl: this.credentials.serverUrl,
                accountType: DEFAULT_CALENDAR_TYPE,
                credentials: {
                    username: this.credentials.username,
                    password: this.credentials.password
                }
            },
            headers: this.headers
        });
    }
    async listCalendars() {
        try {
            const account = await this.getAccount();
            const calendars = await (0, _tsdav.fetchCalendars)({
                account,
                headers: this.headers
            });
            return calendars.reduce((result, calendar)=>{
                if (!calendar.components?.includes('VEVENT')) return result;
                result.push({
                    id: calendar.url,
                    url: calendar.url,
                    name: typeof calendar.displayName === 'string' ? calendar.displayName : 'Unnamed Calendar',
                    isPrimary: false
                });
                return result;
            }, []);
        } catch (error) {
            this.logger.error(`Error in ${_caldavgeteventsservice.CalDavGetEventsService.name} - getCalendarEvents`, error.code, error);
            throw error;
        }
    }
    async validateSyncCollectionSupport() {
        const account = await this.getAccount();
        const calendars = await (0, _tsdav.fetchCalendars)({
            account,
            headers: this.headers
        });
        const eventCalendar = calendars.find((calendar)=>calendar.components?.includes('VEVENT'));
        if (!eventCalendar) {
            throw new Error('No calendar with event support found');
        }
        const supportsSyncCollection = eventCalendar.reports?.includes('syncCollection') ?? false;
        if (!supportsSyncCollection) {
            throw new Error('CALDAV_SYNC_COLLECTION_NOT_SUPPORTED: Your CalDAV server does not support incremental sync (RFC 6578)');
        }
    }
    /**
   * Determines if an event is a full-day event by checking the raw iCal data.
   * Full-day events use VALUE=DATE parameter in DTSTART/DTEND properties.
   * Since node-ical converts all dates to JavaScript Date objects, we must check the raw data.
   * @see https://tools.ietf.org/html/rfc5545#section-3.3.4 (DATE Value Type)
   * @see https://tools.ietf.org/html/rfc5545#section-3.3.5 (DATE-TIME Value Type)
   * @see https://tools.ietf.org/html/rfc5545#section-3.2.20 (VALUE Parameter)
   */ isFullDayEvent(rawICalData) {
        const lines = rawICalData.split(/\r?\n/);
        for (const line of lines){
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('DTSTART') && trimmedLine.includes('VALUE=DATE')) {
                return true;
            }
        }
        return false;
    }
    extractOrganizerFromEvent(event) {
        if (!event.organizer) {
            return null;
        }
        const organizerEmail = // @ts-expect-error - limitation of node-ical typing
        event.organizer.val?.replace(/^mailto:/i, '') || '';
        return {
            displayName: // @ts-expect-error - limitation of node-ical typing
            event.organizer.params?.CN || organizerEmail || 'Unknown',
            responseStatus: _calendareventparticipantworkspaceentity.CalendarEventParticipantResponseStatus.ACCEPTED,
            handle: organizerEmail,
            isOrganizer: true
        };
    }
    mapPartStatToResponseStatus(partStat) {
        switch(partStat){
            case 'ACCEPTED':
                return _calendareventparticipantworkspaceentity.CalendarEventParticipantResponseStatus.ACCEPTED;
            case 'DECLINED':
                return _calendareventparticipantworkspaceentity.CalendarEventParticipantResponseStatus.DECLINED;
            case 'TENTATIVE':
                return _calendareventparticipantworkspaceentity.CalendarEventParticipantResponseStatus.TENTATIVE;
            case 'NEEDS-ACTION':
            default:
                return _calendareventparticipantworkspaceentity.CalendarEventParticipantResponseStatus.NEEDS_ACTION;
        }
    }
    extractAttendeesFromEvent(event) {
        if (!event.attendee) {
            return [];
        }
        const attendees = Array.isArray(event.attendee) ? event.attendee : [
            event.attendee
        ];
        return attendees.map((attendee)=>{
            // @ts-expect-error - limitation of node-ical typing
            const handle = attendee.val?.replace(/^mailto:/i, '') || '';
            // @ts-expect-error - limitation of node-ical typing
            const displayName = attendee.params?.CN || handle || 'Unknown';
            // @ts-expect-error - limitation of node-ical typing
            const partStat = attendee.params?.PARTSTAT || 'NEEDS_ACTION';
            return {
                displayName,
                responseStatus: this.mapPartStatToResponseStatus(partStat),
                handle,
                isOrganizer: false
            };
        });
    }
    extractParticipantsFromEvent(event) {
        const participants = [];
        const organizer = this.extractOrganizerFromEvent(event);
        if (organizer) {
            participants.push(organizer);
        }
        const attendees = this.extractAttendeesFromEvent(event);
        participants.push(...attendees);
        return participants;
    }
    parseICalData(rawData, objectUrl) {
        try {
            const parsed = _nodeical.parseICS(rawData);
            const events = Object.values(parsed).filter((item)=>item.type === 'VEVENT');
            if (events.length === 0) {
                return null;
            }
            const event = events[0];
            const participants = this.extractParticipantsFromEvent(event);
            const title = (0, _icalDataExtractPropertyValue.icalDataExtractPropertyValue)(event.summary, 'Untitled Event');
            const description = (0, _icalDataExtractPropertyValue.icalDataExtractPropertyValue)(event.description);
            const location = (0, _icalDataExtractPropertyValue.icalDataExtractPropertyValue)(event.location);
            const conferenceLinkUrl = (0, _icalDataExtractPropertyValue.icalDataExtractPropertyValue)(event.url);
            return {
                id: objectUrl,
                title,
                iCalUid: event.uid || '',
                description,
                startsAt: event.start.toISOString(),
                endsAt: event.end.toISOString(),
                location,
                isFullDay: this.isFullDayEvent(rawData),
                isCanceled: event.status === 'CANCELLED',
                conferenceLinkLabel: '',
                conferenceLinkUrl,
                externalCreatedAt: event.created?.toISOString() || new Date().toISOString(),
                externalUpdatedAt: event.lastmodified?.toISOString() || event.created?.toISOString() || new Date().toISOString(),
                conferenceSolution: '',
                recurringEventExternalId: event.recurrenceid ? String(event.recurrenceid) : undefined,
                participants,
                status: event.status || 'CONFIRMED'
            };
        } catch (error) {
            this.logger.error(`Error in ${_caldavgeteventsservice.CalDavGetEventsService.name} - parseICalData`, error);
            return null;
        }
    }
    async getEvents(options) {
        const calendars = await this.listCalendars();
        const results = new Map();
        const syncPromises = calendars.map(async (calendar)=>{
            try {
                const syncToken = options.syncCursor?.syncTokens[calendar.url] || calendar.syncToken?.toString();
                const syncResult = await (0, _tsdav.syncCollection)({
                    url: calendar.url,
                    props: {
                        [`${_tsdav.DAVNamespaceShort.DAV}:getetag`]: {},
                        [`${_tsdav.DAVNamespaceShort.CALDAV}:calendar-data`]: {}
                    },
                    syncLevel: 1,
                    ...syncToken ? {
                        syncToken
                    } : {},
                    headers: this.headers
                });
                const allEvents = [];
                const objectUrls = syncResult.map((event)=>event.href).filter((href)=>!!href && this.isValidFormat(href));
                if (objectUrls.length > 0) {
                    try {
                        const calendarObjects = await (0, _tsdav.calendarMultiGet)({
                            url: calendar.url,
                            props: {
                                [`${_tsdav.DAVNamespaceShort.DAV}:getetag`]: {},
                                [`${_tsdav.DAVNamespaceShort.CALDAV}:calendar-data`]: {}
                            },
                            objectUrls: objectUrls,
                            depth: '1',
                            headers: this.headers
                        });
                        for (const calendarObject of calendarObjects){
                            if (calendarObject.props?.calendarData) {
                                const iCalData = this.extractICalData(calendarObject.props?.calendarData);
                                if (!iCalData) {
                                    continue;
                                }
                                const event = this.parseICalData(iCalData, calendarObject.href || '');
                                if (event && this.isEventInTimeRange({
                                    url: calendarObject.href || '',
                                    data: calendarObject.props.calendarData,
                                    etag: calendarObject.props.getetag
                                }, options.startDate, options.endDate)) {
                                    allEvents.push(event);
                                }
                            }
                        }
                    } catch (fetchError) {
                        this.logger.error(`Error in ${_caldavgeteventsservice.CalDavGetEventsService.name} - getEvents`, fetchError);
                    }
                }
                let newSyncToken = syncToken;
                try {
                    const account = await this.getAccount();
                    const updatedCalendars = await (0, _tsdav.fetchCalendars)({
                        account,
                        headers: this.headers
                    });
                    const updatedCalendar = updatedCalendars.find((cal)=>cal.url === calendar.url);
                    if (updatedCalendar?.syncToken) {
                        newSyncToken = updatedCalendar.syncToken.toString();
                    }
                } catch (syncTokenError) {
                    this.logger.error(`Error in ${_caldavgeteventsservice.CalDavGetEventsService.name} - getEvents`, syncTokenError);
                }
                results.set(calendar.url, {
                    events: allEvents,
                    newSyncToken
                });
            } catch  {
                results.set(calendar.url, {
                    events: [],
                    newSyncToken: options.syncCursor?.syncTokens[calendar.url]
                });
            }
        });
        await Promise.all(syncPromises);
        const allEvents = Array.from(results.values()).map((result)=>result.events).flat();
        const syncTokens = {};
        for (const [calendarUrl, result] of results){
            if (result.newSyncToken) {
                syncTokens[calendarUrl] = result.newSyncToken;
            }
        }
        return {
            events: allEvents,
            syncCursor: {
                syncTokens
            }
        };
    }
    /**
   * Extracts iCal data from various CalDAV server response formats.
   * Some servers return data directly as a string, others nest it under _cdata or some other properties.
   */ extractICalData(calendarData) {
        if (!calendarData) return null;
        if (typeof calendarData === 'string' && calendarData.includes('VCALENDAR')) {
            return calendarData;
        }
        if (typeof calendarData === 'object' && calendarData !== null) {
            for(const key in calendarData){
                const result = this.extractICalData(calendarData[key]);
                if (result) return result;
            }
        }
        return null;
    }
    isEventInTimeRange(davObject, startDate, endDate) {
        try {
            if (!davObject.data) return false;
            const parsed = _nodeical.parseICS(davObject.data);
            const events = Object.values(parsed).filter((item)=>item.type === 'VEVENT');
            if (events.length === 0) return false;
            const event = events[0];
            return event.start < endDate && event.end > startDate;
        } catch  {
            return true;
        }
    }
    constructor(credentials){
        this.credentials = credentials;
        this.logger = new _common.Logger(CalDAVClient.name);
        this.headers = (0, _tsdav.getBasicAuthHeaders)({
            username: credentials.username,
            password: credentials.password
        });
    }
};
CalDAVClient = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CalendarCredentials === "undefined" ? Object : CalendarCredentials
    ])
], CalDAVClient);

//# sourceMappingURL=caldav.client.js.map