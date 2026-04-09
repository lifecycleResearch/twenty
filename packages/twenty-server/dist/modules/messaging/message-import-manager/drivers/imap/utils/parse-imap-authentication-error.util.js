"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseImapAuthenticationError", {
    enumerable: true,
    get: function() {
        return parseImapAuthenticationError;
    }
});
const _messageimportdriverexception = require("../../exceptions/message-import-driver.exception");
const _isimapnetworkerrorutil = require("./is-imap-network-error.util");
const parseImapAuthenticationError = (error)=>{
    if ((0, _isimapnetworkerrorutil.isImapNetworkError)(error)) {
        return new _messageimportdriverexception.MessageImportDriverException(`IMAP network error: ${error.message}`, _messageimportdriverexception.MessageImportDriverExceptionCode.TEMPORARY_ERROR, {
            cause: error
        });
    }
    if (error.authenticationFailed === true) {
        return new _messageimportdriverexception.MessageImportDriverException(`IMAP authentication error: ${error.message}`, _messageimportdriverexception.MessageImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS, {
            cause: error
        });
    }
    return new _messageimportdriverexception.MessageImportDriverException(`Unknown IMAP authentication error: ${error.message}`, _messageimportdriverexception.MessageImportDriverExceptionCode.UNKNOWN, {
        cause: error
    });
};

//# sourceMappingURL=parse-imap-authentication-error.util.js.map