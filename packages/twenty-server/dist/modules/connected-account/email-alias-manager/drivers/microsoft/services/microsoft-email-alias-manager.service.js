"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftEmailAliasManagerService", {
    enumerable: true,
    get: function() {
        return MicrosoftEmailAliasManagerService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
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
let MicrosoftEmailAliasManagerService = class MicrosoftEmailAliasManagerService {
    async getHandleAliases(connectedAccount) {
        const microsoftClient = await this.oAuth2ClientManagerService.getMicrosoftOAuth2Client(connectedAccount);
        const response = await microsoftClient.api('/me?$select=proxyAddresses').get().catch((error)=>{
            throw new Error(`Failed to fetch email aliases: ${error.message}`);
        });
        const proxyAddresses = response.proxyAddresses;
        const handleAliases = proxyAddresses?.filter((address)=>{
            return address.startsWith('SMTP:') === false;
        }).map((address)=>{
            return address.replace('smtp:', '').toLowerCase();
        }).filter((address)=>{
            return (0, _guards.isNonEmptyString)(address);
        }) || [];
        return handleAliases;
    }
    constructor(oAuth2ClientManagerService){
        this.oAuth2ClientManagerService = oAuth2ClientManagerService;
    }
};
MicrosoftEmailAliasManagerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _oauth2clientmanagerservice.OAuth2ClientManagerService === "undefined" ? Object : _oauth2clientmanagerservice.OAuth2ClientManagerService
    ])
], MicrosoftEmailAliasManagerService);

//# sourceMappingURL=microsoft-email-alias-manager.service.js.map