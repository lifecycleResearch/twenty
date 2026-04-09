"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMemberPreQueryHookService", {
    enumerable: true,
    get: function() {
        return WorkspaceMemberPreQueryHookService;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _onboardingservice = require("../../../engine/core-modules/onboarding/onboarding.service");
const _permissionsexception = require("../../../engine/metadata-modules/permissions/permissions.exception");
const _permissionsservice = require("../../../engine/metadata-modules/permissions/permissions.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkspaceMemberPreQueryHookService = class WorkspaceMemberPreQueryHookService {
    async validateWorkspaceMemberUpdatePermissionOrThrow({ userWorkspaceId, workspaceMemberId, targettedWorkspaceMemberId, workspaceId, apiKey }) {
        if ((0, _utils.isDefined)(apiKey)) {
            return;
        }
        if (!userWorkspaceId) {
            throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.USER_WORKSPACE_NOT_FOUND, _permissionsexception.PermissionsExceptionCode.USER_WORKSPACE_NOT_FOUND);
        }
        if ((0, _utils.isDefined)(targettedWorkspaceMemberId) && workspaceMemberId === targettedWorkspaceMemberId) {
            return;
        }
        if (await this.permissionsService.userHasWorkspaceSettingPermission({
            userWorkspaceId,
            workspaceId,
            setting: _constants.PermissionFlagType.WORKSPACE_MEMBERS,
            apiKeyId: apiKey ?? undefined
        })) {
            return;
        }
        throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
    }
    async completeOnboardingProfileStepIfNameProvided({ userId, workspaceId, firstName, lastName }) {
        if (!userId) {
            return;
        }
        if (firstName === '' && lastName === '') {
            return;
        }
        if (!(0, _utils.isDefined)(firstName) && !(0, _utils.isDefined)(lastName)) {
            return;
        }
        await this.onboardingService.setOnboardingCreateProfilePending({
            userId,
            workspaceId,
            value: false
        });
    }
    constructor(permissionsService, onboardingService){
        this.permissionsService = permissionsService;
        this.onboardingService = onboardingService;
    }
};
WorkspaceMemberPreQueryHookService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _permissionsservice.PermissionsService === "undefined" ? Object : _permissionsservice.PermissionsService,
        typeof _onboardingservice.OnboardingService === "undefined" ? Object : _onboardingservice.OnboardingService
    ])
], WorkspaceMemberPreQueryHookService);

//# sourceMappingURL=workspace-member-pre-query-hook.service.js.map