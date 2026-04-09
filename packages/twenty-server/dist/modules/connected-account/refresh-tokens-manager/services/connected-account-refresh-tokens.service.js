"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountRefreshTokensService", {
    enumerable: true,
    get: function() {
        return ConnectedAccountRefreshTokensService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _connectedaccountdataaccessservice = require("../../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _googleapirefreshtokensservice = require("../drivers/google/services/google-api-refresh-tokens.service");
const _microsoftapirefreshtokensservice = require("../drivers/microsoft/services/microsoft-api-refresh-tokens.service");
const _connectedaccountrefreshtokensexception = require("../exceptions/connected-account-refresh-tokens.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const CONNECTED_ACCOUNT_ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60;
let ConnectedAccountRefreshTokensService = class ConnectedAccountRefreshTokensService {
    async refreshAndSaveTokens(connectedAccount, workspaceId) {
        const { refreshToken, accessToken } = connectedAccount;
        if (!refreshToken) {
            throw new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException(`No refresh token found for connected account ${connectedAccount.id} in workspace ${workspaceId}`, _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.REFRESH_TOKEN_NOT_FOUND);
        }
        const isAccessTokenValid = await this.isAccessTokenStillValid(connectedAccount);
        if (isAccessTokenValid) {
            this.logger.debug(`Reusing valid access token for connected account ${connectedAccount.id.slice(0, 7)} in workspace ${workspaceId.slice(0, 7)}`);
            if (!(0, _utils.isDefined)(accessToken)) {
                throw new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException(`Access token is required for connected account ${connectedAccount.id} in workspace ${workspaceId}`, _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.ACCESS_TOKEN_NOT_FOUND);
            }
            return {
                accessToken,
                refreshToken
            };
        }
        this.logger.debug(`Access token expired for connected account ${connectedAccount.id} in workspace ${workspaceId}, refreshing...`);
        const connectedAccountTokens = await this.refreshTokens(connectedAccount, refreshToken, workspaceId);
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.connectedAccountDataAccessService.update(workspaceId, {
                id: connectedAccount.id
            }, {
                ...connectedAccountTokens,
                lastCredentialsRefreshedAt: new Date()
            });
        }, authContext);
        return connectedAccountTokens;
    }
    async isAccessTokenStillValid(connectedAccount) {
        switch(connectedAccount.provider){
            case _types.ConnectedAccountProvider.GOOGLE:
            case _types.ConnectedAccountProvider.MICROSOFT:
                {
                    if (!connectedAccount.lastCredentialsRefreshedAt) {
                        return false;
                    }
                    const BUFFER_TIME = 5 * 60 * 1000;
                    const tokenExpirationTime = CONNECTED_ACCOUNT_ACCESS_TOKEN_EXPIRATION - BUFFER_TIME;
                    return connectedAccount.lastCredentialsRefreshedAt > new Date(Date.now() - tokenExpirationTime);
                }
            case _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV:
            case _types.ConnectedAccountProvider.OIDC:
            case _types.ConnectedAccountProvider.SAML:
                return true;
            default:
                return (0, _utils.assertUnreachable)(connectedAccount.provider, `Provider ${connectedAccount.provider} not supported`);
        }
    }
    async refreshTokens(connectedAccount, refreshToken, workspaceId) {
        try {
            switch(connectedAccount.provider){
                case _types.ConnectedAccountProvider.GOOGLE:
                    return await this.googleAPIRefreshAccessTokenService.refreshTokens(refreshToken);
                case _types.ConnectedAccountProvider.MICROSOFT:
                    return await this.microsoftAPIRefreshAccessTokenService.refreshTokens(refreshToken);
                case _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV:
                case _types.ConnectedAccountProvider.OIDC:
                case _types.ConnectedAccountProvider.SAML:
                    throw new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException(`Token refresh is not supported for ${connectedAccount.provider} provider for connected account ${connectedAccount.id} in workspace ${workspaceId}`, _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.PROVIDER_NOT_SUPPORTED);
                default:
                    return (0, _utils.assertUnreachable)(connectedAccount.provider, `Provider ${connectedAccount.provider} not supported`);
            }
        } catch (error) {
            this.logger.log(`Error while refreshing tokens on connected account ${connectedAccount.id} in workspace ${workspaceId}`, error);
            throw error;
        }
    }
    constructor(googleAPIRefreshAccessTokenService, microsoftAPIRefreshAccessTokenService, globalWorkspaceOrmManager, connectedAccountDataAccessService){
        this.googleAPIRefreshAccessTokenService = googleAPIRefreshAccessTokenService;
        this.microsoftAPIRefreshAccessTokenService = microsoftAPIRefreshAccessTokenService;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
        this.logger = new _common.Logger(ConnectedAccountRefreshTokensService.name);
    }
};
ConnectedAccountRefreshTokensService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _googleapirefreshtokensservice.GoogleAPIRefreshAccessTokenService === "undefined" ? Object : _googleapirefreshtokensservice.GoogleAPIRefreshAccessTokenService,
        typeof _microsoftapirefreshtokensservice.MicrosoftAPIRefreshAccessTokenService === "undefined" ? Object : _microsoftapirefreshtokensservice.MicrosoftAPIRefreshAccessTokenService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService
    ])
], ConnectedAccountRefreshTokensService);

//# sourceMappingURL=connected-account-refresh-tokens.service.js.map