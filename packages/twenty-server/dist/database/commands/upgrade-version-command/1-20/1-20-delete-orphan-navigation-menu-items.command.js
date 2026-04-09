"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeleteOrphanNavigationMenuItemsCommand", {
    enumerable: true,
    get: function() {
        return DeleteOrphanNavigationMenuItemsCommand;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _types = require("twenty-shared/types");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _navigationmenuitementity = require("../../../../engine/metadata-modules/navigation-menu-item/entities/navigation-menu-item.entity");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
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
let DeleteOrphanNavigationMenuItemsCommand = class DeleteOrphanNavigationMenuItemsCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const { flatViewMaps, flatNavigationMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatViewMaps',
            'flatNavigationMenuItemMaps'
        ]);
        const activeViewIds = new Set(Object.values(flatViewMaps.byUniversalIdentifier).filter((view)=>(0, _utils.isDefined)(view)).filter((view)=>view.deletedAt === null).map((view)=>view.id));
        const orphanViewNavigationMenuItemIds = Object.values(flatNavigationMenuItemMaps.byUniversalIdentifier).filter((item)=>(0, _utils.isDefined)(item) && item.type === _types.NavigationMenuItemType.VIEW && (0, _utils.isDefined)(item.viewId) && !activeViewIds.has(item.viewId)).map((item)=>item.id);
        if (orphanViewNavigationMenuItemIds.length === 0) {
            return;
        }
        if (options.dryRun) {
            this.logger.log(`[DRY RUN] Would delete ${orphanViewNavigationMenuItemIds.length} orphan navigation menu item(s) for workspace ${workspaceId}`);
            return;
        }
        await this.navigationMenuItemRepository.delete({
            workspaceId,
            id: (0, _typeorm1.In)(orphanViewNavigationMenuItemIds)
        });
        this.logger.log(`Deleted ${orphanViewNavigationMenuItemIds.length} orphan navigation menu item(s) for workspace ${workspaceId}`);
        await this.workspaceCacheService.flush(workspaceId, [
            'flatNavigationMenuItemMaps'
        ]);
    }
    constructor(workspaceRepository, twentyORMGlobalManager, dataSourceService, navigationMenuItemRepository, workspaceCacheService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.navigationMenuItemRepository = navigationMenuItemRepository, this.workspaceCacheService = workspaceCacheService, this.logger = new _common.Logger(DeleteOrphanNavigationMenuItemsCommand.name);
    }
};
DeleteOrphanNavigationMenuItemsCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:delete-orphan-navigation-menu-items',
        description: 'Delete navigation menu items pointing to deleted views'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_navigationmenuitementity.NavigationMenuItemEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], DeleteOrphanNavigationMenuItemsCommand);

//# sourceMappingURL=1-20-delete-orphan-navigation-menu-items.command.js.map