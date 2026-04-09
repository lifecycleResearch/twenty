"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarAccountAuthenticationService", {
    enumerable: true,
    get: function() {
        return CalendarAccountAuthenticationService;
    }
});
const _common = require("@nestjs/common");
const _classvalidator = require("class-validator");
const _types = require("twenty-shared/types");
const _calendareventimportdriverexception = require("../drivers/exceptions/calendar-event-import-driver.exception");
const _connectedaccountrefreshtokensexception = require("../../../connected-account/refresh-tokens-manager/exceptions/connected-account-refresh-tokens.exception");
const _connectedaccountrefreshtokensservice = require("../../../connected-account/refresh-tokens-manager/services/connected-account-refresh-tokens.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CalendarAccountAuthenticationService = class CalendarAccountAuthenticationService {
    async validateAndRefreshConnectedAccountAuthentication({ connectedAccount, workspaceId, calendarChannelId: messageChannelId }) {
        if (connectedAccount.provider === _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV && (0, _classvalidator.isDefined)(connectedAccount.connectionParameters?.CALDAV)) {
            await this.validateCalDavCredentialsForConnectedAccount({
                connectedAccount,
                workspaceId,
                calendarChannelId: messageChannelId
            });
            return {
                accessToken: '',
                refreshToken: ''
            };
        }
        return await this.refreshAccessTokenForOAuthProvider({
            connectedAccount,
            workspaceId,
            calendarChannelId: messageChannelId
        });
    }
    async validateCalDavCredentialsForConnectedAccount({ connectedAccount }) {
        if (!(0, _classvalidator.isDefined)(connectedAccount.connectionParameters) || !(0, _classvalidator.isDefined)(connectedAccount.connectionParameters?.CALDAV)) {
            throw {
                code: _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS,
                message: 'Missing CALDAV credentials in connectionParameters'
            };
        }
    }
    async refreshAccessTokenForOAuthProvider({ connectedAccount, workspaceId }) {
        try {
            return await this.connectedAccountRefreshTokensService.refreshAndSaveTokens(connectedAccount, workspaceId);
        } catch (error) {
            switch(error.code){
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.TEMPORARY_NETWORK_ERROR:
                    throw new _calendareventimportdriverexception.CalendarEventImportDriverException(error.message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.TEMPORARY_ERROR);
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.REFRESH_TOKEN_NOT_FOUND:
                case _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.INVALID_REFRESH_TOKEN:
                    throw new _calendareventimportdriverexception.CalendarEventImportDriverException(error.message, _calendareventimportdriverexception.CalendarEventImportDriverExceptionCode.INSUFFICIENT_PERMISSIONS);
                default:
                    throw error;
            }
        }
    }
    constructor(connectedAccountRefreshTokensService){
        this.connectedAccountRefreshTokensService = connectedAccountRefreshTokensService;
    }
};
CalendarAccountAuthenticationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _connectedaccountrefreshtokensservice.ConnectedAccountRefreshTokensService === "undefined" ? Object : _connectedaccountrefreshtokensservice.ConnectedAccountRefreshTokensService
    ])
], CalendarAccountAuthenticationService);

//# sourceMappingURL=calendar-account-authentication.service.js.map