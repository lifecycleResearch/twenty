"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OAuthDiscoveryController", {
    enumerable: true,
    get: function() {
        return OAuthDiscoveryController;
    }
});
const _common = require("@nestjs/common");
const _oauthscopes = require("../constants/oauth-scopes");
const _applicationregistrationservice = require("../../application-registration/application-registration.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
const _nopermissionguard = require("../../../../guards/no-permission.guard");
const _publicendpointguard = require("../../../../guards/public-endpoint.guard");
const _domainserverconfigservice = require("../../../domain/domain-server-config/services/domain-server-config.service");
const _twentycliapplicationregistrationconstant = require("../../../../workspace-manager/twenty-standard-application/constants/twenty-cli-application-registration.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OAuthDiscoveryController = class OAuthDiscoveryController {
    async getAuthorizationServerMetadata() {
        const serverUrl = this.twentyConfigService.get('SERVER_URL');
        const frontUrl = this.domainServerConfigService.getFrontUrl().toString();
        const cliRegistration = await this.applicationRegistrationService.findOneByUniversalIdentifier(_twentycliapplicationregistrationconstant.TWENTY_CLI_APPLICATION_REGISTRATION.universalIdentifier);
        return {
            issuer: serverUrl,
            authorization_endpoint: `${frontUrl.replace(/\/$/, '')}/authorize`,
            token_endpoint: `${serverUrl}/oauth/token`,
            registration_endpoint: `${serverUrl}/oauth/register`,
            revocation_endpoint: `${serverUrl}/oauth/revoke`,
            introspection_endpoint: `${serverUrl}/oauth/introspect`,
            scopes_supported: _oauthscopes.ALL_OAUTH_SCOPES,
            response_types_supported: [
                'code'
            ],
            grant_types_supported: [
                'authorization_code',
                'client_credentials',
                'refresh_token'
            ],
            code_challenge_methods_supported: [
                'S256'
            ],
            token_endpoint_auth_methods_supported: [
                'client_secret_post',
                'none'
            ],
            revocation_endpoint_auth_methods_supported: [
                'client_secret_post'
            ],
            introspection_endpoint_auth_methods_supported: [
                'client_secret_post'
            ],
            ...cliRegistration ? {
                cli_client_id: cliRegistration.oAuthClientId
            } : {}
        };
    }
    // RFC 9728: OAuth 2.0 Protected Resource Metadata
    getProtectedResourceMetadata() {
        const serverUrl = this.twentyConfigService.get('SERVER_URL');
        return {
            resource: `${serverUrl}/mcp`,
            authorization_servers: [
                serverUrl
            ],
            scopes_supported: _oauthscopes.ALL_OAUTH_SCOPES,
            bearer_methods_supported: [
                'header'
            ]
        };
    }
    constructor(twentyConfigService, domainServerConfigService, applicationRegistrationService){
        this.twentyConfigService = twentyConfigService;
        this.domainServerConfigService = domainServerConfigService;
        this.applicationRegistrationService = applicationRegistrationService;
    }
};
_ts_decorate([
    (0, _common.Get)('oauth-authorization-server'),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], OAuthDiscoveryController.prototype, "getAuthorizationServerMetadata", null);
_ts_decorate([
    (0, _common.Get)('oauth-protected-resource'),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], OAuthDiscoveryController.prototype, "getProtectedResourceMetadata", null);
OAuthDiscoveryController = _ts_decorate([
    (0, _common.Controller)('.well-known'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _domainserverconfigservice.DomainServerConfigService === "undefined" ? Object : _domainserverconfigservice.DomainServerConfigService,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService
    ])
], OAuthDiscoveryController);

//# sourceMappingURL=oauth-discovery.controller.js.map