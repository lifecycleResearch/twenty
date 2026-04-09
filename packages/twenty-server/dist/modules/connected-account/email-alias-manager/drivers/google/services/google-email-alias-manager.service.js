"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GoogleEmailAliasManagerService", {
    enumerable: true,
    get: function() {
        return GoogleEmailAliasManagerService;
    }
});
const _common = require("@nestjs/common");
const _googleapis = require("googleapis");
const _googleemailaliaserrorhandlerservice = require("./google-email-alias-error-handler.service");
const _oauth2clientmanagerservice = require("../../../../oauth2-client-manager/services/oauth2-client-manager.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let GoogleEmailAliasManagerService = class GoogleEmailAliasManagerService {
    async getHandleAliases(connectedAccount) {
        const oAuth2Client = await this.oAuth2ClientManagerService.getGoogleOAuth2Client(connectedAccount);
        const peopleClient = _googleapis.google.people({
            version: 'v1',
            auth: oAuth2Client
        });
        const emailsResponse = await peopleClient.people.get({
            resourceName: 'people/me',
            personFields: 'emailAddresses'
        }).catch((error)=>{
            throw this.gmailEmailAliasErrorHandlerService.handleError(error);
        });
        const emailAddresses = emailsResponse.data.emailAddresses;
        const handleAliases = emailAddresses?.filter((emailAddress)=>{
            return emailAddress.metadata?.primary !== true;
        }).map((emailAddress)=>{
            return emailAddress.value || '';
        }) || [];
        return handleAliases;
    }
    constructor(oAuth2ClientManagerService, gmailEmailAliasErrorHandlerService){
        this.oAuth2ClientManagerService = oAuth2ClientManagerService;
        this.gmailEmailAliasErrorHandlerService = gmailEmailAliasErrorHandlerService;
    }
};
GoogleEmailAliasManagerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _oauth2clientmanagerservice.OAuth2ClientManagerService === "undefined" ? Object : _oauth2clientmanagerservice.OAuth2ClientManagerService,
        typeof _googleemailaliaserrorhandlerservice.GmailEmailAliasErrorHandlerService === "undefined" ? Object : _googleemailaliaserrorhandlerservice.GmailEmailAliasErrorHandlerService
    ])
], GoogleEmailAliasManagerService);

//# sourceMappingURL=google-email-alias-manager.service.js.map