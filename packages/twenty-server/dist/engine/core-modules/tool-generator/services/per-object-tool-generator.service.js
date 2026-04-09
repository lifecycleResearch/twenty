"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PerObjectToolGeneratorService", {
    enumerable: true,
    get: function() {
        return PerObjectToolGeneratorService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _getflatfieldsforflatobjectmetadatautil = require("../../../api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _isworkflowrelatedobjectutil = require("../../../metadata-modules/ai/ai-agent/utils/is-workflow-related-object.util");
const _workspacemanyorallflatentitymapscacheservice = require("../../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _computepermissionintersectionutil = require("../../../twenty-orm/utils/compute-permission-intersection.util");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PerObjectToolGeneratorService = class PerObjectToolGeneratorService {
    // Generate tools by iterating over workspace objects once and applying all factories
    async generate(context, factories) {
        const objects = await this.getObjectsWithPermissions(context.workspaceId, context.rolePermissionConfig);
        const tools = {};
        for (const objectWithPermission of objects){
            for (const factory of factories){
                Object.assign(tools, factory(objectWithPermission, context));
            }
        }
        this.logger.log(`Generated ${Object.keys(tools).length} tools from ${factories.length} factories for ${objects.length} objects`);
        return tools;
    }
    // Get workspace objects with their permissions
    async getObjectsWithPermissions(workspaceId, rolePermissionConfig) {
        const { rolesPermissions } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'rolesPermissions'
        ]);
        let objectPermissions;
        if ('unionOf' in rolePermissionConfig) {
            if (rolePermissionConfig.unionOf.length === 1) {
                objectPermissions = rolesPermissions[rolePermissionConfig.unionOf[0]];
            } else {
                throw new Error('Union permission logic for multiple roles not yet implemented');
            }
        } else if ('intersectionOf' in rolePermissionConfig) {
            const allRolePermissions = rolePermissionConfig.intersectionOf.map((roleId)=>rolesPermissions[roleId]);
            objectPermissions = allRolePermissions.length === 1 ? allRolePermissions[0] : (0, _computepermissionintersectionutil.computePermissionIntersection)(allRolePermissions);
        } else {
            return [];
        }
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMaps'
            ]
        });
        const allFlatObjects = Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((obj)=>obj.isActive && !obj.isSystem);
        const allObjectMetadata = allFlatObjects.map((flatObject)=>({
                ...flatObject,
                fields: (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObject, flatFieldMetadataMaps)
            }));
        // Filter out workflow-related objects
        const filteredObjectMetadata = allObjectMetadata.filter((objectMetadata)=>!(0, _isworkflowrelatedobjectutil.isWorkflowRelatedObject)(objectMetadata));
        // Map to ObjectWithPermission
        const result = [];
        for (const objectMetadata of filteredObjectMetadata){
            const permission = objectPermissions[objectMetadata.id];
            if (!permission) {
                continue;
            }
            result.push({
                objectMetadata,
                restrictedFields: permission.restrictedFields,
                canCreate: permission.canUpdateObjectRecords,
                canRead: permission.canReadObjectRecords,
                canUpdate: permission.canUpdateObjectRecords,
                canDelete: permission.canSoftDeleteObjectRecords
            });
        }
        return result;
    }
    constructor(workspaceCacheService, flatEntityMapsCacheService){
        this.workspaceCacheService = workspaceCacheService;
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.logger = new _common.Logger(PerObjectToolGeneratorService.name);
    }
};
PerObjectToolGeneratorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], PerObjectToolGeneratorService);

//# sourceMappingURL=per-object-tool-generator.service.js.map