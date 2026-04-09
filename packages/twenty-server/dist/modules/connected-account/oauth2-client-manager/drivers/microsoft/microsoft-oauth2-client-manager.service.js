"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftOAuth2ClientManagerService", {
    enumerable: true,
    get: function() {
        return MicrosoftOAuth2ClientManagerService;
    }
});
const _common = require("@nestjs/common");
const _microsoftgraphclient = require("@microsoft/microsoft-graph-client");
const _microsoftoauth2clientauthprovider = require("./microsoft-oauth2-client-auth-provider");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MicrosoftOAuth2ClientManagerService = class MicrosoftOAuth2ClientManagerService {
    async getOAuth2Client(accessToken) {
        const authProvider = new _microsoftoauth2clientauthprovider.MicrosoftOAuth2ClientAuthProvider(accessToken);
        const client = _microsoftgraphclient.Client.initWithMiddleware({
            defaultVersion: 'v1.0',
            debugLogging: false,
            authProvider
        });
        return client;
    }
};
MicrosoftOAuth2ClientManagerService = _ts_decorate([
    (0, _common.Injectable)()
], MicrosoftOAuth2ClientManagerService);

//# sourceMappingURL=microsoft-oauth2-client-manager.service.js.map