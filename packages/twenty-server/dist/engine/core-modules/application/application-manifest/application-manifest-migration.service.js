"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationManifestMigrationService", {
    enumerable: true,
    get: function() {
        return ApplicationManifestMigrationService;
    }
});
const _common = require("@nestjs/common");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _applicationexception = require("../application.exception");
const _applicationservice = require("../application.service");
const _buildfromtoalluniversalflatentitymapsutil = require("./utils/build-from-to-all-universal-flat-entity-maps.util");
const _computeapplicationmanifestalluniversalflatentitymapsutil = require("./utils/compute-application-manifest-all-universal-flat-entity-maps.util");
const _getapplicationsuballflatentitymapsutil = require("./utils/get-application-sub-all-flat-entity-maps.util");
const _findflatentitybyuniversalidentifierutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _getmetadataflatentitymapskeyutil = require("../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _fieldpermissionservice = require("../../../metadata-modules/object-permission/field-permission/field-permission.service");
const _objectpermissionservice = require("../../../metadata-modules/object-permission/object-permission.service");
const _permissionflagservice = require("../../../metadata-modules/permission-flag/permission-flag.service");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _twentystandardapplications = require("../../../workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplicationManifestMigrationService = class ApplicationManifestMigrationService {
    async syncMetadataFromManifest({ manifest, workspaceId, ownerFlatApplication }) {
        const now = new Date().toISOString();
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const cacheResult = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            ...Object.values(_metadata.ALL_METADATA_NAME).map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey),
            'featureFlagsMap'
        ]);
        const { featureFlagsMap, ...existingAllFlatEntityMaps } = cacheResult;
        const fromAllFlatEntityMaps = (0, _getapplicationsuballflatentitymapsutil.getApplicationSubAllFlatEntityMaps)({
            applicationIds: [
                ownerFlatApplication.id
            ],
            fromAllFlatEntityMaps: existingAllFlatEntityMaps
        });
        const toAllUniversalFlatEntityMaps = (0, _computeapplicationmanifestalluniversalflatentitymapsutil.computeApplicationManifestAllUniversalFlatEntityMaps)({
            manifest,
            ownerFlatApplication,
            now
        });
        const dependencyAllFlatEntityMaps = (0, _getapplicationsuballflatentitymapsutil.getApplicationSubAllFlatEntityMaps)({
            applicationIds: ownerFlatApplication.universalIdentifier === _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier ? [
                twentyStandardFlatApplication.id
            ] : [
                ownerFlatApplication.id,
                twentyStandardFlatApplication.id
            ],
            fromAllFlatEntityMaps: existingAllFlatEntityMaps
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigrationFromTo({
            buildOptions: {
                isSystemBuild: false,
                inferDeletionFromMissingEntities: true,
                applicationUniversalIdentifier: ownerFlatApplication.universalIdentifier
            },
            fromToAllFlatEntityMaps: (0, _buildfromtoalluniversalflatentitymapsutil.buildFromToAllUniversalFlatEntityMaps)({
                fromAllFlatEntityMaps,
                toAllUniversalFlatEntityMaps
            }),
            workspaceId,
            dependencyAllFlatEntityMaps,
            additionalCacheDataMaps: {
                featureFlagsMap
            }
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Validation errors occurred while syncing application manifest metadata');
        }
        this.logger.log(`Metadata migration completed for application ${ownerFlatApplication.universalIdentifier}`);
        await this.syncRolePermissionsAndDefaultRole({
            manifest,
            workspaceId,
            ownerFlatApplication
        });
        return {
            workspaceMigration: validateAndBuildResult.workspaceMigration,
            hasSchemaMetadataChanged: validateAndBuildResult.hasSchemaMetadataChanged
        };
    }
    /**
   * @deprecated should be remove once below issues are resolved:
   *  - [objectPermission](https://github.com/twentyhq/core-team-issues/issues/2223)
   *  - [fieldPermission](https://github.com/twentyhq/core-team-issues/issues/2224)
   *  - [permissionFlag](https://github.com/twentyhq/core-team-issues/issues/2225)
   */ async syncRolePermissionsAndDefaultRole({ manifest, workspaceId, ownerFlatApplication }) {
        const { flatRoleMaps: refreshedFlatRoleMaps, flatObjectMetadataMaps: refreshedFlatObjectMetadataMaps, flatFieldMetadataMaps: refreshedFlatFieldMetadataMaps, flatFrontComponentMaps: refreshedFlatFrontComponentMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatRoleMaps',
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatFrontComponentMaps'
        ]);
        let defaultRoleId = null;
        for (const role of manifest.roles){
            const flatRole = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: refreshedFlatRoleMaps,
                universalIdentifier: role.universalIdentifier
            });
            if (!(0, _utils.isDefined)(flatRole)) {
                throw new _applicationexception.ApplicationException(`Failed to resolve role for universalIdentifier ${role.universalIdentifier}`, _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND);
            }
            await this.syncApplicationRolePermissions({
                role,
                workspaceId,
                roleId: flatRole.id,
                refreshedFlatObjectMetadataMaps,
                refreshedFlatFieldMetadataMaps
            });
            if (role.universalIdentifier === manifest.application.defaultRoleUniversalIdentifier) {
                defaultRoleId = flatRole.id;
            }
        }
        let settingsCustomTabFrontComponentId = null;
        const settingsCustomTabUniversalIdentifier = manifest.application.settingsCustomTabFrontComponentUniversalIdentifier;
        if ((0, _utils.isDefined)(settingsCustomTabUniversalIdentifier)) {
            const flatFrontComponent = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: refreshedFlatFrontComponentMaps,
                universalIdentifier: settingsCustomTabUniversalIdentifier
            });
            if (!(0, _utils.isDefined)(flatFrontComponent)) {
                throw new _applicationexception.ApplicationException(`Failed to resolve front component for settingsCustomTabFrontComponentUniversalIdentifier ${settingsCustomTabUniversalIdentifier}`, _applicationexception.ApplicationExceptionCode.ENTITY_NOT_FOUND);
            }
            settingsCustomTabFrontComponentId = flatFrontComponent.id;
        }
        await this.applicationService.update(ownerFlatApplication.id, {
            workspaceId,
            settingsCustomTabFrontComponentId,
            ...(0, _utils.isDefined)(defaultRoleId) ? {
                defaultRoleId
            } : {}
        });
    }
    async syncApplicationRolePermissions({ role, workspaceId, roleId, refreshedFlatObjectMetadataMaps, refreshedFlatFieldMetadataMaps }) {
        if ((role.objectPermissions ?? []).length > 0 || (role.fieldPermissions ?? []).length > 0) {
            const formattedObjectPermissions = role.objectPermissions?.map((permission)=>{
                const flatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                    flatEntityMaps: refreshedFlatObjectMetadataMaps,
                    universalIdentifier: permission.objectUniversalIdentifier
                });
                if (!(0, _utils.isDefined)(flatObjectMetadata)) {
                    throw new _applicationexception.ApplicationException(`Failed to find object with universalIdentifier ${permission.objectUniversalIdentifier}`, _applicationexception.ApplicationExceptionCode.OBJECT_NOT_FOUND);
                }
                return {
                    ...permission,
                    objectMetadataId: flatObjectMetadata.id
                };
            }).filter((permission)=>(0, _utils.isDefined)(permission.objectMetadataId));
            if ((0, _utils.isDefined)(formattedObjectPermissions)) {
                await this.objectPermissionService.upsertObjectPermissions({
                    workspaceId,
                    input: {
                        roleId,
                        objectPermissions: formattedObjectPermissions
                    }
                });
            }
            const formattedFieldPermissions = role.fieldPermissions?.map((permission)=>{
                const flatObjectMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                    flatEntityMaps: refreshedFlatObjectMetadataMaps,
                    universalIdentifier: permission.objectUniversalIdentifier
                });
                if (!(0, _utils.isDefined)(flatObjectMetadata)) {
                    throw new _applicationexception.ApplicationException(`Failed to find object with universalIdentifier ${permission.objectUniversalIdentifier}`, _applicationexception.ApplicationExceptionCode.OBJECT_NOT_FOUND);
                }
                const flatFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                    flatEntityMaps: refreshedFlatFieldMetadataMaps,
                    universalIdentifier: permission.fieldUniversalIdentifier
                });
                if (!(0, _utils.isDefined)(flatFieldMetadata)) {
                    throw new _applicationexception.ApplicationException(`Failed to find field with universalIdentifier ${permission.fieldUniversalIdentifier}`, _applicationexception.ApplicationExceptionCode.FIELD_NOT_FOUND);
                }
                return {
                    ...permission,
                    objectMetadataId: flatObjectMetadata.id,
                    fieldMetadataId: flatFieldMetadata.id
                };
            }).filter((permission)=>(0, _utils.isDefined)(permission.objectMetadataId) && (0, _utils.isDefined)(permission.fieldMetadataId));
            if ((0, _utils.isDefined)(formattedFieldPermissions)) {
                await this.fieldPermissionService.upsertFieldPermissions({
                    workspaceId,
                    input: {
                        roleId,
                        fieldPermissions: formattedFieldPermissions
                    }
                });
            }
        }
        if ((0, _utils.isDefined)(role.permissionFlags) && role.permissionFlags.length > 0) {
            await this.permissionFlagService.upsertPermissionFlags({
                workspaceId,
                input: {
                    roleId,
                    permissionFlagKeys: role.permissionFlags
                }
            });
        }
    }
    constructor(workspaceCacheService, workspaceMigrationValidateBuildAndRunService, applicationService, objectPermissionService, fieldPermissionService, permissionFlagService){
        this.workspaceCacheService = workspaceCacheService;
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.applicationService = applicationService;
        this.objectPermissionService = objectPermissionService;
        this.fieldPermissionService = fieldPermissionService;
        this.permissionFlagService = permissionFlagService;
        this.logger = new _common.Logger(ApplicationManifestMigrationService.name);
    }
};
ApplicationManifestMigrationService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _objectpermissionservice.ObjectPermissionService === "undefined" ? Object : _objectpermissionservice.ObjectPermissionService,
        typeof _fieldpermissionservice.FieldPermissionService === "undefined" ? Object : _fieldpermissionservice.FieldPermissionService,
        typeof _permissionflagservice.PermissionFlagService === "undefined" ? Object : _permissionflagservice.PermissionFlagService
    ])
], ApplicationManifestMigrationService);

//# sourceMappingURL=application-manifest-migration.service.js.map