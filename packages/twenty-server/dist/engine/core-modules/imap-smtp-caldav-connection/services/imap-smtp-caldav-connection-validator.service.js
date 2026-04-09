"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImapSmtpCaldavValidatorService", {
    enumerable: true,
    get: function() {
        return ImapSmtpCaldavValidatorService;
    }
});
const _common = require("@nestjs/common");
const _zod = require("zod");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
const _securehttpclientservice = require("../../secure-http-client/secure-http-client.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ImapSmtpCaldavValidatorService = class ImapSmtpCaldavValidatorService {
    async validateProtocolConnectionParams(params) {
        if (!params) {
            throw new _graphqlerrorsutil.UserInputError('Protocol connection parameters are required', {
                userFriendlyMessage: /*i18n*/ {
                    id: "RDvKTq",
                    message: "Please provide connection details to configure your email account."
                }
            });
        }
        try {
            const validated = this.protocolConnectionSchema.parse(params);
            try {
                await this.secureHttpClientService.getValidatedHost(validated.host);
            } catch  {
                throw new _graphqlerrorsutil.UserInputError('Connection to private or internal network addresses is not allowed', {
                    userFriendlyMessage: /*i18n*/ {
                        id: "vD3FVp",
                        message: "The server address you entered is not allowed. Please use a public server address."
                    }
                });
            }
            return validated;
        } catch (error) {
            if (error instanceof _graphqlerrorsutil.UserInputError) {
                throw error;
            }
            if (error instanceof _zod.z.ZodError) {
                const errorMessages = error.issues.map((err)=>`${err.path.join('.')}: ${err.message}`).join(', ');
                throw new _graphqlerrorsutil.UserInputError(`Protocol connection validation failed: ${errorMessages}`, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "rxi3R2",
                        message: "Please check your connection settings. Make sure the server host, port, and password are correct."
                    }
                });
            }
            throw new _graphqlerrorsutil.UserInputError('Protocol connection validation failed', {
                userFriendlyMessage: /*i18n*/ {
                    id: "Kfwq7n",
                    message: "There was an issue with your connection settings. Please try again."
                }
            });
        }
    }
    constructor(secureHttpClientService){
        this.secureHttpClientService = secureHttpClientService;
        this.protocolConnectionSchema = _zod.z.object({
            host: _zod.z.string().min(1, 'Host is required'),
            port: _zod.z.int().positive('Port must be a positive number'),
            username: _zod.z.string().optional(),
            password: _zod.z.string().min(1, 'Password is required'),
            secure: _zod.z.boolean().optional()
        });
    }
};
ImapSmtpCaldavValidatorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _securehttpclientservice.SecureHttpClientService === "undefined" ? Object : _securehttpclientservice.SecureHttpClientService
    ])
], ImapSmtpCaldavValidatorService);

//# sourceMappingURL=imap-smtp-caldav-connection-validator.service.js.map