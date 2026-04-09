"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MicrosoftMessageOutboundService", {
    enumerable: true,
    get: function() {
        return MicrosoftMessageOutboundService;
    }
});
const _common = require("@nestjs/common");
const _oauth2clientmanagerservice = require("../../../../../connected-account/oauth2-client-manager/services/oauth2-client-manager.service");
const _tomicrosoftrecipientsutil = require("../../../../message-import-manager/utils/to-microsoft-recipients.util");
const _utils = require("twenty-shared/utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MicrosoftMessageOutboundService = class MicrosoftMessageOutboundService {
    async sendMessage(sendMessageInput, connectedAccount) {
        const microsoftClient = await this.oAuth2ClientManagerService.getMicrosoftOAuth2Client(connectedAccount);
        const messageId = await this.createDraftMessage(microsoftClient, sendMessageInput);
        await microsoftClient.api(`/me/messages/${messageId}/send`).post({});
    }
    async createDraft(sendMessageInput, connectedAccount) {
        const microsoftClient = await this.oAuth2ClientManagerService.getMicrosoftOAuth2Client(connectedAccount);
        await this.createDraftMessage(microsoftClient, sendMessageInput);
    }
    async createDraftMessage(microsoftClient, sendMessageInput) {
        const parentMessageGraphId = sendMessageInput.inReplyTo ? await this.findMessageByInternetMessageId(microsoftClient, sendMessageInput.inReplyTo) : undefined;
        const message = this.composeMicrosoftMessage(sendMessageInput);
        if ((0, _utils.isDefined)(parentMessageGraphId)) {
            const reply = await microsoftClient.api(`/me/messages/${parentMessageGraphId}/createReply`).post({});
            await microsoftClient.api(`/me/messages/${reply.id}`).patch(message);
            return reply.id;
        }
        const response = await microsoftClient.api('/me/messages').post(message);
        return response.id;
    }
    async findMessageByInternetMessageId(microsoftClient, internetMessageId) {
        const encodedId = encodeURIComponent(internetMessageId);
        const response = await microsoftClient.api(`/me/messages?$filter=internetMessageId eq '${encodedId}'&$select=id&$top=1`).get();
        return response?.value?.[0]?.id;
    }
    composeMicrosoftMessage(sendMessageInput) {
        return {
            subject: sendMessageInput.subject,
            body: {
                contentType: 'HTML',
                content: sendMessageInput.html
            },
            toRecipients: (0, _tomicrosoftrecipientsutil.toMicrosoftRecipients)(sendMessageInput.to),
            ccRecipients: (0, _tomicrosoftrecipientsutil.toMicrosoftRecipients)(sendMessageInput.cc),
            bccRecipients: (0, _tomicrosoftrecipientsutil.toMicrosoftRecipients)(sendMessageInput.bcc),
            ...sendMessageInput.attachments && sendMessageInput.attachments.length > 0 ? {
                attachments: sendMessageInput.attachments.map((attachment)=>({
                        '@odata.type': '#microsoft.graph.fileAttachment',
                        name: attachment.filename,
                        contentType: attachment.contentType,
                        contentBytes: attachment.content.toString('base64')
                    }))
            } : {}
        };
    }
    constructor(oAuth2ClientManagerService){
        this.oAuth2ClientManagerService = oAuth2ClientManagerService;
    }
};
MicrosoftMessageOutboundService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _oauth2clientmanagerservice.OAuth2ClientManagerService === "undefined" ? Object : _oauth2clientmanagerservice.OAuth2ClientManagerService
    ])
], MicrosoftMessageOutboundService);

//# sourceMappingURL=microsoft-message-outbound.service.js.map