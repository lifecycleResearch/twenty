"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationInstallResolver", {
    enumerable: true,
    get: function() {
        return ApplicationInstallResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _applicationexceptionfilter = require("../application-exception-filter");
const _applicationservice = require("../application.service");
const _applicationinstallservice = require("./application-install.service");
const _applicationdto = require("../dtos/application.dto");
const _authgraphqlapiexceptionfilter = require("../../auth/filters/auth-graphql-api-exception.filter");
const _resolvervalidationpipe = require("../../graphql/pipes/resolver-validation.pipe");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
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
let ApplicationInstallResolver = class ApplicationInstallResolver {
    async findManyApplications({ id: workspaceId }) {
        return this.applicationService.findManyApplications(workspaceId);
    }
    async findOneApplication({ id: workspaceId }, id, universalIdentifier) {
        return await this.applicationService.findOneApplicationOrThrow({
            id,
            universalIdentifier,
            workspaceId
        });
    }
    async installApplication(appRegistrationId, version, { id: workspaceId }) {
        return this.applicationInstallService.installApplication({
            appRegistrationId,
            version,
            workspaceId
        });
    }
    constructor(applicationService, applicationInstallService){
        this.applicationService = applicationService;
        this.applicationInstallService = applicationInstallService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _applicationdto.ApplicationDTO
        ]),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationInstallResolver.prototype, "findManyApplications", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_applicationdto.ApplicationDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)('id', {
        type: ()=>_scalars.UUIDScalarType,
        nullable: true
    })),
    _ts_param(2, (0, _graphql.Args)('universalIdentifier', {
        type: ()=>_scalars.UUIDScalarType,
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationInstallResolver.prototype, "findOneApplication", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_param(0, (0, _graphql.Args)('appRegistrationId')),
    _ts_param(1, (0, _graphql.Args)('version', {
        type: ()=>String,
        nullable: true
    })),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationInstallResolver.prototype, "installApplication", null);
ApplicationInstallResolver = _ts_decorate([
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseFilters)(_applicationexceptionfilter.ApplicationExceptionFilter, _authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _applicationinstallservice.ApplicationInstallService === "undefined" ? Object : _applicationinstallservice.ApplicationInstallService
    ])
], ApplicationInstallResolver);

//# sourceMappingURL=application-install.resolver.js.map