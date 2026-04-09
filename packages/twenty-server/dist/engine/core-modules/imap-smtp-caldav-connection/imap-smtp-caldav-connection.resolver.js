"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImapSmtpCaldavResolver", {
    enumerable: true,
    get: function() {
        return ImapSmtpCaldavResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _scalars = require("../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _authgraphqlapiexceptionfilter = require("../auth/filters/auth-graphql-api-exception.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _graphqlerrorsutil = require("../graphql/utils/graphql-errors.util");
const _imapsmtpcaldavconnectedaccountdto = require("./dtos/imap-smtp-caldav-connected-account.dto");
const _imapsmtpcaldavconnectionsuccessdto = require("./dtos/imap-smtp-caldav-connection-success.dto");
const _imapsmtpcaldavconnectiondto = require("./dtos/imap-smtp-caldav-connection.dto");
const _imapsmtpcaldavconnectionvalidatorservice = require("./services/imap-smtp-caldav-connection-validator.service");
const _imapsmtpcaldavconnectionservice = require("./services/imap-smtp-caldav-connection.service");
const _workspaceentity = require("../workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _permissionsgraphqlapiexceptionfilter = require("../../metadata-modules/permissions/utils/permissions-graphql-api-exception.filter");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _imapsmtpcaldavapisservice = require("../../../modules/connected-account/services/imap-smtp-caldav-apis.service");
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
let ImapSmtpCaldavResolver = class ImapSmtpCaldavResolver {
    async getConnectedImapSmtpCaldavAccount(id, workspace) {
        const connectedAccount = await this.imapSmtpCaldavApisService.getImapSmtpCaldavConnectedAccount(workspace.id, id);
        if (!(0, _utils.isDefined)(connectedAccount) || !(0, _utils.isDefined)(connectedAccount?.handle)) {
            throw new _graphqlerrorsutil.UserInputError(`Connected mail account with ID ${id} not found`);
        }
        return {
            id: connectedAccount.id,
            handle: connectedAccount.handle,
            provider: connectedAccount.provider,
            connectionParameters: connectedAccount.connectionParameters,
            accountOwnerId: connectedAccount.accountOwnerId
        };
    }
    async saveImapSmtpCaldavAccount(accountOwnerId, handle, connectionParameters, workspace, id) {
        const validatedParams = await this.validateAndTestConnectionParameters(connectionParameters, handle);
        const connectedAccountId = await this.imapSmtpCaldavApisService.processAccount({
            handle,
            workspaceMemberId: accountOwnerId,
            workspaceId: workspace.id,
            connectionParameters: validatedParams,
            connectedAccountId: id
        });
        return {
            success: true,
            connectedAccountId
        };
    }
    async validateAndTestConnectionParameters(connectionParameters, handle) {
        const validatedParams = {};
        const protocols = [
            'IMAP',
            'SMTP',
            'CALDAV'
        ];
        for (const protocol of protocols){
            const params = connectionParameters[protocol];
            if (params) {
                validatedParams[protocol] = await this.mailConnectionValidatorService.validateProtocolConnectionParams(params);
                const validatedProtocolParams = validatedParams[protocol];
                if (validatedProtocolParams) {
                    await this.ImapSmtpCaldavConnectionService.testImapSmtpCaldav(handle, validatedProtocolParams, protocol);
                }
            }
        }
        return validatedParams;
    }
    constructor(ImapSmtpCaldavConnectionService, imapSmtpCaldavApisService, mailConnectionValidatorService){
        this.ImapSmtpCaldavConnectionService = ImapSmtpCaldavConnectionService;
        this.imapSmtpCaldavApisService = imapSmtpCaldavApisService;
        this.mailConnectionValidatorService = mailConnectionValidatorService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>_imapsmtpcaldavconnectedaccountdto.ConnectedImapSmtpCaldavAccountDTO),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.CONNECTED_ACCOUNTS)),
    _ts_param(0, (0, _graphql.Args)('id', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ImapSmtpCaldavResolver.prototype, "getConnectedImapSmtpCaldavAccount", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_imapsmtpcaldavconnectionsuccessdto.ImapSmtpCaldavConnectionSuccessDTO),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.CONNECTED_ACCOUNTS)),
    _ts_param(0, (0, _graphql.Args)('accountOwnerId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _graphql.Args)('handle')),
    _ts_param(2, (0, _graphql.Args)('connectionParameters')),
    _ts_param(3, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(4, (0, _graphql.Args)('id', {
        type: ()=>_scalars.UUIDScalarType,
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof _imapsmtpcaldavconnectiondto.EmailAccountConnectionParameters === "undefined" ? Object : _imapsmtpcaldavconnectiondto.EmailAccountConnectionParameters,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ImapSmtpCaldavResolver.prototype, "saveImapSmtpCaldavAccount", null);
ImapSmtpCaldavResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter, _permissionsgraphqlapiexceptionfilter.PermissionsGraphqlApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _imapsmtpcaldavconnectionservice.ImapSmtpCaldavService === "undefined" ? Object : _imapsmtpcaldavconnectionservice.ImapSmtpCaldavService,
        typeof _imapsmtpcaldavapisservice.ImapSmtpCalDavAPIService === "undefined" ? Object : _imapsmtpcaldavapisservice.ImapSmtpCalDavAPIService,
        typeof _imapsmtpcaldavconnectionvalidatorservice.ImapSmtpCaldavValidatorService === "undefined" ? Object : _imapsmtpcaldavconnectionvalidatorservice.ImapSmtpCaldavValidatorService
    ])
], ImapSmtpCaldavResolver);

//# sourceMappingURL=imap-smtp-caldav-connection.resolver.js.map