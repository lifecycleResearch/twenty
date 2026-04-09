"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailComposerService", {
    enumerable: true,
    get: function() {
        return EmailComposerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _render = require("@react-email/render");
const _dompurify = /*#__PURE__*/ _interop_require_default(require("dompurify"));
const _twentyemails = require("twenty-emails");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _zod = require("zod");
const _fileentity = require("../../../file/entities/file.entity");
const _fileservice = require("../../../file/services/file.service");
const _emailtoolexception = require("./exceptions/email-tool.exception");
const _parsecommaseparatedemailsutil = require("./utils/parse-comma-separated-emails.util");
const _connectedaccountdataaccessservice = require("../../../../metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../twenty-orm/utils/build-system-auth-context.util");
const _messagingaccountauthenticationservice = require("../../../../../modules/messaging/message-import-manager/services/messaging-account-authentication.service");
const _parseemailbody = require("../../../../../utils/parse-email-body");
const _streamtobuffer = require("../../../../../utils/stream-to-buffer");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let EmailComposerService = class EmailComposerService {
    async getConnectedAccount(connectedAccountId, workspaceId) {
        if (!(0, _utils.isValidUuid)(connectedAccountId)) {
            throw new _emailtoolexception.EmailToolException(`Connected Account ID is not a valid UUID`, _emailtoolexception.EmailToolExceptionCode.INVALID_CONNECTED_ACCOUNT_ID);
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const connectedAccount = await this.connectedAccountDataAccessService.findOne(workspaceId, {
                where: {
                    id: connectedAccountId
                },
                relations: {
                    messageChannels: {
                        messageFolders: true
                    }
                }
            });
            if (!(0, _utils.isDefined)(connectedAccount)) {
                throw new _emailtoolexception.EmailToolException(`Connected Account '${connectedAccountId}' not found`, _emailtoolexception.EmailToolExceptionCode.CONNECTED_ACCOUNT_NOT_FOUND);
            }
            return connectedAccount;
        }, authContext);
    }
    async getOrThrowFirstConnectedAccountId(workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const allAccounts = await this.connectedAccountDataAccessService.find(workspaceId);
            if (!allAccounts || allAccounts.length === 0) {
                throw new _emailtoolexception.EmailToolException('No connected accounts found for this workspace', _emailtoolexception.EmailToolExceptionCode.CONNECTED_ACCOUNT_NOT_FOUND);
            }
            return allAccounts[0].id;
        }, authContext);
    }
    normalizeRecipients(parameters) {
        if (!parameters.recipients || !parameters.recipients.to || parameters.recipients.to.trim().length === 0) {
            throw new _emailtoolexception.EmailToolException('No recipients specified', _emailtoolexception.EmailToolExceptionCode.INVALID_EMAIL);
        }
        const to = (0, _parsecommaseparatedemailsutil.parseCommaSeparatedEmails)(parameters.recipients.to);
        if (to.length === 0) {
            throw new _emailtoolexception.EmailToolException('No valid recipients specified', _emailtoolexception.EmailToolExceptionCode.INVALID_EMAIL);
        }
        return {
            to,
            cc: (0, _parsecommaseparatedemailsutil.parseCommaSeparatedEmails)(parameters.recipients.cc),
            bcc: (0, _parsecommaseparatedemailsutil.parseCommaSeparatedEmails)(parameters.recipients.bcc)
        };
    }
    validateEmails(recipients) {
        const emailSchema = _zod.z.string().trim().pipe(_zod.z.email());
        const invalidEmails = [];
        const allEmails = [
            ...recipients.to,
            ...recipients.cc,
            ...recipients.bcc
        ];
        for (const email of allEmails){
            const result = emailSchema.safeParse(email);
            if (!result.success) {
                invalidEmails.push(email);
            }
        }
        return invalidEmails;
    }
    async getAttachments(files, workspaceId) {
        if (files.length === 0) {
            return [];
        }
        const fileIds = files.map((file)=>file.id);
        const fileEntities = await this.fileRepository.find({
            where: {
                id: (0, _typeorm1.In)(fileIds)
            }
        });
        const fileEntityMap = new Map(fileEntities.map((entity)=>[
                entity.id,
                entity
            ]));
        const filesNotFound = [];
        for (const fileMetadata of files){
            if (!fileEntityMap.has(fileMetadata.id)) {
                filesNotFound.push(`${fileMetadata.name} (${fileMetadata.id})`);
            }
        }
        if (filesNotFound.length > 0) {
            throw new _emailtoolexception.EmailToolException(`Files not found: ${filesNotFound.join(', ')}`, _emailtoolexception.EmailToolExceptionCode.FILE_NOT_FOUND);
        }
        const attachments = [];
        for (const fileMetadata of files){
            const { stream } = await this.fileService.getFileStreamById({
                fileId: fileMetadata.id,
                workspaceId,
                fileFolder: _types.FileFolder.Workflow
            });
            const buffer = await (0, _streamtobuffer.streamToBuffer)(stream);
            attachments.push({
                filename: fileMetadata.name,
                content: buffer,
                contentType: fileMetadata.type
            });
        }
        return attachments;
    }
    async composeEmail(parameters, context) {
        const { workspaceId } = context;
        const { subject, body, files, inReplyTo } = parameters;
        let { connectedAccountId } = parameters;
        let recipients;
        try {
            recipients = this.normalizeRecipients(parameters);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Invalid recipients';
            return {
                success: false,
                output: {
                    success: false,
                    message: errorMessage,
                    error: errorMessage
                }
            };
        }
        const invalidEmails = this.validateEmails(recipients);
        if (invalidEmails.length > 0) {
            return {
                success: false,
                output: {
                    success: false,
                    message: `Invalid email addresses: ${invalidEmails.join(', ')}`,
                    error: `Invalid email addresses: ${invalidEmails.join(', ')}`
                }
            };
        }
        const toRecipientsDisplay = recipients.to.join(', ');
        if (!connectedAccountId) {
            connectedAccountId = await this.getOrThrowFirstConnectedAccountId(workspaceId);
        }
        const connectedAccount = await this.getConnectedAccount(connectedAccountId, workspaceId);
        const messageChannel = connectedAccount.messageChannels.find((channel)=>channel.handle === connectedAccount.handle);
        if (!(0, _utils.isDefined)(messageChannel)) {
            throw new _emailtoolexception.EmailToolException(`No message channel found for connected account '${connectedAccountId}'`, _emailtoolexception.EmailToolExceptionCode.CONNECTED_ACCOUNT_NOT_FOUND);
        }
        const { accessToken, refreshToken } = await this.messagingAccountAuthenticationService.validateAndRefreshConnectedAccountAuthentication({
            connectedAccount,
            workspaceId,
            messageChannelId: messageChannel.id
        });
        const connectedAccountWithFreshTokens = {
            ...connectedAccount,
            accessToken,
            refreshToken
        };
        const attachments = await this.getAttachments(files || [], workspaceId);
        const parsedBody = (0, _parseemailbody.parseEmailBody)(body);
        const reactMarkup = (0, _twentyemails.reactMarkupFromJSON)(parsedBody);
        const htmlBody = await (0, _render.render)(reactMarkup);
        const plainTextBody = (0, _render.toPlainText)(htmlBody);
        const { JSDOM } = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("jsdom")));
        const window = new JSDOM('').window;
        const purify = (0, _dompurify.default)(window);
        const sanitizedHtmlBody = purify.sanitize(htmlBody || '');
        const sanitizedSubject = purify.sanitize(subject || '');
        return {
            success: true,
            data: {
                recipients,
                toRecipientsDisplay,
                sanitizedSubject,
                plainTextBody,
                sanitizedHtmlBody,
                attachments,
                connectedAccount: connectedAccountWithFreshTokens,
                inReplyTo
            }
        };
    }
    constructor(globalWorkspaceOrmManager, connectedAccountDataAccessService, messagingAccountAuthenticationService, fileRepository, fileService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
        this.messagingAccountAuthenticationService = messagingAccountAuthenticationService;
        this.fileRepository = fileRepository;
        this.fileService = fileService;
        this.logger = new _common.Logger(EmailComposerService.name);
    }
};
EmailComposerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_fileentity.FileEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService,
        typeof _messagingaccountauthenticationservice.MessagingAccountAuthenticationService === "undefined" ? Object : _messagingaccountauthenticationservice.MessagingAccountAuthenticationService,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _fileservice.FileService === "undefined" ? Object : _fileservice.FileService
    ])
], EmailComposerService);

//# sourceMappingURL=email-composer.service.js.map