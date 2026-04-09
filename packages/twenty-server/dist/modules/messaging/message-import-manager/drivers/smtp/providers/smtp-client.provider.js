"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SmtpClientProvider", {
    enumerable: true,
    get: function() {
        return SmtpClientProvider;
    }
});
const _common = require("@nestjs/common");
const _nodemailer = require("nodemailer");
const _utils = require("twenty-shared/utils");
const _securehttpclientservice = require("../../../../../../engine/core-modules/secure-http-client/secure-http-client.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SmtpClientProvider = class SmtpClientProvider {
    async getSmtpClient(connectedAccount) {
        const smtpParams = connectedAccount.connectionParameters?.SMTP;
        if (!(0, _utils.isDefined)(smtpParams)) {
            throw new Error('SMTP settings not configured for this account');
        }
        const validatedSmtpHost = await this.secureHttpClientService.getValidatedHost(smtpParams.host);
        const options = {
            host: validatedSmtpHost,
            port: smtpParams.port,
            auth: {
                user: smtpParams.username ?? connectedAccount.handle ?? '',
                pass: smtpParams.password
            },
            tls: {
                rejectUnauthorized: false
            }
        };
        const transporter = (0, _nodemailer.createTransport)(options);
        return transporter;
    }
    constructor(secureHttpClientService){
        this.secureHttpClientService = secureHttpClientService;
    }
};
SmtpClientProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _securehttpclientservice.SecureHttpClientService === "undefined" ? Object : _securehttpclientservice.SecureHttpClientService
    ])
], SmtpClientProvider);

//# sourceMappingURL=smtp-client.provider.js.map