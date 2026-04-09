"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalDavClientProvider", {
    enumerable: true,
    get: function() {
        return CalDavClientProvider;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _securehttpclientservice = require("../../../../../../engine/core-modules/secure-http-client/secure-http-client.service");
const _caldavclient = require("../lib/caldav.client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CalDavClientProvider = class CalDavClientProvider {
    async getCalDavCalendarClient(connectedAccount) {
        if (!connectedAccount.connectionParameters?.CALDAV?.password || !connectedAccount.connectionParameters?.CALDAV?.host || !(0, _utils.isDefined)(connectedAccount.handle)) {
            throw new Error('Missing required CalDAV connection parameters');
        }
        const serverUrl = await this.secureHttpClientService.getValidatedUrl(connectedAccount.connectionParameters.CALDAV.host);
        return new _caldavclient.CalDAVClient({
            username: connectedAccount.connectionParameters.CALDAV.username ?? connectedAccount.handle,
            password: connectedAccount.connectionParameters.CALDAV.password,
            serverUrl
        });
    }
    constructor(secureHttpClientService){
        this.secureHttpClientService = secureHttpClientService;
    }
};
CalDavClientProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _securehttpclientservice.SecureHttpClientService === "undefined" ? Object : _securehttpclientservice.SecureHttpClientService
    ])
], CalDavClientProvider);

//# sourceMappingURL=caldav.provider.js.map