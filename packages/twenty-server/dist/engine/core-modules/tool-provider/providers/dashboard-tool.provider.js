"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardToolProvider", {
    enumerable: true,
    get: function() {
        return DashboardToolProvider;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _dashboardtoolservicetoken = require("../constants/dashboard-tool-service.token");
const _toolcategoryenum = require("../enums/tool-category.enum");
const _toolexecutorservice = require("../services/tool-executor.service");
const _toolsettodescriptorsutil = require("../utils/tool-set-to-descriptors.util");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let DashboardToolProvider = class DashboardToolProvider {
    onModuleInit() {
        if (this.dashboardToolService) {
            const service = this.dashboardToolService;
            this.toolExecutorService.registerCategoryGenerator(_toolcategoryenum.ToolCategory.DASHBOARD, async (context)=>service.generateDashboardTools(context.workspaceId, context.rolePermissionConfig));
        }
    }
    async isAvailable(context) {
        if (!this.dashboardToolService) {
            return false;
        }
        return this.permissionsService.checkRolesPermissions(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.LAYOUTS);
    }
    async generateDescriptors(context, options) {
        if (!this.dashboardToolService) {
            return [];
        }
        const toolSet = await this.dashboardToolService.generateDashboardTools(context.workspaceId, context.rolePermissionConfig);
        return (0, _toolsettodescriptorsutil.toolSetToDescriptors)(toolSet, _toolcategoryenum.ToolCategory.DASHBOARD, {
            includeSchemas: options?.includeSchemas ?? true
        });
    }
    constructor(dashboardToolService, permissionsService, toolExecutorService){
        this.dashboardToolService = dashboardToolService;
        this.permissionsService = permissionsService;
        this.toolExecutorService = toolExecutorService;
        this.category = _toolcategoryenum.ToolCategory.DASHBOARD;
    }
};
DashboardToolProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Optional)()),
    _ts_param(0, (0, _common.Inject)(_dashboardtoolservicetoken.DASHBOARD_TOOL_SERVICE_TOKEN)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        typeof _permissionsservice.PermissionsService === "undefined" ? Object : _permissionsservice.PermissionsService,
        typeof _toolexecutorservice.ToolExecutorService === "undefined" ? Object : _toolexecutorservice.ToolExecutorService
    ])
], DashboardToolProvider);

//# sourceMappingURL=dashboard-tool.provider.js.map