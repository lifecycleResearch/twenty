"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MarketplaceResolver", {
    enumerable: true,
    get: function() {
        return MarketplaceResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _constants = require("twenty-shared/constants");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _applicationregistrationexceptionfilter = require("../application-registration/application-registration-exception-filter");
const _applicationinstallservice = require("../application-install/application-install.service");
const _marketplaceappdto = require("./dtos/marketplace-app.dto");
const _marketplacequeryservice = require("./marketplace-query.service");
const _workspaceentity = require("../../workspace/workspace.entity");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _userauthguard = require("../../../guards/user-auth.guard");
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
let MarketplaceResolver = class MarketplaceResolver {
    async findManyMarketplaceApps() {
        return this.marketplaceQueryService.findManyMarketplaceApps();
    }
    async findOneMarketplaceApp(universalIdentifier) {
        return this.marketplaceQueryService.findOneMarketplaceApp(universalIdentifier);
    }
    async installMarketplaceApp(universalIdentifier, version, workspace) {
        const registration = await this.marketplaceQueryService.findRegistrationByUniversalIdentifier(universalIdentifier);
        return this.applicationInstallService.installApplication({
            appRegistrationId: registration.id,
            version,
            workspaceId: workspace.id
        });
    }
    constructor(marketplaceQueryService, applicationInstallService){
        this.marketplaceQueryService = marketplaceQueryService;
        this.applicationInstallService = applicationInstallService;
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _marketplaceappdto.MarketplaceAppDTO
        ]),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], MarketplaceResolver.prototype, "findManyMarketplaceApps", null);
_ts_decorate([
    (0, _graphql.Query)(()=>_marketplaceappdto.MarketplaceAppDTO),
    _ts_param(0, (0, _graphql.Args)('universalIdentifier')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], MarketplaceResolver.prototype, "findOneMarketplaceApp", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>Boolean),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.MARKETPLACE_APPS)),
    _ts_param(0, (0, _graphql.Args)('universalIdentifier')),
    _ts_param(1, (0, _graphql.Args)('version', {
        type: ()=>String,
        nullable: true
    })),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object,
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], MarketplaceResolver.prototype, "installMarketplaceApp", null);
MarketplaceResolver = _ts_decorate([
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseFilters)(_applicationregistrationexceptionfilter.ApplicationRegistrationExceptionFilter),
    (0, _common.UseGuards)(_userauthguard.UserAuthGuard, _workspaceauthguard.WorkspaceAuthGuard, _nopermissionguard.NoPermissionGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _marketplacequeryservice.MarketplaceQueryService === "undefined" ? Object : _marketplacequeryservice.MarketplaceQueryService,
        typeof _applicationinstallservice.ApplicationInstallService === "undefined" ? Object : _applicationinstallservice.ApplicationInstallService
    ])
], MarketplaceResolver);

//# sourceMappingURL=marketplace.resolver.js.map