"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PermissionFlagService", {
    enumerable: true,
    get: function() {
        return PermissionFlagService;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _applicationservice = require("../../core-modules/application/application.service");
const _workspacemanyorallflatentitymapscacheservice = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _fromcreatepermissionflaginputtoflatpermissionflagtocreateutil = require("../flat-permission-flag/utils/from-create-permission-flag-input-to-flat-permission-flag-to-create.util");
const _permissionsexception = require("../permissions/permissions.exception");
const _workspacemigrationbuilderexception = require("../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PermissionFlagService = class PermissionFlagService {
    async upsertPermissionFlags({ workspaceId, input }) {
        const { flatPermissionFlagMaps, flatRoleMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatPermissionFlagMaps',
                'flatRoleMaps'
            ]
        });
        const roleUniversalId = flatRoleMaps.universalIdentifierById[input.roleId];
        const role = (0, _utils.isDefined)(roleUniversalId) ? flatRoleMaps.byUniversalIdentifier[roleUniversalId] : undefined;
        if (!(0, _utils.isDefined)(role)) {
            throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.ROLE_NOT_FOUND, _permissionsexception.PermissionsExceptionCode.ROLE_NOT_FOUND, {
                userFriendlyMessage: /*i18n*/ {
                    id: "woRk0z",
                    message: "The role you are trying to modify could not be found."
                }
            });
        }
        const invalidFlags = input.permissionFlagKeys.filter((flag)=>!Object.values(_constants.PermissionFlagType).includes(flag));
        if (invalidFlags.length > 0) {
            throw new _permissionsexception.PermissionsException(`${_permissionsexception.PermissionsExceptionMessage.INVALID_SETTING}: ${invalidFlags.join(', ')}`, _permissionsexception.PermissionsExceptionCode.INVALID_SETTING, {
                userFriendlyMessage: /*i18n*/ {
                    id: "01Sxb6",
                    message: "Some of the permissions you selected are not valid. Please try again with valid permission settings."
                }
            });
        }
        const roleUniversalIdentifier = role.universalIdentifier;
        const currentPermissionFlagsForRole = Object.values(flatPermissionFlagMaps.byUniversalIdentifier).filter((pf)=>(0, _utils.isDefined)(pf) && pf.roleUniversalIdentifier === roleUniversalIdentifier);
        const inputSet = new Set(input.permissionFlagKeys);
        const existingSet = new Set(currentPermissionFlagsForRole.map((pf)=>pf.flag));
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const flatEntityToCreate = input.permissionFlagKeys.filter((flag)=>!existingSet.has(flag)).map((flag)=>(0, _fromcreatepermissionflaginputtoflatpermissionflagtocreateutil.fromCreatePermissionFlagInputToFlatPermissionFlagToCreate)({
                createPermissionFlagInput: {
                    roleId: input.roleId,
                    flag
                },
                flatApplication: workspaceCustomFlatApplication,
                flatRoleMaps
            }));
        const flatEntityToDelete = currentPermissionFlagsForRole.filter((pf)=>!inputSet.has(pf.flag));
        if (flatEntityToCreate.length === 0 && flatEntityToDelete.length === 0) {
            const unchanged = currentPermissionFlagsForRole.filter((pf)=>inputSet.has(pf.flag));
            return unchanged;
        }
        const buildAndRunResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                permissionFlag: {
                    flatEntityToCreate,
                    flatEntityToDelete,
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (buildAndRunResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(buildAndRunResult, 'Validation errors occurred while upserting permission flags');
        }
        const { flatPermissionFlagMaps: freshFlatPermissionFlagMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatPermissionFlagMaps'
            ]
        });
        const resultFlags = Object.values(freshFlatPermissionFlagMaps.byUniversalIdentifier).filter((pf)=>(0, _utils.isDefined)(pf) && pf.roleUniversalIdentifier === roleUniversalIdentifier);
        return resultFlags;
    }
    constructor(workspaceMigrationValidateBuildAndRunService, workspaceManyOrAllFlatEntityMapsCacheService, applicationService){
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.applicationService = applicationService;
    }
};
PermissionFlagService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService
    ])
], PermissionFlagService);

//# sourceMappingURL=permission-flag.service.js.map