"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UserWorkspaceModule", {
    enumerable: true,
    get: function() {
        return UserWorkspaceModule;
    }
});
const _common = require("@nestjs/common");
const _nestjsquerygraphql = require("@ptc-org/nestjs-query-graphql");
const _nestjsquerytypeorm = require("@ptc-org/nestjs-query-typeorm");
const _typeormmodule = require("../../../database/typeorm/typeorm.module");
const _approvedaccessdomainmodule = require("../approved-access-domain/approved-access-domain.module");
const _tokenmodule = require("../auth/token/token.module");
const _workspacedomainsmodule = require("../domain/workspace-domains/workspace-domains.module");
const _enterprisemodule = require("../enterprise/enterprise.module");
const _featureflagmodule = require("../feature-flag/feature-flag.module");
const _filemodule = require("../file/file.module");
const _onboardingmodule = require("../onboarding/onboarding.module");
const _uploadprofilepicturepermissionguard = require("./guards/upload-profile-picture-permission.guard");
const _userworkspaceentitycacheproviderservice = require("./services/user-workspace-entity-cache-provider.service");
const _userworkspaceentity = require("./user-workspace.entity");
const _userworkspaceservice = require("./user-workspace.service");
const _userentity = require("../user/user.entity");
const _workspaceinvitationmodule = require("../workspace-invitation/workspace-invitation.module");
const _workspaceentity = require("../workspace/workspace.entity");
const _datasourcemodule = require("../../metadata-modules/data-source/data-source.module");
const _objectmetadataentity = require("../../metadata-modules/object-metadata/object-metadata.entity");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
const _roletargetentity = require("../../metadata-modules/role-target/role-target.entity");
const _rolevalidationmodule = require("../../metadata-modules/role-validation/role-validation.module");
const _userrolemodule = require("../../metadata-modules/user-role/user-role.module");
const _twentyormmodule = require("../../twenty-orm/twenty-orm.module");
const _workspacedatasourcemodule = require("../../workspace-datasource/workspace-datasource.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UserWorkspaceModule = class UserWorkspaceModule {
};
UserWorkspaceModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _nestjsquerygraphql.NestjsQueryGraphQLModule.forFeature({
                imports: [
                    _nestjsquerytypeorm.NestjsQueryTypeOrmModule.forFeature([
                        _userentity.UserEntity,
                        _userworkspaceentity.UserWorkspaceEntity,
                        _workspaceentity.WorkspaceEntity,
                        _roletargetentity.RoleTargetEntity
                    ]),
                    _rolevalidationmodule.RoleValidationModule,
                    _nestjsquerytypeorm.NestjsQueryTypeOrmModule.forFeature([
                        _objectmetadataentity.ObjectMetadataEntity
                    ]),
                    _typeormmodule.TypeORMModule,
                    _datasourcemodule.DataSourceModule,
                    _workspacedatasourcemodule.WorkspaceDataSourceModule,
                    _approvedaccessdomainmodule.ApprovedAccessDomainModule,
                    _workspaceinvitationmodule.WorkspaceInvitationModule,
                    _workspacedomainsmodule.WorkspaceDomainsModule,
                    _twentyormmodule.TwentyORMModule,
                    _userrolemodule.UserRoleModule,
                    _filemodule.FileModule,
                    _tokenmodule.TokenModule,
                    _permissionsmodule.PermissionsModule,
                    _onboardingmodule.OnboardingModule,
                    _enterprisemodule.EnterpriseModule,
                    _featureflagmodule.FeatureFlagModule
                ],
                services: [
                    _userworkspaceservice.UserWorkspaceService
                ]
            })
        ],
        exports: [
            _userworkspaceservice.UserWorkspaceService
        ],
        providers: [
            _userworkspaceservice.UserWorkspaceService,
            _userworkspaceentitycacheproviderservice.UserWorkspaceEntityCacheProviderService,
            _uploadprofilepicturepermissionguard.UploadProfilePicturePermissionGuard
        ]
    })
], UserWorkspaceModule);

//# sourceMappingURL=user-workspace.module.js.map