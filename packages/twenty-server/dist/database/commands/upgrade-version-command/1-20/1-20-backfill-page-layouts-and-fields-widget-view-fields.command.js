"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand", {
    enumerable: true,
    get: function() {
        return BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _featureflagservice = require("../../../../engine/core-modules/feature-flag/services/feature-flag.service");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _computeflatdefaultrecordpagelayouttocreateutil = require("../../../../engine/metadata-modules/object-metadata/utils/compute-flat-default-record-page-layout-to-create.util");
const _computeflatrecordpagefieldsviewtocreateutil = require("../../../../engine/metadata-modules/object-metadata/utils/compute-flat-record-page-fields-view-to-create.util");
const _computeflatviewfieldstocreateutil = require("../../../../engine/metadata-modules/object-metadata/utils/compute-flat-view-fields-to-create.util");
const _fielddisplaymodeenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/field-display-mode.enum");
const _widgetconfigurationtypetype = require("../../../../engine/metadata-modules/page-layout-widget/enums/widget-configuration-type.type");
const _widgettypeenum = require("../../../../engine/metadata-modules/page-layout-widget/enums/widget-type.enum");
const _pagelayouttypeenum = require("../../../../engine/metadata-modules/page-layout/enums/page-layout-type.enum");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _standardpagelayouttabstemplate = require("../../../../engine/workspace-manager/twenty-standard-application/constants/standard-page-layout-tabs.template");
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
const HOME_TAB_POSITION = 10;
const isActivityTargetField = (fieldName, objectNameSingular)=>objectNameSingular === _types.CoreObjectNameSingular.Note && fieldName === 'noteTargets' || objectNameSingular === _types.CoreObjectNameSingular.Task && fieldName === 'taskTargets';
const isJunctionRelationField = (field)=>{
    const settings = field.settings;
    return (0, _utils.isDefined)(settings?.junctionTargetFieldId) && typeof settings?.junctionTargetFieldId === 'string' && settings.junctionTargetFieldId.length > 0;
};
const isRelationTargetAvailable = (targetObject)=>{
    if (!(0, _utils.isDefined)(targetObject)) {
        return false;
    }
    if (targetObject.isRemote) {
        return false;
    }
    if (targetObject.isSystem && targetObject.nameSingular !== _types.CoreObjectNameSingular.WorkspaceMember) {
        return false;
    }
    return true;
};
let BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand = class BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Starting backfill of page layouts and field widgets for workspace ${workspaceId}`);
        const isAlreadyEnabled = await this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED, workspaceId);
        if (isAlreadyEnabled) {
            this.logger.log(`IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED already enabled for workspace ${workspaceId}, skipping`);
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would create page layouts, sync view fields, create FIELD widgets and enable IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED for workspace ${workspaceId}`);
            return;
        }
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        await this.backfillStandardPageLayoutsAndSyncViews({
            workspaceId,
            twentyStandardFlatApplication
        });
        await this.backfillCustomObjectPageLayouts({
            workspaceId,
            workspaceCustomFlatApplication
        });
        await this.backfillFieldWidgets({
            workspaceId,
            twentyStandardFlatApplication,
            workspaceCustomFlatApplication
        });
        await this.featureFlagService.enableFeatureFlags([
            _types.FeatureFlagKey.IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED
        ], workspaceId);
        this.logger.log(`Successfully backfilled page layouts and field widgets for workspace ${workspaceId}`);
    }
    async backfillStandardPageLayoutsAndSyncViews({ workspaceId, twentyStandardFlatApplication }) {
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            shouldIncludeRecordPageLayouts: true,
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const recordPageLayoutUniversalIdentifiers = new Set();
        const recordPageLayoutsFromStandard = Object.values(standardAllFlatEntityMaps.flatPageLayoutMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((pageLayout)=>{
            if (pageLayout.type !== _pagelayouttypeenum.PageLayoutType.RECORD_PAGE) {
                return false;
            }
            recordPageLayoutUniversalIdentifiers.add(pageLayout.universalIdentifier);
            return true;
        });
        const tabUniversalIdentifiers = new Set();
        const tabsFromStandard = Object.values(standardAllFlatEntityMaps.flatPageLayoutTabMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((tab)=>{
            if (!recordPageLayoutUniversalIdentifiers.has(tab.pageLayoutUniversalIdentifier)) {
                return false;
            }
            tabUniversalIdentifiers.add(tab.universalIdentifier);
            return true;
        });
        const widgetsFromStandard = Object.values(standardAllFlatEntityMaps.flatPageLayoutWidgetMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((widget)=>tabUniversalIdentifiers.has(widget.pageLayoutTabUniversalIdentifier));
        const { flatFieldMetadataMaps: existingFlatFieldMetadataMaps, flatPageLayoutMaps: existingFlatPageLayoutMaps, flatPageLayoutTabMaps: existingFlatPageLayoutTabMaps, flatPageLayoutWidgetMaps: existingFlatPageLayoutWidgetMaps, flatViewMaps: existingFlatViewMaps, flatViewFieldMaps: existingFlatViewFieldMaps, flatViewFieldGroupMaps: existingFlatViewFieldGroupMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps',
            'flatPageLayoutMaps',
            'flatPageLayoutTabMaps',
            'flatPageLayoutWidgetMaps',
            'flatViewMaps',
            'flatViewFieldMaps',
            'flatViewFieldGroupMaps'
        ]);
        // Filter out page layouts, tabs, and widgets that already exist in the workspace
        const pageLayoutsToCreate = recordPageLayoutsFromStandard.filter((pageLayout)=>!(0, _utils.isDefined)(existingFlatPageLayoutMaps.byUniversalIdentifier[pageLayout.universalIdentifier]));
        const pageLayoutTabsToCreate = tabsFromStandard.filter((tab)=>!(0, _utils.isDefined)(existingFlatPageLayoutTabMaps.byUniversalIdentifier[tab.universalIdentifier]));
        const pageLayoutWidgetsToCreate = widgetsFromStandard.filter((widget)=>!(0, _utils.isDefined)(existingFlatPageLayoutWidgetMaps.byUniversalIdentifier[widget.universalIdentifier]));
        // Collect all standard FIELDS_WIDGET view universal identifiers
        // This includes both new views to create AND existing views (created by 1-19)
        const allStandardFieldsWidgetViewUniversalIds = new Set();
        const viewsToCreate = Object.values(standardAllFlatEntityMaps.flatViewMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((view)=>{
            if (view.type !== _types.ViewType.FIELDS_WIDGET) {
                return false;
            }
            allStandardFieldsWidgetViewUniversalIds.add(view.universalIdentifier);
            if ((0, _utils.isDefined)(existingFlatViewMaps.byUniversalIdentifier[view.universalIdentifier])) {
                return false;
            }
            return true;
        });
        // Delete all existing viewFields for standard FIELDS_WIDGET views and recreate from current standard.
        // This ensures positions, visibility, and groups match the current standard definition.
        const viewFieldsToDelete = Object.values(existingFlatViewFieldMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewField)=>allStandardFieldsWidgetViewUniversalIds.has(viewField.viewUniversalIdentifier));
        const viewFieldsToCreate = Object.values(standardAllFlatEntityMaps.flatViewFieldMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewField)=>allStandardFieldsWidgetViewUniversalIds.has(viewField.viewUniversalIdentifier))// Skip viewFields whose referenced fieldMetadata doesn't exist in the workspace yet
        // (e.g. fields added to the standard definition but not yet synced to this workspace)
        .filter((viewField)=>(0, _utils.isDefined)(existingFlatFieldMetadataMaps.byUniversalIdentifier[viewField.fieldMetadataUniversalIdentifier]));
        // Same delete-and-recreate approach for viewFieldGroups
        const viewFieldGroupsToDelete = Object.values(existingFlatViewFieldGroupMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewFieldGroup)=>allStandardFieldsWidgetViewUniversalIds.has(viewFieldGroup.viewUniversalIdentifier));
        const viewFieldGroupsToCreate = Object.values(standardAllFlatEntityMaps.flatViewFieldGroupMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((viewFieldGroup)=>allStandardFieldsWidgetViewUniversalIds.has(viewFieldGroup.viewUniversalIdentifier));
        this.logger.log(`Creating ${pageLayoutsToCreate.length} page layouts, ${viewsToCreate.length} views, deleting ${viewFieldsToDelete.length} and creating ${viewFieldsToCreate.length} view fields, deleting ${viewFieldGroupsToDelete.length} and creating ${viewFieldGroupsToCreate.length} view field groups for workspace ${workspaceId}`);
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                pageLayout: {
                    flatEntityToCreate: pageLayoutsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                pageLayoutTab: {
                    flatEntityToCreate: pageLayoutTabsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                pageLayoutWidget: {
                    flatEntityToCreate: pageLayoutWidgetsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                view: {
                    flatEntityToCreate: viewsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: viewFieldsToCreate,
                    flatEntityToDelete: viewFieldsToDelete,
                    flatEntityToUpdate: []
                },
                viewFieldGroup: {
                    flatEntityToCreate: viewFieldGroupsToCreate,
                    flatEntityToDelete: viewFieldGroupsToDelete,
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to create standard page layouts and sync view fields:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to create standard page layouts and sync view fields for workspace ${workspaceId}`);
        }
    }
    async backfillCustomObjectPageLayouts({ workspaceId, workspaceCustomFlatApplication }) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatPageLayoutMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatPageLayoutMaps'
        ]);
        const existingPageLayouts = Object.values(flatPageLayoutMaps.byUniversalIdentifier).filter(_utils.isDefined);
        const objectIdsWithRecordPageLayout = new Set(existingPageLayouts.filter((layout)=>layout.type === _pagelayouttypeenum.PageLayoutType.RECORD_PAGE && (0, _utils.isDefined)(layout.objectMetadataId)).map((layout)=>layout.objectMetadataId));
        const customObjectsWithoutPageLayout = Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((objectMetadata)=>objectMetadata.isCustom && !objectMetadata.isRemote && !objectIdsWithRecordPageLayout.has(objectMetadata.id));
        if (customObjectsWithoutPageLayout.length === 0) {
            this.logger.log(`No custom objects without page layouts found for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`Creating page layouts for ${customObjectsWithoutPageLayout.length} custom object(s) in workspace ${workspaceId}`);
        const allCustomPageLayoutsToCreate = [];
        const allCustomPageLayoutTabsToCreate = [];
        const allCustomPageLayoutWidgetsToCreate = [];
        const allCustomViewsToCreate = [];
        const allCustomViewFieldsToCreate = [];
        for (const customObject of customObjectsWithoutPageLayout){
            const flatRecordPageFieldsView = (0, _computeflatrecordpagefieldsviewtocreateutil.computeFlatRecordPageFieldsViewToCreate)({
                objectMetadata: customObject,
                flatApplication: workspaceCustomFlatApplication
            });
            const objectFieldMetadatas = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((field)=>field.objectMetadataId === customObject.id);
            const viewFields = (0, _computeflatviewfieldstocreateutil.computeFlatViewFieldsToCreate)({
                objectFlatFieldMetadatas: objectFieldMetadatas,
                viewUniversalIdentifier: flatRecordPageFieldsView.universalIdentifier,
                flatApplication: workspaceCustomFlatApplication,
                labelIdentifierFieldMetadataUniversalIdentifier: customObject.labelIdentifierFieldMetadataUniversalIdentifier,
                excludeLabelIdentifier: true
            });
            const { pageLayouts, pageLayoutTabs, pageLayoutWidgets } = (0, _computeflatdefaultrecordpagelayouttocreateutil.computeFlatDefaultRecordPageLayoutToCreate)({
                objectMetadata: customObject,
                flatApplication: workspaceCustomFlatApplication,
                recordPageFieldsView: flatRecordPageFieldsView,
                workspaceId
            });
            allCustomPageLayoutsToCreate.push(...pageLayouts);
            allCustomPageLayoutTabsToCreate.push(...pageLayoutTabs);
            allCustomPageLayoutWidgetsToCreate.push(...pageLayoutWidgets);
            allCustomViewsToCreate.push(flatRecordPageFieldsView);
            allCustomViewFieldsToCreate.push(...viewFields);
        }
        const customValidateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                pageLayout: {
                    flatEntityToCreate: allCustomPageLayoutsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                pageLayoutTab: {
                    flatEntityToCreate: allCustomPageLayoutTabsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                pageLayoutWidget: {
                    flatEntityToCreate: allCustomPageLayoutWidgetsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                view: {
                    flatEntityToCreate: allCustomViewsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                viewField: {
                    flatEntityToCreate: allCustomViewFieldsToCreate,
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (customValidateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to create custom object page layouts:\n${JSON.stringify(customValidateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to create custom object page layouts for workspace ${workspaceId}`);
        }
        this.logger.log(`Successfully created page layouts for ${customObjectsWithoutPageLayout.length} custom object(s) in workspace ${workspaceId}`);
    }
    async backfillFieldWidgets({ workspaceId, twentyStandardFlatApplication, workspaceCustomFlatApplication }) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps',
            'flatFieldMetadataMaps',
            'flatPageLayoutMaps',
            'flatPageLayoutTabMaps',
            'flatPageLayoutWidgetMaps'
        ]);
        // Build a set of fieldMetadataIds that already have a FIELD widget
        const existingFieldWidgetFieldIds = new Set();
        for (const widget of Object.values(flatPageLayoutWidgetMaps.byUniversalIdentifier)){
            if ((0, _utils.isDefined)(widget) && widget.configuration?.configurationType === _widgetconfigurationtypetype.WidgetConfigurationType.FIELD && (0, _utils.isDefined)(widget.configuration.fieldMetadataId)) {
                existingFieldWidgetFieldIds.add(widget.configuration.fieldMetadataId);
            }
        }
        // Build object ID → objectMetadata map
        const objectById = new Map();
        for (const obj of Object.values(flatObjectMetadataMaps.byUniversalIdentifier)){
            if ((0, _utils.isDefined)(obj)) {
                objectById.set(obj.id, obj);
            }
        }
        // Build object ID → RECORD_PAGE layout map
        const recordPageLayoutByObjectId = new Map();
        for (const layout of Object.values(flatPageLayoutMaps.byUniversalIdentifier)){
            if ((0, _utils.isDefined)(layout) && layout.type === _pagelayouttypeenum.PageLayoutType.RECORD_PAGE && (0, _utils.isDefined)(layout.objectMetadataId)) {
                recordPageLayoutByObjectId.set(layout.objectMetadataId, {
                    id: layout.id,
                    universalIdentifier: layout.universalIdentifier
                });
            }
        }
        // Build pageLayoutId → home tab map
        const homeTabByPageLayoutId = new Map();
        for (const tab of Object.values(flatPageLayoutTabMaps.byUniversalIdentifier)){
            if ((0, _utils.isDefined)(tab) && tab.position === HOME_TAB_POSITION && tab.layoutMode === _types.PageLayoutTabLayoutMode.VERTICAL_LIST) {
                homeTabByPageLayoutId.set(tab.pageLayoutId, {
                    id: tab.id,
                    universalIdentifier: tab.universalIdentifier,
                    widgetCount: tab.widgetIds?.length ?? 0
                });
            }
        }
        // Group fields by objectMetadataId
        const fieldsByObjectId = new Map();
        // Map morphId → all field IDs sharing that morphId (for dedup)
        const fieldIdsByMorphId = new Map();
        for (const field of Object.values(flatFieldMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(field) || !(0, _utils.isDefined)(field.objectMetadataId)) {
                continue;
            }
            const list = fieldsByObjectId.get(field.objectMetadataId) ?? [];
            list.push(field);
            fieldsByObjectId.set(field.objectMetadataId, list);
            if (field.type === _types.FieldMetadataType.MORPH_RELATION && (0, _utils.isDefined)(field.morphId)) {
                const morphFieldIds = fieldIdsByMorphId.get(field.morphId) ?? [];
                morphFieldIds.push(field.id);
                fieldIdsByMorphId.set(field.morphId, morphFieldIds);
            }
        }
        const now = new Date().toISOString();
        const standardWidgetsToCreate = [];
        const customWidgetsToCreate = [];
        const processedMorphIds = new Set();
        for (const object of objectById.values()){
            const pageLayout = recordPageLayoutByObjectId.get(object.id);
            if (!(0, _utils.isDefined)(pageLayout)) {
                continue;
            }
            const homeTab = homeTabByPageLayoutId.get(pageLayout.id);
            if (!(0, _utils.isDefined)(homeTab)) {
                continue;
            }
            const flatApplication = object.isCustom ? workspaceCustomFlatApplication : twentyStandardFlatApplication;
            const targetList = object.isCustom ? customWidgetsToCreate : standardWidgetsToCreate;
            const fields = fieldsByObjectId.get(object.id) ?? [];
            let nextWidgetIndex = homeTab.widgetCount;
            for (const field of fields){
                if (field.type !== _types.FieldMetadataType.RELATION && field.type !== _types.FieldMetadataType.MORPH_RELATION) {
                    continue;
                }
                if (isActivityTargetField(field.name, object.nameSingular)) {
                    continue;
                }
                if (isJunctionRelationField(field)) {
                    continue;
                }
                if (field.type === _types.FieldMetadataType.RELATION) {
                    const targetObject = (0, _utils.isDefined)(field.relationTargetObjectMetadataId) ? objectById.get(field.relationTargetObjectMetadataId) : undefined;
                    if (!isRelationTargetAvailable(targetObject)) {
                        continue;
                    }
                }
                // For morph relations, skip if any sibling field (same morphId)
                // already has a widget or was already processed in this run
                if (field.type === _types.FieldMetadataType.MORPH_RELATION && (0, _utils.isDefined)(field.morphId)) {
                    if (processedMorphIds.has(field.morphId)) {
                        continue;
                    }
                    const siblingFieldIds = fieldIdsByMorphId.get(field.morphId) ?? [];
                    const alreadyHasWidget = siblingFieldIds.some((id)=>existingFieldWidgetFieldIds.has(id));
                    if (alreadyHasWidget) {
                        continue;
                    }
                    processedMorphIds.add(field.morphId);
                }
                if (existingFieldWidgetFieldIds.has(field.id)) {
                    continue;
                }
                const widget = {
                    id: (0, _uuid.v4)(),
                    universalIdentifier: (0, _uuid.v4)(),
                    applicationId: flatApplication.id,
                    applicationUniversalIdentifier: flatApplication.universalIdentifier,
                    workspaceId,
                    pageLayoutTabId: homeTab.id,
                    pageLayoutTabUniversalIdentifier: homeTab.universalIdentifier,
                    title: field.label,
                    type: _widgettypeenum.WidgetType.FIELD,
                    gridPosition: {
                        ..._standardpagelayouttabstemplate.GRID_POSITIONS.FULL_WIDTH
                    },
                    position: {
                        ..._standardpagelayouttabstemplate.VERTICAL_LIST_LAYOUT_POSITIONS.SECOND,
                        index: nextWidgetIndex
                    },
                    configuration: {
                        configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELD,
                        fieldMetadataId: field.id,
                        fieldDisplayMode: _fielddisplaymodeenum.FieldDisplayMode.CARD
                    },
                    universalConfiguration: {
                        configurationType: _widgetconfigurationtypetype.WidgetConfigurationType.FIELD,
                        fieldMetadataId: field.universalIdentifier,
                        fieldDisplayMode: _fielddisplaymodeenum.FieldDisplayMode.CARD
                    },
                    objectMetadataId: object.id,
                    objectMetadataUniversalIdentifier: object.universalIdentifier,
                    createdAt: now,
                    updatedAt: now,
                    deletedAt: null,
                    conditionalDisplay: null,
                    overrides: null
                };
                targetList.push(widget);
                existingFieldWidgetFieldIds.add(field.id);
                nextWidgetIndex++;
            }
        }
        const totalWidgets = standardWidgetsToCreate.length + customWidgetsToCreate.length;
        if (totalWidgets === 0) {
            this.logger.log(`All FIELD widgets already exist for workspace ${workspaceId}, skipping`);
            return;
        }
        this.logger.log(`Found ${totalWidgets} FIELD widget(s) to create for workspace ${workspaceId} (${standardWidgetsToCreate.length} standard, ${customWidgetsToCreate.length} custom)`);
        if (standardWidgetsToCreate.length > 0) {
            const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
                allFlatEntityOperationByMetadataName: {
                    pageLayoutWidget: {
                        flatEntityToCreate: standardWidgetsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    }
                },
                workspaceId,
                applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
            });
            if (result.status === 'fail') {
                this.logger.error(`Failed to create standard FIELD widgets:\n${JSON.stringify(result, null, 2)}`);
                throw new Error(`Failed to create standard FIELD widgets for workspace ${workspaceId}`);
            }
        }
        if (customWidgetsToCreate.length > 0) {
            const result = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
                allFlatEntityOperationByMetadataName: {
                    pageLayoutWidget: {
                        flatEntityToCreate: customWidgetsToCreate,
                        flatEntityToDelete: [],
                        flatEntityToUpdate: []
                    }
                },
                workspaceId,
                applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
            });
            if (result.status === 'fail') {
                this.logger.error(`Failed to create custom FIELD widgets:\n${JSON.stringify(result, null, 2)}`);
                throw new Error(`Failed to create custom FIELD widgets for workspace ${workspaceId}`);
            }
        }
        this.logger.log(`Successfully created ${totalWidgets} FIELD widget(s) for workspace ${workspaceId}`);
    }
    constructor(workspaceRepository, twentyORMGlobalManager, dataSourceService, applicationService, workspaceMigrationValidateBuildAndRunService, featureFlagService, workspaceCacheService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.applicationService = applicationService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService, this.featureFlagService = featureFlagService, this.workspaceCacheService = workspaceCacheService;
    }
};
BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-20:backfill-page-layouts-and-fields-widget-view-fields',
        description: 'Backfill RECORD_PAGE page layouts, sync FIELDS_WIDGET view fields, create FIELD widgets, and enable IS_RECORD_PAGE_LAYOUT_EDITING_ENABLED'
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
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand);

//# sourceMappingURL=1-20-backfill-page-layouts-and-fields-widget-view-fields.command.js.map