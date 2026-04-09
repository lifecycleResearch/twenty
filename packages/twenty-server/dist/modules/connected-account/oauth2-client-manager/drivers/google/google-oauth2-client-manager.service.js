"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleOAuth2ClientManagerService", {
    enumerable: true,
    get: function() {
        return GoogleOAuth2ClientManagerService;
    }
});
const _common = require("@nestjs/common");
const _googleapis = require("googleapis");
const _twentyconfigservice = require("../../../../../engine/core-modules/twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let GoogleOAuth2ClientManagerService = class GoogleOAuth2ClientManagerService {
    async getOAuth2Client(refreshToken) {
        const gmailClientId = this.twentyConfigService.get('AUTH_GOOGLE_CLIENT_ID');
        const gmailClientSecret = this.twentyConfigService.get('AUTH_GOOGLE_CLIENT_SECRET');
        try {
            const oAuth2Client = new _googleapis.google.auth.OAuth2(gmailClientId, gmailClientSecret);
            oAuth2Client.setCredentials({
                refresh_token: refreshToken
            });
            return oAuth2Client;
        } catch (error) {
            this.logger.error(`Error in ${GoogleOAuth2ClientManagerService.name}`, error);
            throw error;
        }
    }
    constructor(twentyConfigService, logger){
        this.twentyConfigService = twentyConfigService;
        this.logger = logger;
    }
};
GoogleOAuth2ClientManagerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _common.Logger === "undefined" ? Object : _common.Logger
    ])
], GoogleOAuth2ClientManagerService);

//# sourceMappingURL=google-oauth2-client-manager.service.js.map