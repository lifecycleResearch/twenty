"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountResolver", {
    enumerable: true,
    get: function() {
        return ConnectedAccountResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _workspaceentity = require("../../../core-modules/workspace/workspace.entity");
const _authuserworkspaceiddecorator = require("../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _featureflagguard = require("../../../guards/feature-flag.guard");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _connectedaccountmetadataservice = require("../connected-account-metadata.service");
const _connectedaccountdto = require("../dtos/connected-account.dto");
const _connectedaccountgraphqlapiexceptioninterceptor = require("../interceptors/connected-account-graphql-api-exception.interceptor");
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
let ConnectedAccountResolver = class ConnectedAccountResolver {
    async myConnectedAccounts(workspace, userWorkspaceId) {
        return this.connectedAccountMetadataService.findByUserWorkspaceId({
            userWorkspaceId,
            workspaceId: workspace.id
        });
    }
    async connectedAccounts(workspace) {
        return this.connectedAccountMetadataService.findAll(workspace.id);
    }
    async deleteConnectedAccount(id, workspace, userWorkspaceId) {
        await this.connectedAccountMetadataService.verifyOwnership({
            id,
            userWorkspaceId,
            workspaceId: workspace.id
        });
        return this.connectedAccountMetadataService.delete({
            id,
            workspaceId: workspace.id
        });
    }
    constructor(connectedAccountMetadataService){
        this.connectedAccountMetadataService = connectedAccountMetadataService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _connectedaccountdto.ConnectedAccountDTO
        ]),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_CONNECTED_ACCOUNT_MIGRATED),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ConnectedAccountResolver.prototype, "myConnectedAccounts", null);
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _connectedaccountdto.ConnectedAccountDTO
        ]),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.CONNECTED_ACCOUNTS)),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_CONNECTED_ACCOUNT_MIGRATED),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ConnectedAccountResolver.prototype, "connectedAccounts", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_connectedaccountdto.ConnectedAccountDTO),
    (0, _common.UseGuards)(_nopermissionguard.NoPermissionGuard),
    (0, _featureflagguard.RequireFeatureFlag)(_types.FeatureFlagKey.IS_CONNECTED_ACCOUNT_MIGRATED),
    _ts_param(0, (0, _graphql.Args)('id', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ConnectedAccountResolver.prototype, "deleteConnectedAccount", null);
ConnectedAccountResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _featureflagguard.FeatureFlagGuard),
    (0, _common.UseInterceptors)(_connectedaccountgraphqlapiexceptioninterceptor.ConnectedAccountGraphqlApiExceptionInterceptor),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_connectedaccountdto.ConnectedAccountDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _connectedaccountmetadataservice.ConnectedAccountMetadataService === "undefined" ? Object : _connectedaccountmetadataservice.ConnectedAccountMetadataService
    ])
], ConnectedAccountResolver);

//# sourceMappingURL=connected-account.resolver.js.map