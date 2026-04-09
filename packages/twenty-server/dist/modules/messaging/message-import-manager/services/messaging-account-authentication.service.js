"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingAccountAuthenticationService", {
    enumerable: true,
    get: function() {
        return MessagingAccountAuthenticationService;
    }
});
const _common = require("@nestjs/common");
const _classvalidator = require("class-validator");
const _types = require("twenty-shared/types");
const _connectedaccountrefreshtokensexception = require("../../../connected-account/refresh-tokens-manager/exceptions/connected-account-refresh-tokens.exception");
const _connectedaccountrefreshtokensservice = require("../../../connected-account/refresh-tokens-manager/services/connected-account-refresh-tokens.service");
const _messageimportdriverexception = require("../drivers/exceptions/message-import-driver.exception");
const _messagingmonitoringservice = require("../../monitoring/services/messaging-monitoring.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MessagingAccountAuthenticationService = class MessagingAccountAuthenticationService {
    async validateAndRefreshConnectedAccountAuthentication({ connectedAccount, workspaceId, messageChannelId }) {
        if (connectedAccount.provider === _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV && (0, _classvalidator.isDefined)(connectedAccount.connectionParameters?.IMAP)) {
            await this.validateImapCredentialsForConnectedAccount({
                connectedAccount,
                workspaceId,
                messageChannelId
            });
            return {
                accessToken: '',
                refreshToken: ''
            };
        }
        return await this.refreshAccessTokenForOAuthProvider({
            connectedAccount,
            workspaceId,
            messageChannelId
        });
    }
    async validateImapCredentialsForConnectedAccount({ connectedAccount, workspaceId, messageChannelId }) {
        if (!(0, _classvalidator.isDefined)(connectedAccount.connectionParameters) || !(0, _classvalidator.isDefined)(connectedAccount.connectionParameters?.IMAP)) {
            await this.messagingMonitoringService.track({
                eventName: 'messages_import.error.missing_imap_credentials',
                workspaceId,
                connectedAccountId: connectedAccount.id,
                messageChannelId
            });
            throw {
                code: _messageimportdriverexception.MessageImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS,
                message: 'Missing IMAP credentials in connectionParameters'
            };
        }
    }
    async refreshAccessTokenForOAuthProvider({ connectedAccount, workspaceId, messageChannelId }) {
        try {
            return await this.connectedAccountRefreshTokensService.refreshAndSaveTokens(connectedAccount, workspaceId);
        } catch (error) {
            switch(error.code){
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.TEMPORARY_NETWORK_ERROR:
                    throw new _messageimportdriverexception.MessageImportDriverException(error.message, _messageimportdriverexception.MessageImportDriverExceptionCode.TEMPORARY_ERROR);
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.REFRESH_TOKEN_NOT_FOUND:
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.INVALID_REFRESH_TOKEN:
                    await this.messagingMonitoringService.track({
                        eventName: `refresh_token.error.insufficient_permissions`,
                        workspaceId,
                        connectedAccountId: connectedAccount.id,
                        messageChannelId,
                        message: `${error.code}: ${error.reason ?? ''}`
                    });
                    throw new _messageimportdriverexception.MessageImportDriverException(error.message, _messageimportdriverexception.MessageImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.PROVIDER_NOT_SUPPORTED:
                    throw new _messageimportdriverexception.MessageImportDriverException(error.message, _messageimportdriverexception.MessageImportDriverExceptionCode.PROVIDER_NOT_SUPPORTED);
                default:
                    throw error;
            }
        }
    }
    constructor(connectedAccountRefreshTokensService, messagingMonitoringService){
        this.connectedAccountRefreshTokensService = connectedAccountRefreshTokensService;
        this.messagingMonitoringService = messagingMonitoringService;
    }
};
MessagingAccountAuthenticationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _connectedaccountrefreshtokensservice.ConnectedAccountRefreshTokensService === "undefined" ? Object : _connectedaccountrefreshtokensservice.ConnectedAccountRefreshTokensService,
        typeof _messagingmonitoringservice.MessagingMonitoringService === "undefined" ? Object : _messagingmonitoringservice.MessagingMonitoringService
    ])
], MessagingAccountAuthenticationService);

//# sourceMappingURL=messaging-account-authentication.service.js.map