"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceRolesPermissionsCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceRolesPermissionsCacheService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _metadata = require("twenty-shared/metadata");
const _workspacecacheproviderservice = require("../../../workspace-cache/interfaces/workspace-cache-provider.service");
const _objectmetadataentity = require("../../object-metadata/object-metadata.entity");
const _roleentity = require("../role.entity");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
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
const WORKFLOW_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS = [
    _metadata.STANDARD_OBJECTS.workflow.universalIdentifier,
    _metadata.STANDARD_OBJECTS.workflowRun.universalIdentifier,
    _metadata.STANDARD_OBJECTS.workflowVersion.universalIdentifier
];
let WorkspaceRolesPermissionsCacheService = class WorkspaceRolesPermissionsCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    async computeForCache(workspaceId) {
        const roles = await this.roleRepository.find({
            where: {
                workspaceId
            },
            relations: [
                'objectPermissions',
                'permissionFlags',
                'fieldPermissions',
                'rowLevelPermissionPredicates',
                'rowLevelPermissionPredicateGroups'
            ]
        });
        const workspaceObjectMetadataCollection = await this.getWorkspaceObjectMetadataCollection(workspaceId);
        const permissionsByRoleId = {};
        for (const role of roles){
            const objectRecordsPermissions = {};
            for (const objectMetadata of workspaceObjectMetadataCollection){
                const { id: objectMetadataId, isSystem, universalIdentifier } = objectMetadata;
                let canRead = role.canReadAllObjectRecords;
                let canUpdate = role.canUpdateAllObjectRecords;
                let canSoftDelete = role.canSoftDeleteAllObjectRecords;
                let canDestroy = role.canDestroyAllObjectRecords;
                const restrictedFields = {};
                if (WORKFLOW_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.includes(universalIdentifier)) {
                    const hasWorkflowsPermissions = this.hasWorkflowsPermissions(role);
                    canRead = hasWorkflowsPermissions;
                    canUpdate = hasWorkflowsPermissions;
                    canSoftDelete = hasWorkflowsPermissions;
                    canDestroy = hasWorkflowsPermissions;
                } else {
                    const objectRecordPermissionsOverride = role.objectPermissions.find((objectPermission)=>objectPermission.objectMetadataId === objectMetadataId);
                    const getPermissionValue = (overrideValue, defaultValue)=>isSystem ? true : overrideValue ?? defaultValue;
                    canRead = getPermissionValue(objectRecordPermissionsOverride?.canReadObjectRecords, canRead);
                    canUpdate = getPermissionValue(objectRecordPermissionsOverride?.canUpdateObjectRecords, canUpdate);
                    canSoftDelete = getPermissionValue(objectRecordPermissionsOverride?.canSoftDeleteObjectRecords, canSoftDelete);
                    canDestroy = getPermissionValue(objectRecordPermissionsOverride?.canDestroyObjectRecords, canDestroy);
                    const fieldPermissions = role.fieldPermissions.filter((fieldPermission)=>fieldPermission.objectMetadataId === objectMetadataId);
                    for (const fieldPermission of fieldPermissions){
                        const isFieldLabelIdentifier = fieldPermission.fieldMetadataId === objectMetadata.labelIdentifierFieldMetadataId;
                        if ((0, _utils.isDefined)(fieldPermission.canReadFieldValue) || (0, _utils.isDefined)(fieldPermission.canUpdateFieldValue)) {
                            restrictedFields[fieldPermission.fieldMetadataId] = {
                                canRead: isFieldLabelIdentifier ? true : fieldPermission.canReadFieldValue,
                                canUpdate: fieldPermission.canUpdateFieldValue
                            };
                        }
                    }
                }
                objectRecordsPermissions[objectMetadataId] = {
                    canReadObjectRecords: canRead,
                    canUpdateObjectRecords: canUpdate,
                    canSoftDeleteObjectRecords: canSoftDelete,
                    canDestroyObjectRecords: canDestroy,
                    restrictedFields,
                    rowLevelPermissionPredicates: role.rowLevelPermissionPredicates.filter((rowLevelPermissionPredicate)=>rowLevelPermissionPredicate.objectMetadataId === objectMetadataId),
                    rowLevelPermissionPredicateGroups: role.rowLevelPermissionPredicateGroups.filter((rowLevelPermissionPredicateGroup)=>rowLevelPermissionPredicateGroup.objectMetadataId === objectMetadataId)
                };
            }
            permissionsByRoleId[role.id] = objectRecordsPermissions;
        }
        return permissionsByRoleId;
    }
    async getWorkspaceObjectMetadataCollection(workspaceId) {
        const workspaceObjectMetadata = await this.objectMetadataRepository.find({
            where: {
                workspaceId
            },
            select: [
                'id',
                'isSystem',
                'universalIdentifier',
                'labelIdentifierFieldMetadataId'
            ]
        });
        return workspaceObjectMetadata;
    }
    hasWorkflowsPermissions(role) {
        const hasWorkflowsPermissionFromRole = role.canUpdateAllSettings;
        const hasWorkflowsPermissionsFromSettingPermissions = (0, _utils.isDefined)(role.permissionFlags.find((permissionFlag)=>permissionFlag.flag === _constants.PermissionFlagType.WORKFLOWS));
        return hasWorkflowsPermissionFromRole || hasWorkflowsPermissionsFromSettingPermissions;
    }
    constructor(objectMetadataRepository, roleRepository){
        super(), this.objectMetadataRepository = objectMetadataRepository, this.roleRepository = roleRepository;
    }
};
WorkspaceRolesPermissionsCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('rolesPermissions'),
    _ts_param(0, (0, _typeorm.InjectRepository)(_objectmetadataentity.ObjectMetadataEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_roleentity.RoleEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], WorkspaceRolesPermissionsCacheService);

//# sourceMappingURL=workspace-roles-permissions-cache.service.js.map