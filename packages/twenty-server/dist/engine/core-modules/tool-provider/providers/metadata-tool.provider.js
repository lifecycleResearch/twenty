"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataToolProvider", {
    enumerable: true,
    get: function() {
        return MetadataToolProvider;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _toolcategoryenum = require("../enums/tool-category.enum");
const _toolexecutorservice = require("../services/tool-executor.service");
const _toolsettodescriptorsutil = require("../utils/tool-set-to-descriptors.util");
const _fieldmetadatatoolsfactory = require("../../../metadata-modules/field-metadata/tools/field-metadata-tools.factory");
const _objectmetadatatoolsfactory = require("../../../metadata-modules/object-metadata/tools/object-metadata-tools.factory");
const _permissionsservice = require("../../../metadata-modules/permissions/permissions.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MetadataToolProvider = class MetadataToolProvider {
    onModuleInit() {
        const objectFactory = this.objectMetadataToolsFactory;
        const fieldFactory = this.fieldMetadataToolsFactory;
        this.toolExecutorService.registerCategoryGenerator(_toolcategoryenum.ToolCategory.METADATA, async (context)=>({
                ...objectFactory.generateTools(context.workspaceId),
                ...fieldFactory.generateTools(context.workspaceId)
            }));
    }
    async isAvailable(context) {
        return this.permissionsService.checkRolesPermissions(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.DATA_MODEL);
    }
    async generateDescriptors(context, options) {
        const toolSet = {
            ...this.objectMetadataToolsFactory.generateTools(context.workspaceId),
            ...this.fieldMetadataToolsFactory.generateTools(context.workspaceId)
        };
        return (0, _toolsettodescriptorsutil.toolSetToDescriptors)(toolSet, _toolcategoryenum.ToolCategory.METADATA, {
            includeSchemas: options?.includeSchemas ?? true
        });
    }
    constructor(objectMetadataToolsFactory, fieldMetadataToolsFactory, permissionsService, toolExecutorService){
        this.objectMetadataToolsFactory = objectMetadataToolsFactory;
        this.fieldMetadataToolsFactory = fieldMetadataToolsFactory;
        this.permissionsService = permissionsService;
        this.toolExecutorService = toolExecutorService;
        this.category = _toolcategoryenum.ToolCategory.METADATA;
    }
};
MetadataToolProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _objectmetadatatoolsfactory.ObjectMetadataToolsFactory === "undefined" ? Object : _objectmetadatatoolsfactory.ObjectMetadataToolsFactory,
        typeof _fieldmetadatatoolsfactory.FieldMetadataToolsFactory === "undefined" ? Object : _fieldmetadatatoolsfactory.FieldMetadataToolsFactory,
        typeof _permissionsservice.PermissionsService === "undefined" ? Object : _permissionsservice.PermissionsService,
        typeof _toolexecutorservice.ToolExecutorService === "undefined" ? Object : _toolexecutorservice.ToolExecutorService
    ])
], MetadataToolProvider);

//# sourceMappingURL=metadata-tool.provider.js.map