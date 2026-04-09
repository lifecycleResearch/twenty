"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SendEmailTool", {
    enumerable: true,
    get: function() {
        return SendEmailTool;
    }
});
const _common = require("@nestjs/common");
const _emailcomposerservice = require("./email-composer.service");
const _emailtoolschema = require("./email-tool.schema");
const _emailtoolexception = require("./exceptions/email-tool.exception");
const _messagingmessageoutboundservice = require("../../../../../modules/messaging/message-outbound-manager/services/messaging-message-outbound.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SendEmailTool = class SendEmailTool {
    async execute(parameters, context) {
        try {
            const result = await this.emailComposerService.composeEmail(parameters, context);
            if (!result.success) {
                return result.output;
            }
            const { data } = result;
            await this.sendEmail(data);
            this.logger.log(`Email sent successfully to ${data.toRecipientsDisplay}${data.attachments.length > 0 ? ` with ${data.attachments.length} attachments` : ''}`);
            return {
                success: true,
                message: `Email sent successfully to ${data.toRecipientsDisplay}`,
                result: {
                    recipients: data.recipients.to,
                    ccRecipients: data.recipients.cc,
                    bccRecipients: data.recipients.bcc,
                    subject: data.sanitizedSubject,
                    connectedAccountId: data.connectedAccount.id,
                    attachmentCount: data.attachments.length
                }
            };
        } catch (error) {
            if (error instanceof _emailtoolexception.EmailToolException) {
                return {
                    success: false,
                    message: 'Failed to send email',
                    error: error.message
                };
            }
            this.logger.error(`Failed to send email: ${error}`);
            return {
                success: false,
                message: 'Failed to send email',
                error: error instanceof Error ? error.message : 'Failed to send email'
            };
        }
    }
    async sendEmail(data) {
        await this.messageOutboundService.sendMessage({
            to: data.recipients.to,
            cc: data.recipients.cc.length > 0 ? data.recipients.cc : undefined,
            bcc: data.recipients.bcc.length > 0 ? data.recipients.bcc : undefined,
            subject: data.sanitizedSubject,
            body: data.plainTextBody,
            html: data.sanitizedHtmlBody,
            attachments: data.attachments,
            inReplyTo: data.inReplyTo
        }, data.connectedAccount);
    }
    constructor(emailComposerService, messageOutboundService){
        this.emailComposerService = emailComposerService;
        this.messageOutboundService = messageOutboundService;
        this.logger = new _common.Logger(SendEmailTool.name);
        this.description = 'Send an email using a connected account. Requires SEND_EMAIL_TOOL permission.';
        this.inputSchema = _emailtoolschema.EmailToolInputZodSchema;
    }
};
SendEmailTool = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _emailcomposerservice.EmailComposerService === "undefined" ? Object : _emailcomposerservice.EmailComposerService,
        typeof _messagingmessageoutboundservice.MessagingMessageOutboundService === "undefined" ? Object : _messagingmessageoutboundservice.MessagingMessageOutboundService
    ])
], SendEmailTool);

//# sourceMappingURL=send-email-tool.js.map