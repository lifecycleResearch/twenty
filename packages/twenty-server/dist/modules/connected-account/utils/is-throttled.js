"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isThrottled", {
    enumerable: true,
    get: function() {
        return isThrottled;
    }
});
const _utils = require("twenty-shared/utils");
const _messagingthrottleduration = require("../../messaging/message-import-manager/constants/messaging-throttle-duration");
const _isValidDate = require("../../../utils/date/isValidDate");
const isThrottled = (syncStageStartedAt, throttleFailureCount, throttleRetryAfter)=>{
    if (!syncStageStartedAt) {
        return false;
    }
    if (throttleFailureCount === 0) {
        return false;
    }
    const now = new Date();
    const exponentialBackoffUntil = computeThrottlePauseUntil(syncStageStartedAt, throttleFailureCount);
    const retryAfterCandidate = (0, _utils.isDefined)(throttleRetryAfter) ? new Date(throttleRetryAfter) : null;
    const retryAfterDate = (0, _isValidDate.isValidDate)(retryAfterCandidate) ? retryAfterCandidate : null;
    const effectiveUntil = (0, _utils.isDefined)(retryAfterDate) && retryAfterDate > exponentialBackoffUntil ? retryAfterDate : exponentialBackoffUntil;
    return effectiveUntil > now;
};
const computeThrottlePauseUntil = (syncStageStartedAt, throttleFailureCount)=>{
    return new Date(new Date(syncStageStartedAt).getTime() + _messagingthrottleduration.MESSAGING_THROTTLE_DURATION * Math.pow(2, throttleFailureCount - 1));
};

//# sourceMappingURL=is-throttled.js.map