"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMemberTranspiler", {
    enumerable: true,
    get: function() {
        return WorkspaceMemberTranspiler;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _fileservice = require("../../file/services/file.service");
const _fromRoleEntityToRoleDtoutil = require("../../../metadata-modules/role/utils/fromRoleEntityToRoleDto.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkspaceMemberTranspiler = class WorkspaceMemberTranspiler {
    generateSignedAvatarUrl({ workspaceId, workspaceMember }) {
        if (!(0, _utils.isDefined)(workspaceMember.avatarUrl) || !(0, _guards.isNonEmptyString)(workspaceMember.avatarUrl)) {
            return '';
        }
        return this.fileService.signFileUrl({
            url: workspaceMember.avatarUrl,
            workspaceId
        });
    }
    toWorkspaceMemberDto({ userWorkspace, workspaceMemberEntity, userWorkspaceRoles }) {
        const { avatarUrl: avatarUrlFromEntity, id, name, userEmail, colorScheme, locale, timeFormat, timeZone, dateFormat, calendarStartDay, numberFormat } = workspaceMemberEntity;
        const avatarUrl = this.generateSignedAvatarUrl({
            workspaceId: userWorkspace.workspaceId,
            workspaceMember: {
                avatarUrl: avatarUrlFromEntity,
                id
            }
        });
        const roles = (0, _fromRoleEntityToRoleDtoutil.fromRoleEntitiesToRoleDtos)(userWorkspaceRoles);
        if (!(0, _utils.isDefined)(userEmail)) {
            throw new Error(`Workspace member ${id} has no userEmail`);
        }
        return {
            id,
            name,
            userEmail,
            avatarUrl,
            userWorkspaceId: userWorkspace.id,
            colorScheme,
            dateFormat: dateFormat,
            locale,
            timeFormat: timeFormat,
            timeZone,
            roles,
            calendarStartDay,
            numberFormat: numberFormat
        };
    }
    toWorkspaceMemberDtos(allWorkspaceEntitiesBundles) {
        return allWorkspaceEntitiesBundles.map((bundle)=>this.toWorkspaceMemberDto(bundle));
    }
    toDeletedWorkspaceMemberDto(workspaceMember, userWorkspaceId) {
        const { avatarUrl: avatarUrlFromEntity, id, name, userEmail } = workspaceMember;
        if (!(0, _utils.isDefined)(userEmail)) {
            throw new Error(`Workspace member ${id} has no userEmail`);
        }
        const avatarUrl = userWorkspaceId ? this.generateSignedAvatarUrl({
            workspaceId: userWorkspaceId,
            workspaceMember: {
                avatarUrl: avatarUrlFromEntity,
                id
            }
        }) : null;
        return {
            id,
            name,
            userEmail,
            avatarUrl,
            userWorkspaceId: userWorkspaceId ?? null
        };
    }
    toDeletedWorkspaceMemberDtos(workspaceMembers, userWorkspaceId) {
        return workspaceMembers.map((workspaceMember)=>this.toDeletedWorkspaceMemberDto(workspaceMember, userWorkspaceId));
    }
    constructor(fileService){
        this.fileService = fileService;
    }
};
WorkspaceMemberTranspiler = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fileservice.FileService === "undefined" ? Object : _fileservice.FileService
    ])
], WorkspaceMemberTranspiler);

//# sourceMappingURL=workspace-member-transpiler.service.js.map