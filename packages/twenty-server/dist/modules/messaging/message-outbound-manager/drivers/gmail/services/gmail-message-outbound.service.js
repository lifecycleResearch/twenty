"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GmailMessageOutboundService", {
    enumerable: true,
    get: function() {
        return GmailMessageOutboundService;
    }
});
const _common = require("@nestjs/common");
const _googleapis = require("googleapis");
const _mailcomposer = /*#__PURE__*/ _interop_require_default(require("nodemailer/lib/mail-composer"));
const _utils = require("twenty-shared/utils");
const _oauth2clientmanagerservice = require("../../../../../connected-account/oauth2-client-manager/services/oauth2-client-manager.service");
const _mimeencodeutil = require("../../../../message-import-manager/utils/mime-encode.util");
const _tomailcomposeroptionsutil = require("../../../utils/to-mail-composer-options.util");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let GmailMessageOutboundService = class GmailMessageOutboundService {
    async sendMessage(sendMessageInput, connectedAccount) {
        const { gmailClient, encodedMessage } = await this.composeGmailMessage(connectedAccount, sendMessageInput);
        await gmailClient.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage
            }
        });
    }
    async createDraft(sendMessageInput, connectedAccount) {
        const { gmailClient, encodedMessage } = await this.composeGmailMessage(connectedAccount, sendMessageInput);
        await gmailClient.users.drafts.create({
            userId: 'me',
            requestBody: {
                message: {
                    raw: encodedMessage
                }
            }
        });
    }
    async composeGmailMessage(connectedAccount, sendMessageInput) {
        const oAuth2Client = await this.oAuth2ClientManagerService.getGoogleOAuth2Client(connectedAccount);
        const gmailClient = _googleapis.google.gmail({
            version: 'v1',
            auth: oAuth2Client
        });
        const peopleClient = _googleapis.google.people({
            version: 'v1',
            auth: oAuth2Client
        });
        const { data: gmailData } = await gmailClient.users.getProfile({
            userId: 'me'
        });
        const fromEmail = gmailData.emailAddress;
        const { data: peopleData } = await peopleClient.people.get({
            resourceName: 'people/me',
            personFields: 'names'
        });
        const fromName = peopleData?.names?.[0]?.displayName;
        const from = (0, _utils.isDefined)(fromName) ? `"${(0, _mimeencodeutil.mimeEncode)(fromName)}" <${fromEmail}>` : `${fromEmail}`;
        const mail = new _mailcomposer.default((0, _tomailcomposeroptionsutil.toMailComposerOptions)(from, sendMessageInput));
        const compiledMessage = mail.compile();
        compiledMessage.keepBcc = true;
        const messageBuffer = await compiledMessage.build();
        const encodedMessage = Buffer.from(messageBuffer).toString('base64url');
        return {
            gmailClient,
            encodedMessage
        };
    }
    constructor(oAuth2ClientManagerService){
        this.oAuth2ClientManagerService = oAuth2ClientManagerService;
    }
};
GmailMessageOutboundService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _oauth2clientmanagerservice.OAuth2ClientManagerService === "undefined" ? Object : _oauth2clientmanagerservice.OAuth2ClientManagerService
    ])
], GmailMessageOutboundService);

//# sourceMappingURL=gmail-message-outbound.service.js.map