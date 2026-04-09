"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostgresCredentialsResolver", {
    enumerable: true,
    get: function() {
        return PostgresCredentialsResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _postgrescredentialsdto = require("./dtos/postgres-credentials.dto");
const _postgrescredentialsservice = require("./postgres-credentials.service");
const _workspaceentity = require("../workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
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
let PostgresCredentialsResolver = class PostgresCredentialsResolver {
    async enablePostgresProxy({ id: workspaceId }) {
        return this.postgresCredentialsService.enablePostgresProxy(workspaceId);
    }
    async disablePostgresProxy({ id: workspaceId }) {
        return this.postgresCredentialsService.disablePostgresProxy(workspaceId);
    }
    async getPostgresCredentials({ id: workspaceId }) {
        return this.postgresCredentialsService.getPostgresCredentials(workspaceId);
    }
    constructor(postgresCredentialsService){
        this.postgresCredentialsService = postgresCredentialsService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_postgrescredentialsdto.PostgresCredentialsDTO),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], PostgresCredentialsResolver.prototype, "enablePostgresProxy", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_postgrescredentialsdto.PostgresCredentialsDTO),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], PostgresCredentialsResolver.prototype, "disablePostgresProxy", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_postgrescredentialsdto.PostgresCredentialsDTO, {
        nullable: true
    }),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], PostgresCredentialsResolver.prototype, "getPostgresCredentials", null);
PostgresCredentialsResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_postgrescredentialsdto.PostgresCredentialsDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _postgrescredentialsservice.PostgresCredentialsService === "undefined" ? Object : _postgrescredentialsservice.PostgresCredentialsService
    ])
], PostgresCredentialsResolver);

//# sourceMappingURL=postgres-credentials.resolver.js.map