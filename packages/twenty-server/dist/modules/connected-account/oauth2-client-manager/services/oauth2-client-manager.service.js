"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OAuth2ClientManagerService", {
    enumerable: true,
    get: function() {
        return OAuth2ClientManagerService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _googleoauth2clientmanagerservice = require("../drivers/google/google-oauth2-client-manager.service");
const _microsoftoauth2clientmanagerservice = require("../drivers/microsoft/microsoft-oauth2-client-manager.service");
const _oauth2clientmanagerexceptions = require("../exceptions/oauth2-client-manager.exceptions");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OAuth2ClientManagerService = class OAuth2ClientManagerService {
    async getGoogleOAuth2Client(connectedAccount) {
        if (!(0, _utils.isDefined)(connectedAccount.refreshToken)) {
            throw new _utils.CustomError('Refresh token is required', _oauth2clientmanagerexceptions.OAuth2ClientManagerExceptionCode.REFRESH_TOKEN_REQUIRED);
        }
        return this.googleOAuth2ClientManagerService.getOAuth2Client(connectedAccount.refreshToken);
    }
    async getMicrosoftOAuth2Client(connectedAccount) {
        if (!(0, _utils.isDefined)(connectedAccount.accessToken)) {
            throw new _utils.CustomError('Access token is required', _oauth2clientmanagerexceptions.OAuth2ClientManagerExceptionCode.ACCESS_TOKEN_REQUIRED);
        }
        return this.microsoftOAuth2ClientManagerService.getOAuth2Client(connectedAccount.accessToken);
    }
    constructor(googleOAuth2ClientManagerService, microsoftOAuth2ClientManagerService){
        this.googleOAuth2ClientManagerService = googleOAuth2ClientManagerService;
        this.microsoftOAuth2ClientManagerService = microsoftOAuth2ClientManagerService;
    }
};
OAuth2ClientManagerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googleoauth2clientmanagerservice.GoogleOAuth2ClientManagerService === "undefined" ? Object : _googleoauth2clientmanagerservice.GoogleOAuth2ClientManagerService,
        typeof _microsoftoauth2clientmanagerservice.MicrosoftOAuth2ClientManagerService === "undefined" ? Object : _microsoftoauth2clientmanagerservice.MicrosoftOAuth2ClientManagerService
    ])
], OAuth2ClientManagerService);

//# sourceMappingURL=oauth2-client-manager.service.js.map