"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewFieldToolProvider", {
    enumerable: true,
    get: function() {
        return ViewFieldToolProvider;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _toolcategoryenum = require("../enums/tool-category.enum");
const _toolexecutorservice = require("../services/tool-executor.service");
const _toolsettodescriptorsutil = require("../utils/tool-set-to-descriptors.util");
const _permissionsservice = require("../../../metadata-modules/permissions/permissions.service");
const _viewfieldtoolsfactory = require("../../../metadata-modules/view-field/tools/view-field-tools.factory");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ViewFieldToolProvider = class ViewFieldToolProvider {
    onModuleInit() {
        const factory = this.viewFieldToolsFactory;
        this.toolExecutorService.registerCategoryGenerator(_toolcategoryenum.ToolCategory.VIEW_FIELD, async (context)=>{
            const readTools = factory.generateReadTools(context.workspaceId);
            const hasViewPermission = await this.permissionsService.checkRolesPermissions(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.VIEWS);
            if (hasViewPermission) {
                const writeTools = factory.generateWriteTools(context.workspaceId);
                return {
                    ...readTools,
                    ...writeTools
                };
            }
            return readTools;
        });
    }
    async isAvailable(_context) {
        return true;
    }
    async generateDescriptors(context, options) {
        const schemaOptions = {
            includeSchemas: options?.includeSchemas ?? true
        };
        const readTools = this.viewFieldToolsFactory.generateReadTools(context.workspaceId);
        const hasViewPermission = await this.permissionsService.checkRolesPermissions(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.VIEWS);
        if (hasViewPermission) {
            const writeTools = this.viewFieldToolsFactory.generateWriteTools(context.workspaceId);
            return (0, _toolsettodescriptorsutil.toolSetToDescriptors)({
                ...readTools,
                ...writeTools
            }, _toolcategoryenum.ToolCategory.VIEW_FIELD, schemaOptions);
        }
        return (0, _toolsettodescriptorsutil.toolSetToDescriptors)(readTools, _toolcategoryenum.ToolCategory.VIEW_FIELD, schemaOptions);
    }
    constructor(viewFieldToolsFactory, permissionsService, toolExecutorService){
        this.viewFieldToolsFactory = viewFieldToolsFactory;
        this.permissionsService = permissionsService;
        this.toolExecutorService = toolExecutorService;
        this.category = _toolcategoryenum.ToolCategory.VIEW_FIELD;
    }
};
ViewFieldToolProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _viewfieldtoolsfactory.ViewFieldToolsFactory === "undefined" ? Object : _viewfieldtoolsfactory.ViewFieldToolsFactory,
        typeof _permissionsservice.PermissionsService === "undefined" ? Object : _permissionsservice.PermissionsService,
        typeof _toolexecutorservice.ToolExecutorService === "undefined" ? Object : _toolexecutorservice.ToolExecutorService
    ])
], ViewFieldToolProvider);

//# sourceMappingURL=view-field-tool.provider.js.map