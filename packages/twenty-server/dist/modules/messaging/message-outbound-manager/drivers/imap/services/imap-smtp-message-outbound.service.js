"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImapSmtpMessageOutboundService", {
    enumerable: true,
    get: function() {
        return ImapSmtpMessageOutboundService;
    }
});
const _common = require("@nestjs/common");
const _mailcomposer = /*#__PURE__*/ _interop_require_default(require("nodemailer/lib/mail-composer"));
const _utils = require("twenty-shared/utils");
const _imapclientprovider = require("../../../../message-import-manager/drivers/imap/providers/imap-client.provider");
const _imapfinddraftsfolderservice = require("../../../../message-import-manager/drivers/imap/services/imap-find-drafts-folder.service");
const _smtpclientprovider = require("../../../../message-import-manager/drivers/smtp/providers/smtp-client.provider");
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
let ImapSmtpMessageOutboundService = class ImapSmtpMessageOutboundService {
    async sendMessage(sendMessageInput, connectedAccount) {
        const { handle, connectionParameters, messageChannels } = connectedAccount;
        const smtpClient = await this.smtpClientProvider.getSmtpClient(connectedAccount);
        this.assertHandleIsDefined(handle);
        const messageBuffer = await this.compileRawMessage(handle, sendMessageInput);
        await smtpClient.sendMail({
            from: handle,
            to: sendMessageInput.to,
            cc: sendMessageInput.cc,
            bcc: sendMessageInput.bcc,
            raw: messageBuffer
        });
        if ((0, _utils.isDefined)(connectionParameters?.IMAP)) {
            const imapClient = await this.imapClientProvider.getClient(connectedAccount);
            const messageChannel = messageChannels.find((channel)=>channel.handle === handle);
            const sentFolder = messageChannel?.messageFolders.find((messageFolder)=>messageFolder.isSentFolder);
            if ((0, _utils.isDefined)(sentFolder) && (0, _utils.isDefined)(sentFolder.name)) {
                await imapClient.append(sentFolder.name, messageBuffer);
            }
            await this.imapClientProvider.closeClient(imapClient);
        }
    }
    async createDraft(sendMessageInput, connectedAccount) {
        const { handle, connectionParameters } = connectedAccount;
        this.assertHandleIsDefined(handle);
        if (!(0, _utils.isDefined)(connectionParameters?.IMAP)) {
            throw new Error('IMAP connection is required to create drafts');
        }
        const messageBuffer = await this.compileRawMessage(handle, sendMessageInput);
        const imapClient = await this.imapClientProvider.getClient(connectedAccount);
        try {
            const draftsFolder = await this.imapFindDraftsFolderService.findOrCreateDraftsFolder(imapClient);
            if (!(0, _utils.isDefined)(draftsFolder)) {
                throw new Error('No drafts folder found and could not create one');
            }
            const DRAFT_FLAG = '\\Draft';
            await imapClient.append(draftsFolder.path, messageBuffer, [
                DRAFT_FLAG
            ]);
        } finally{
            await this.imapClientProvider.closeClient(imapClient);
        }
    }
    async compileRawMessage(from, sendMessageInput) {
        const mail = new _mailcomposer.default((0, _tomailcomposeroptionsutil.toMailComposerOptions)(from, sendMessageInput));
        return mail.compile().build();
    }
    assertHandleIsDefined(handle) {
        if (!(0, _utils.isDefined)(handle)) {
            throw new Error('Handle is required');
        }
    }
    constructor(smtpClientProvider, imapClientProvider, imapFindDraftsFolderService){
        this.smtpClientProvider = smtpClientProvider;
        this.imapClientProvider = imapClientProvider;
        this.imapFindDraftsFolderService = imapFindDraftsFolderService;
    }
};
ImapSmtpMessageOutboundService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _smtpclientprovider.SmtpClientProvider === "undefined" ? Object : _smtpclientprovider.SmtpClientProvider,
        typeof _imapclientprovider.ImapClientProvider === "undefined" ? Object : _imapclientprovider.ImapClientProvider,
        typeof _imapfinddraftsfolderservice.ImapFindDraftsFolderService === "undefined" ? Object : _imapfinddraftsfolderservice.ImapFindDraftsFolderService
    ])
], ImapSmtpMessageOutboundService);

//# sourceMappingURL=imap-smtp-message-outbound.service.js.map