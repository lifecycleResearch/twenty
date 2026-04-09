"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMemberUpdateOnePreQueryHook", {
    enumerable: true,
    get: function() {
        return WorkspaceMemberUpdateOnePreQueryHook;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _classvalidator = require("class-validator");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _workspacequeryhookdecorator = require("../../../engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator");
const _coreentitycacheservice = require("../../../engine/core-entity-cache/services/core-entity-cache.service");
const _authexception = require("../../../engine/core-modules/auth/auth.exception");
const _isapikeyauthcontextguard = require("../../../engine/core-modules/auth/guards/is-api-key-auth-context.guard");
const _isuserauthcontextguard = require("../../../engine/core-modules/auth/guards/is-user-auth-context.guard");
const _userworkspaceentity = require("../../../engine/core-modules/user-workspace/user-workspace.entity");
const _workspaceexception = require("../../../engine/core-modules/workspace/workspace.exception");
const _workspacememberprequeryhookservice = require("./workspace-member-pre-query-hook.service");
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
let WorkspaceMemberUpdateOnePreQueryHook = class WorkspaceMemberUpdateOnePreQueryHook {
    async execute(authContext, _objectName, payload) {
        const workspace = authContext.workspace;
        (0, _utils.assertIsDefinedOrThrow)(workspace, _workspaceexception.WorkspaceNotFoundDefaultError);
        await this.workspaceMemberPreQueryHookService.validateWorkspaceMemberUpdatePermissionOrThrow({
            userWorkspaceId: (0, _isuserauthcontextguard.isUserAuthContext)(authContext) ? authContext.userWorkspaceId : undefined,
            targettedWorkspaceMemberId: payload.id,
            workspaceId: workspace.id,
            apiKey: (0, _isapikeyauthcontextguard.isApiKeyAuthContext)(authContext) ? authContext.apiKey : undefined,
            workspaceMemberId: (0, _isuserauthcontextguard.isUserAuthContext)(authContext) ? authContext.workspaceMemberId : undefined
        });
        // TODO: remove this code once we have migrated locale update to userWorkspace update
        if (payload.data.locale && (0, _isuserauthcontextguard.isUserAuthContext)(authContext)) {
            const userWorkspace = await this.userWorkspaceRepository.findOne({
                where: {
                    id: authContext.userWorkspaceId
                }
            });
            if (!(0, _classvalidator.isDefined)(userWorkspace)) {
                throw new _authexception.AuthException('User workspace not found', _authexception.AuthExceptionCode.USER_WORKSPACE_NOT_FOUND);
            }
            await this.userWorkspaceRepository.save({
                ...userWorkspace,
                locale: payload.data.locale
            });
            await this.coreEntityCacheService.invalidate('userWorkspaceEntity', authContext.userWorkspaceId);
        }
        await this.workspaceMemberPreQueryHookService.completeOnboardingProfileStepIfNameProvided({
            userId: (0, _isuserauthcontextguard.isUserAuthContext)(authContext) ? authContext.user.id : undefined,
            workspaceId: workspace.id,
            firstName: payload.data.name?.firstName,
            lastName: payload.data.name?.lastName
        });
        return payload;
    }
    constructor(workspaceMemberPreQueryHookService, userWorkspaceRepository, coreEntityCacheService){
        this.workspaceMemberPreQueryHookService = workspaceMemberPreQueryHookService;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.coreEntityCacheService = coreEntityCacheService;
    }
};
WorkspaceMemberUpdateOnePreQueryHook = _ts_decorate([
    (0, _workspacequeryhookdecorator.WorkspaceQueryHook)(`workspaceMember.updateOne`),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacememberprequeryhookservice.WorkspaceMemberPreQueryHookService === "undefined" ? Object : _workspacememberprequeryhookservice.WorkspaceMemberPreQueryHookService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _coreentitycacheservice.CoreEntityCacheService === "undefined" ? Object : _coreentitycacheservice.CoreEntityCacheService
    ])
], WorkspaceMemberUpdateOnePreQueryHook);

//# sourceMappingURL=workspace-member-update-one.pre-query.hook.js.map