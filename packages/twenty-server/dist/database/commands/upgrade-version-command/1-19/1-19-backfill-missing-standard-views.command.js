"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillMissingStandardViewsCommand", {
    enumerable: true,
    get: function() {
        return BackfillMissingStandardViewsCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
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
let BackfillMissingStandardViewsCommand = class BackfillMissingStandardViewsCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Starting backfill of missing standard views for workspace ${workspaceId}`);
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            shouldIncludeRecordPageLayouts: true,
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const { flatViewMaps: existingFlatViewMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatViewMaps'
        ]);
        const missingViewUniversalIdentifiers = new Set();
        const viewsToCreate = Object.values(standardAllFlatEntityMaps.flatViewMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((view)=>{
            const alreadyExists = (0, _utils.isDefined)(existingFlatViewMaps.byUniversalIdentifier[view.universalIdentifier]);
            if (alreadyExists) {
                return false;
            }
            missingViewUniversalIdentifiers.add(view.universalIdentifier);
            return true;
        });
        if (viewsToCreate.length === 0) {
            this.logger.log(`No missing standard views for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`Found ${viewsToCreate.length} missing standard view(s) for workspace ${workspaceId}`);
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would create ${viewsToCreate.length} view(s) for workspace ${workspaceId}`);
            return;
        }
        const viewFieldsToCreate = Object.values(standardAllFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewField)=>missingViewUniversalIdentifiers.has(viewField.viewUniversalIdentifier));
        const viewGroupsToCreate = Object.values(standardAllFlatEntityMaps.flatViewGroupMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewGroup)=>missingViewUniversalIdentifiers.has(viewGroup.viewUniversalIdentifier));
        const viewFiltersToCreate = Object.values(standardAllFlatEntityMaps.flatViewFilterMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewFilter)=>missingViewUniversalIdentifiers.has(viewFilter.viewUniversalIdentifier));
        const viewFieldGroupsToCreate = Object.values(standardAllFlatEntityMaps.flatViewFieldGroupMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewFieldGroup)=>missingViewUniversalIdentifiers.has(viewFieldGroup.viewUniversalIdentifier));
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                view: {
                    flatEntityToCreate: viewsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: viewFieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewGroup: {
                    flatEntityToCreate: viewGroupsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewFilter: {
                    flatEntityToCreate: viewFiltersToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewFieldGroup: {
                    flatEntityToCreate: viewFieldGroupsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.warn(`Failed to backfill missing standard views for workspace ${workspaceId}, skipping:\n${JSON.stringify(validateAndBuildResult)}`);
            return;
        }
        this.logger.log(`Successfully backfilled ${viewsToCreate.length} standard view(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceRepository, twentyORMGlobalManager, dataSourceService, applicationService, workspaceMigrationValidateBuildAndRunService, workspaceCacheService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.applicationService = applicationService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService, this.workspaceCacheService = workspaceCacheService;
    }
};
BackfillMissingStandardViewsCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-19:backfill-missing-standard-views',
        description: 'Backfill missing standard views and their child entities (fields, groups, filters, field groups) for workspaces'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], BackfillMissingStandardViewsCommand);

//# sourceMappingURL=1-19-backfill-missing-standard-views.command.js.map