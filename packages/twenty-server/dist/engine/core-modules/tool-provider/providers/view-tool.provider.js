"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewToolProvider", {
    enumerable: true,
    get: function() {
        return ViewToolProvider;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _toolcategoryenum = require("../enums/tool-category.enum");
const _toolexecutorservice = require("../services/tool-executor.service");
const _toolsettodescriptorsutil = require("../utils/tool-set-to-descriptors.util");
const _permissionsservice = require("../../../metadata-modules/permissions/permissions.service");
const _viewtoolsfactory = require("../../../metadata-modules/view/tools/view-tools.factory");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ViewToolProvider = class ViewToolProvider {
    onModuleInit() {
        const factory = this.viewToolsFactory;
        this.toolExecutorService.registerCategoryGenerator(_toolcategoryenum.ToolCategory.VIEW, async (context)=>{
            const workspaceMemberId = context.actorContext?.workspaceMemberId;
            const readTools = factory.generateReadTools(context.workspaceId, workspaceMemberId ?? undefined, workspaceMemberId ?? undefined);
            const hasViewPermission = await this.permissionsService.checkRolesPermissions(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.VIEWS);
            if (hasViewPermission) {
                const writeTools = factory.generateWriteTools(context.workspaceId, workspaceMemberId ?? undefined);
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
        const workspaceMemberId = context.actorContext?.workspaceMemberId;
        const schemaOptions = {
            includeSchemas: options?.includeSchemas ?? true
        };
        const readTools = this.viewToolsFactory.generateReadTools(context.workspaceId, workspaceMemberId ?? undefined, workspaceMemberId ?? undefined);
        const hasViewPermission = await this.permissionsService.checkRolesPermissions(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.VIEWS);
        if (hasViewPermission) {
            const writeTools = this.viewToolsFactory.generateWriteTools(context.workspaceId, workspaceMemberId ?? undefined);
            return (0, _toolsettodescriptorsutil.toolSetToDescriptors)({
                ...readTools,
                ...writeTools
            }, _toolcategoryenum.ToolCategory.VIEW, schemaOptions);
        }
        return (0, _toolsettodescriptorsutil.toolSetToDescriptors)(readTools, _toolcategoryenum.ToolCategory.VIEW, schemaOptions);
    }
    constructor(viewToolsFactory, permissionsService, toolExecutorService){
        this.viewToolsFactory = viewToolsFactory;
        this.permissionsService = permissionsService;
        this.toolExecutorService = toolExecutorService;
        this.category = _toolcategoryenum.ToolCategory.VIEW;
    }
};
ViewToolProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _viewtoolsfactory.ViewToolsFactory === "undefined" ? Object : _viewtoolsfactory.ViewToolsFactory,
        typeof _permissionsservice.PermissionsService === "undefined" ? Object : _permissionsservice.PermissionsService,
        typeof _toolexecutorservice.ToolExecutorService === "undefined" ? Object : _toolexecutorservice.ToolExecutorService
    ])
], ViewToolProvider);

//# sourceMappingURL=view-tool.provider.js.map