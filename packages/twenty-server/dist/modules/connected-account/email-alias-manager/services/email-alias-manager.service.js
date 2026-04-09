"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailAliasManagerService", {
    enumerable: true,
    get: function() {
        return EmailAliasManagerService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _connectedaccountdataaccessservice = require("../../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _googleemailaliasmanagerservice = require("../drivers/google/services/google-email-alias-manager.service");
const _microsoftemailaliasmanagerservice = require("../drivers/microsoft/services/microsoft-email-alias-manager.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EmailAliasManagerService = class EmailAliasManagerService {
    async refreshHandleAliases(connectedAccount, workspaceId) {
        let handleAliases;
        switch(connectedAccount.provider){
            case _types.ConnectedAccountProvider.MICROSOFT:
                handleAliases = await this.microsoftEmailAliasManagerService.getHandleAliases(connectedAccount);
                break;
            case _types.ConnectedAccountProvider.GOOGLE:
                handleAliases = await this.googleEmailAliasManagerService.getHandleAliases(connectedAccount);
                break;
            case _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV:
            case _types.ConnectedAccountProvider.OIDC:
            case _types.ConnectedAccountProvider.SAML:
                handleAliases = [];
                break;
            default:
                (0, _utils.assertUnreachable)(connectedAccount.provider, `Email alias manager for provider ${connectedAccount.provider} is not implemented`);
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.connectedAccountDataAccessService.update(workspaceId, {
                id: connectedAccount.id
            }, {
                handleAliases: handleAliases.join(',')
            });
        }, authContext);
    }
    constructor(googleEmailAliasManagerService, microsoftEmailAliasManagerService, globalWorkspaceOrmManager, connectedAccountDataAccessService){
        this.googleEmailAliasManagerService = googleEmailAliasManagerService;
        this.microsoftEmailAliasManagerService = microsoftEmailAliasManagerService;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
    }
};
EmailAliasManagerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googleemailaliasmanagerservice.GoogleEmailAliasManagerService === "undefined" ? Object : _googleemailaliasmanagerservice.GoogleEmailAliasManagerService,
        typeof _microsoftemailaliasmanagerservice.MicrosoftEmailAliasManagerService === "undefined" ? Object : _microsoftemailaliasmanagerservice.MicrosoftEmailAliasManagerService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService
    ])
], EmailAliasManagerService);

//# sourceMappingURL=email-alias-manager.service.js.map