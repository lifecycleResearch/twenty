"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseGmailMessage", {
    enumerable: true,
    get: function() {
        return parseGmailMessage;
    }
});
const _assert = /*#__PURE__*/ _interop_require_default(require("assert"));
const _getattachmentdatautil = require("./get-attachment-data.util");
const _getbodydatautil = require("./get-body-data.util");
const _getpropertyfromheadersutil = require("./get-property-from-headers.util");
const _safeparseutil = require("../../../utils/safe-parse.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const parseGmailMessage = (message)=>{
    const subject = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Subject');
    const rawFrom = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'From');
    const rawTo = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'To');
    const rawDeliveredTo = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Delivered-To');
    const rawCc = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Cc');
    const rawBcc = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Bcc');
    const messageId = (0, _getpropertyfromheadersutil.getPropertyFromHeaders)(message, 'Message-ID');
    const id = message.id;
    const threadId = message.threadId;
    const historyId = message.historyId;
    const internalDate = message.internalDate;
    const labelIds = message.labelIds ?? [];
    (0, _assert.default)(id, 'ID is missing');
    (0, _assert.default)(historyId, 'History-ID is missing');
    (0, _assert.default)(internalDate, 'Internal date is missing');
    const bodyData = (0, _getbodydatautil.getBodyData)(message);
    const text = bodyData ? Buffer.from(bodyData, 'base64').toString() : '';
    const attachments = (0, _getattachmentdatautil.getAttachmentData)(message);
    return {
        id,
        headerMessageId: messageId,
        threadId,
        historyId,
        internalDate,
        subject,
        from: rawFrom ? (0, _safeparseutil.safeParseEmailAddressAddress)(rawFrom) : undefined,
        deliveredTo: rawDeliveredTo ? (0, _safeparseutil.safeParseEmailAddressAddress)(rawDeliveredTo) : undefined,
        to: rawTo ? (0, _safeparseutil.safeParseEmailAddressAddress)(rawTo) : undefined,
        cc: rawCc ? (0, _safeparseutil.safeParseEmailAddressAddress)(rawCc) : undefined,
        bcc: rawBcc ? (0, _safeparseutil.safeParseEmailAddressAddress)(rawBcc) : undefined,
        text,
        attachments,
        labelIds
    };
};

//# sourceMappingURL=parse-gmail-message.util.js.map