"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OAuth2ClientManagerModule", {
    enumerable: true,
    get: function() {
        return OAuth2ClientManagerModule;
    }
});
const _common = require("@nestjs/common");
const _googleoauth2clientmanagerservice = require("./drivers/google/google-oauth2-client-manager.service");
const _microsoftoauth2clientmanagerservice = require("./drivers/microsoft/microsoft-oauth2-client-manager.service");
const _oauth2clientmanagerservice = require("./services/oauth2-client-manager.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OAuth2ClientManagerModule = class OAuth2ClientManagerModule {
};
OAuth2ClientManagerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [],
        providers: [
            _oauth2clientmanagerservice.OAuth2ClientManagerService,
            _googleoauth2clientmanagerservice.GoogleOAuth2ClientManagerService,
            _microsoftoauth2clientmanagerservice.MicrosoftOAuth2ClientManagerService,
            _common.Logger
        ],
        exports: [
            _oauth2clientmanagerservice.OAuth2ClientManagerService,
            _microsoftoauth2clientmanagerservice.MicrosoftOAuth2ClientManagerService
        ]
    })
], OAuth2ClientManagerModule);

//# sourceMappingURL=oauth2-client-manager.module.js.map