"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseAndFormatGmailMessage", {
    enumerable: true,
    get: function() {
        return parseAndFormatGmailMessage;
    }
});
const _planer = /*#__PURE__*/ _interop_require_default(require("planer"));
const _types = require("twenty-shared/types");
const _computemessagedirectionutil = require("./compute-message-direction.util");
const _parsegmailmessageutil = require("./parse-gmail-message.util");
const _formataddressobjectasparticipantsutil = require("../../../utils/format-address-object-as-participants.util");
const _sanitizestringutil = require("../../../utils/sanitize-string.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const parseAndFormatGmailMessage = (message, connectedAccount)=>{
    const { id, threadId, internalDate, subject, from, to, cc, bcc, headerMessageId, text, attachments, deliveredTo, labelIds } = (0, _parsegmailmessageutil.parseGmailMessage)(message);
    if (!from || !to && !deliveredTo && !bcc && !cc || !headerMessageId || !threadId) {
        return null;
    }
    const toParticipants = to ?? deliveredTo;
    const participants = [
        ...from ? (0, _formataddressobjectasparticipantsutil.formatAddressObjectAsParticipants)([
            {
                address: from
            }
        ], _types.MessageParticipantRole.FROM) : [],
        ...toParticipants ? (0, _formataddressobjectasparticipantsutil.formatAddressObjectAsParticipants)([
            {
                address: toParticipants,
                name: ''
            }
        ], _types.MessageParticipantRole.TO) : [],
        ...cc ? (0, _formataddressobjectasparticipantsutil.formatAddressObjectAsParticipants)([
            {
                address: cc
            }
        ], _types.MessageParticipantRole.CC) : [],
        ...bcc ? (0, _formataddressobjectasparticipantsutil.formatAddressObjectAsParticipants)([
            {
                address: bcc
            }
        ], _types.MessageParticipantRole.BCC) : []
    ];
    const textWithoutReplyQuotations = text ? _planer.default.extractFrom(text, 'text/plain') : '';
    return {
        externalId: id,
        headerMessageId,
        subject: subject || '',
        messageThreadExternalId: threadId,
        receivedAt: new Date(parseInt(internalDate)),
        direction: (0, _computemessagedirectionutil.computeMessageDirection)(from || '', connectedAccount),
        participants,
        text: (0, _sanitizestringutil.sanitizeString)(textWithoutReplyQuotations),
        attachments,
        messageFolderExternalIds: labelIds,
        labelIds
    };
};

//# sourceMappingURL=parse-and-format-gmail-message.util.js.map