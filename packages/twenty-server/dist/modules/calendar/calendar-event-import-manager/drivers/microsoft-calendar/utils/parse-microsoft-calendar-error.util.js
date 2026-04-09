"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseMicrosoftCalendarError", {
    enumerable: true,
    get: function() {
        return parseMicrosoftCalendarError;
    }
});
const _calendareventimportdriverexception = require("../../exceptions/calendar-event-import-driver.exception");
const parseMicrosoftCalendarError = (error)=>{
    const { statusCode, message } = error;
    switch(statusCode){
        case 400:
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN);
        case 404:
            if (message == 'The mailbox is either inactive, soft-deleted, or is hosted on-premise.') {
                return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
            }
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.NOT_FOUND);
        case 410:
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.SYNC_CURSOR_ERROR);
        case 429:
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
        case 403:
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
        case 401:
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
        case 500:
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN);
        default:
            return new _calendareventimportdriverexception.CalendarEventImportDriverException(message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.UNKNOWN);
    }
};

//# sourceMappingURL=parse-microsoft-calendar-error.util.js.map