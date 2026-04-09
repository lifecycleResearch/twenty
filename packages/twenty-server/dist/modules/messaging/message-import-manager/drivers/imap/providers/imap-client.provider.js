"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImapClientProvider", {
    enumerable: true,
    get: function() {
        return ImapClientProvider;
    }
});
const _common = require("@nestjs/common");
const _imapflow = require("imapflow");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _securehttpclientservice = require("../../../../../../engine/core-modules/secure-http-client/secure-http-client.service");
const _messageimportdriverexception = require("../../exceptions/message-import-driver.exception");
const _parseimapauthenticationerrorutil = require("../utils/parse-imap-authentication-error.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ImapClientProvider = class ImapClientProvider {
    async getClient(connectedAccount) {
        try {
            return await this.createConnection(connectedAccount);
        } catch (error) {
            this.logger.error(`Failed to establish IMAP connection for ${connectedAccount.handle}: ${error.message}`, error.stack);
            throw (0, _parseimapauthenticationerrorutil.parseImapAuthenticationError)(error);
        }
    }
    async closeClient(client) {
        try {
            await client.logout();
            this.logger.log('Closed IMAP client');
        } catch (error) {
            this.logger.error(`Error closing IMAP client: ${error.message}`);
        }
    }
    async createConnection(connectedAccount) {
        if (connectedAccount.provider !== _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV || !(0, _utils.isDefined)(connectedAccount.connectionParameters?.IMAP)) {
            throw new Error('Connected account is not an IMAP provider');
        }
        const connectionParameters = connectedAccount.connectionParameters || {};
        if (!(0, _utils.isDefined)(connectedAccount.handle)) {
            throw new _utils.CustomError('Handle is required', _messageimportdriverexception.MessageImportDriverExceptionCode.CHANNEL_MISCONFIGURED);
        }
        const validatedImapHost = await this.secureHttpClientService.getValidatedHost(connectionParameters.IMAP?.host || '');
        const client = new _imapflow.ImapFlow({
            host: validatedImapHost,
            port: connectionParameters.IMAP?.port || 993,
            secure: connectionParameters.IMAP?.secure,
            auth: {
                user: (0, _utils.isDefined)(connectionParameters.IMAP?.username) ? connectionParameters.IMAP?.username : connectedAccount.handle,
                pass: connectionParameters.IMAP?.password || ''
            },
            logger: false,
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: ImapClientProvider.CONNECTION_TIMEOUT_MS,
            greetingTimeout: ImapClientProvider.GREETING_TIMEOUT_MS
        });
        try {
            await client.connect();
            this.logger.log(`Connected to IMAP server for ${connectedAccount.handle}`);
            return client;
        } catch (error) {
            try {
                await client.logout();
            } catch  {
            // Ignore cleanup errors
            }
            throw error;
        }
    }
    constructor(secureHttpClientService){
        this.secureHttpClientService = secureHttpClientService;
        this.logger = new _common.Logger(ImapClientProvider.name);
    }
};
ImapClientProvider.CONNECTION_TIMEOUT_MS = 30000;
ImapClientProvider.GREETING_TIMEOUT_MS = 16000;
ImapClientProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _securehttpclientservice.SecureHttpClientService === "undefined" ? Object : _securehttpclientservice.SecureHttpClientService
    ])
], ImapClientProvider);

//# sourceMappingURL=imap-client.provider.js.map