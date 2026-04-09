/**
 * Formats a Date or ISO string for ClickHouse DateTime64(3) type.
 * ClickHouse expects: YYYY-MM-DD HH:mm:ss.SSS (no 'T' separator, no 'Z' suffix)
 * JavaScript toISOString() returns: YYYY-MM-DDTHH:mm:ss.SSSZ
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatDateForClickHouse", {
    enumerable: true,
    get: function() {
        return formatDateForClickHouse;
    }
});
const formatDateForClickHouse = (date)=>{
    const iso = typeof date === 'string' ? date : date.toISOString();
    // Extract date (YYYY-MM-DD) and time with milliseconds (HH:mm:ss.SSS)
    return `${iso.slice(0, 10)} ${iso.slice(11, 23)}`;
};

//# sourceMappingURL=clickHouse.util.js.map