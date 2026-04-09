"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillCommandMenuItemsCommand", {
    enumerable: true,
    get: function() {
        return BackfillCommandMenuItemsCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _nestcommander = require("nest-commander");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _featureflagservice = require("../../../../engine/core-modules/feature-flag/services/feature-flag.service");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _commandmenuitemavailabilitytypeenum = require("../../../../engine/metadata-modules/command-menu-item/enums/command-menu-item-availability-type.enum");
const _enginecomponentkeyenum = require("../../../../engine/metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _twentystandardapplicationallflatentitymapsconstant = require("../../../../engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant");
const _workspacemigrationvalidatebuildandrunservice = require("../../../../engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
const _workflowversionworkspaceentity = require("../../../../modules/workflow/common/standard-objects/workflow-version.workspace-entity");
const _workflowcommonworkspaceservice = require("../../../../modules/workflow/common/workspace-services/workflow-common.workspace-service");
const _workflowtriggertype = require("../../../../modules/workflow/workflow-trigger/types/workflow-trigger.type");
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
let BackfillCommandMenuItemsCommand = class BackfillCommandMenuItemsCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Starting backfill of command menu items for workspace ${workspaceId}`);
        const isFeatureFlagAlreadyEnabled = await this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED, workspaceId);
        if (isFeatureFlagAlreadyEnabled) {
            this.logger.log(`IS_COMMAND_MENU_ITEM_ENABLED already enabled for workspace ${workspaceId}, skipping`);
            return;
        }
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const standardCommandMenuItems = await this.computeStandardCommandMenuItemsToCreate(workspaceId, twentyStandardFlatApplication);
        const triggerWorkflowVersionCommandMenuItems = await this.computeTriggerWorkflowVersionCommandMenuItemsToCreate(workspaceId, workspaceCustomFlatApplication);
        const totalCount = standardCommandMenuItems.length + triggerWorkflowVersionCommandMenuItems.length;
        if (totalCount === 0) {
            this.logger.log(`No missing command menu items for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`Found ${totalCount} missing command menu item(s) for workspace ${workspaceId} (${standardCommandMenuItems.length} standard, ${triggerWorkflowVersionCommandMenuItems.length} trigger workflow version)`);
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would create ${totalCount} command menu item(s) for workspace ${workspaceId}`);
            return;
        }
        if (standardCommandMenuItems.length > 0) {
            await this.createCommandMenuItems({
                workspaceId,
                flatCommandMenuItemsToCreate: standardCommandMenuItems,
                applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
            });
        }
        if (triggerWorkflowVersionCommandMenuItems.length > 0) {
            await this.createCommandMenuItems({
                workspaceId,
                flatCommandMenuItemsToCreate: triggerWorkflowVersionCommandMenuItems,
                applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
            });
        }
        await this.featureFlagService.enableFeatureFlags([
            _types.FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED
        ], workspaceId);
        this.logger.log(`Successfully backfilled ${totalCount} command menu item(s) for workspace ${workspaceId}`);
    }
    async computeStandardCommandMenuItemsToCreate(workspaceId, twentyStandardFlatApplication) {
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            shouldIncludeRecordPageLayouts: true,
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const { flatCommandMenuItemMaps: existingFlatCommandMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatCommandMenuItemMaps'
        ]);
        const commandMenuItemsToCreate = Object.values(standardAllFlatEntityMaps.flatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((commandMenuItem)=>!(0, _utils.isDefined)(existingFlatCommandMenuItemMaps.byUniversalIdentifier[commandMenuItem.universalIdentifier]));
        if (commandMenuItemsToCreate.length > 0) {
            this.logger.log(`Found ${commandMenuItemsToCreate.length} missing standard command menu item(s) for workspace ${workspaceId}`);
        }
        return commandMenuItemsToCreate;
    }
    async computeTriggerWorkflowVersionCommandMenuItemsToCreate(workspaceId, workspaceCustomFlatApplication) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return await this.twentyORMGlobalManager.executeInWorkspaceContext(async ()=>{
            const workflowVersionRepository = await this.twentyORMGlobalManager.getRepository(workspaceId, 'workflowVersion', {
                shouldBypassPermissionChecks: true
            });
            const activeWorkflowVersions = await workflowVersionRepository.find({
                where: {
                    status: _workflowversionworkspaceentity.WorkflowVersionStatus.ACTIVE
                }
            });
            const manualTriggerVersions = activeWorkflowVersions.filter((version)=>(0, _utils.isDefined)(version.trigger) && version.trigger.type === _workflowtriggertype.WorkflowTriggerType.MANUAL);
            if (manualTriggerVersions.length === 0) {
                this.logger.log(`No active workflow versions with manual triggers for workspace ${workspaceId}`);
                return [];
            }
            const { flatCommandMenuItemMaps: existingFlatCommandMenuItemMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
                'flatCommandMenuItemMaps'
            ]);
            const existingWorkflowVersionIds = new Set(Object.values(existingFlatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).map((item)=>item.workflowVersionId).filter(_utils.isDefined));
            const workflowRepository = await this.twentyORMGlobalManager.getRepository(workspaceId, 'workflow', {
                shouldBypassPermissionChecks: true
            });
            const flatCommandMenuItemsToCreate = [];
            for (const workflowVersion of manualTriggerVersions){
                if (existingWorkflowVersionIds.has(workflowVersion.id)) {
                    continue;
                }
                const workflow = await workflowRepository.findOne({
                    where: {
                        id: workflowVersion.workflowId
                    }
                });
                const label = workflow && (0, _guards.isNonEmptyString)(workflow.name) ? workflow.name : 'Manual Trigger';
                const trigger = workflowVersion.trigger;
                const { availabilityType, availabilityObjectMetadataId, availabilityObjectMetadataUniversalIdentifier } = await this.resolveManualTriggerAvailability(trigger, workspaceId);
                const id = (0, _uuid.v4)();
                const now = new Date().toISOString();
                flatCommandMenuItemsToCreate.push({
                    id,
                    universalIdentifier: id,
                    workflowVersionId: workflowVersion.id,
                    frontComponentId: null,
                    frontComponentUniversalIdentifier: null,
                    engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
                    label,
                    shortLabel: label,
                    icon: trigger.settings.icon ?? null,
                    isPinned: trigger.settings.isPinned ?? false,
                    position: 0,
                    hotKeys: null,
                    availabilityType,
                    availabilityObjectMetadataId: availabilityObjectMetadataId ?? null,
                    availabilityObjectMetadataUniversalIdentifier,
                    conditionalAvailabilityExpression: null,
                    workspaceId,
                    applicationId: workspaceCustomFlatApplication.id,
                    applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
                    createdAt: now,
                    updatedAt: now
                });
            }
            if (flatCommandMenuItemsToCreate.length > 0) {
                this.logger.log(`Found ${flatCommandMenuItemsToCreate.length} missing trigger workflow version command menu item(s) for workspace ${workspaceId}`);
            }
            return flatCommandMenuItemsToCreate;
        }, authContext);
    }
    async createCommandMenuItems({ workspaceId, flatCommandMenuItemsToCreate, applicationUniversalIdentifier }) {
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: {
                    flatEntityToCreate: flatCommandMenuItemsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            applicationUniversalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to backfill command menu items:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to backfill command menu items for workspace ${workspaceId}`);
        }
    }
    async resolveManualTriggerAvailability(trigger, workspaceId) {
        const availability = trigger.settings.availability;
        if (!(0, _utils.isDefined)(availability) || availability.type === 'GLOBAL') {
            return {
                availabilityType: _commandmenuitemavailabilitytypeenum.CommandMenuItemAvailabilityType.GLOBAL,
                availabilityObjectMetadataId: undefined,
                availabilityObjectMetadataUniversalIdentifier: null
            };
        }
        const { objectIdByNameSingular, flatObjectMetadataMaps } = await this.workflowCommonWorkspaceService.getFlatEntityMaps(workspaceId);
        const objectId = objectIdByNameSingular[availability.objectNameSingular];
        if (!(0, _utils.isDefined)(objectId)) {
            this.logger.warn(`Object metadata not found for "${availability.objectNameSingular}" in workspace ${workspaceId}, falling back to GLOBAL`);
            return {
                availabilityType: _commandmenuitemavailabilitytypeenum.CommandMenuItemAvailabilityType.GLOBAL,
                availabilityObjectMetadataId: undefined,
                availabilityObjectMetadataUniversalIdentifier: null
            };
        }
        const objectUniversalIdentifier = flatObjectMetadataMaps.universalIdentifierById[objectId] ?? null;
        return {
            availabilityType: _commandmenuitemavailabilitytypeenum.CommandMenuItemAvailabilityType.RECORD_SELECTION,
            availabilityObjectMetadataId: objectId,
            availabilityObjectMetadataUniversalIdentifier: objectUniversalIdentifier
        };
    }
    constructor(workspaceRepository, twentyORMGlobalManager, dataSourceService, applicationService, workspaceMigrationValidateBuildAndRunService, featureFlagService, workspaceCacheService, workflowCommonWorkspaceService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.applicationService = applicationService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService, this.featureFlagService = featureFlagService, this.workspaceCacheService = workspaceCacheService, this.workflowCommonWorkspaceService = workflowCommonWorkspaceService;
    }
};
BackfillCommandMenuItemsCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:backfill-command-menu-items',
        description: 'Backfill missing standard and trigger workflow version command menu items for existing workspaces and enable IS_COMMAND_MENU_ITEM_ENABLED feature flag'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService === "undefined" ? Object : _workflowcommonworkspaceservice.WorkflowCommonWorkspaceService
    ])
], BackfillCommandMenuItemsCommand);

//# sourceMappingURL=1-20-backfill-command-menu-items.command.js.map