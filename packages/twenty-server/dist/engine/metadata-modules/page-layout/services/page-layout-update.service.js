"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PageLayoutUpdateService", {
    enumerable: true,
    get: function() {
        return PageLayoutUpdateService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _applicationservice = require("../../../core-modules/application/application.service");
const _workspacemanyorallflatentitymapscacheservice = require("../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _addflatentitytoflatentitymapsorthrowutil = require("../../flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _flatpagelayouttabeditablepropertiesconstant = require("../../flat-page-layout-tab/constants/flat-page-layout-tab-editable-properties.constant");
const _flatpagelayoutwidgeteditablepropertiesconstant = require("../../flat-page-layout-widget/constants/flat-page-layout-widget-editable-properties.constant");
const _buildflatpagelayoutwidgetcommonpropertiesutil = require("../../flat-page-layout-widget/utils/build-flat-page-layout-widget-common-properties.util");
const _frompagelayoutwidgetconfigurationtouniversalconfigurationutil = require("../../flat-page-layout-widget/utils/from-page-layout-widget-configuration-to-universal-configuration.util");
const _reconstructflatpagelayoutwithtabsandwidgetsutil = require("../../flat-page-layout/utils/reconstruct-flat-page-layout-with-tabs-and-widgets.util");
const _widgetconfigurationtypetype = require("../../page-layout-widget/enums/widget-configuration-type.type");
const _validatechartconfigurationfieldreferencesutil = require("../../page-layout-widget/utils/validate-chart-configuration-field-references.util");
const _pagelayoutexception = require("../exceptions/page-layout.exception");
const _fromflatpagelayoutwithtabsandwidgetstopagelayoutdtoutil = require("../utils/from-flat-page-layout-with-tabs-and-widgets-to-page-layout-dto.util");
const _viewservice = require("../../view/services/view.service");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
const _dashboardsyncservice = require("../../../../modules/dashboard-sync/services/dashboard-sync.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PageLayoutUpdateService = class PageLayoutUpdateService {
    async updatePageLayoutWithTabs({ id, workspaceId, input }) {
        const { flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatPageLayoutMaps',
                'flatPageLayoutTabMaps',
                'flatPageLayoutWidgetMaps'
            ]
        });
        const existingPageLayout = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: id,
            flatEntityMaps: flatPageLayoutMaps
        });
        // TODO move in validator
        if (!(0, _utils.isDefined)(existingPageLayout) || (0, _utils.isDefined)(existingPageLayout.deletedAt)) {
            throw new _pagelayoutexception.PageLayoutException((0, _pagelayoutexception.generatePageLayoutExceptionMessage)(_pagelayoutexception.PageLayoutExceptionMessageKey.PAGE_LAYOUT_NOT_FOUND, id), _pagelayoutexception.PageLayoutExceptionCode.PAGE_LAYOUT_NOT_FOUND);
        }
        ///
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { tabs, ...updateData } = input;
        const flatPageLayoutToUpdate = {
            ...existingPageLayout,
            name: updateData.name,
            type: updateData.type,
            objectMetadataId: updateData.objectMetadataId,
            updatedAt: new Date().toISOString()
        };
        const { tabsToCreate, tabsToUpdate, tabsToDelete } = this.computeTabOperations({
            existingPageLayout,
            tabs,
            flatPageLayoutTabMaps,
            workspaceId,
            workspaceCustomApplicationId: workspaceCustomFlatApplication.id,
            workspaceCustomApplicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        const { flatObjectMetadataMaps, flatFieldMetadataMaps, flatFrontComponentMaps, flatViewFieldGroupMaps, flatViewMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMaps',
                'flatFrontComponentMaps',
                'flatViewFieldGroupMaps',
                'flatViewMaps'
            ]
        });
        const optimisticFlatPageLayoutTabMaps = tabsToCreate.reduce((maps, tab)=>(0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
                flatEntity: tab,
                flatEntityMaps: maps
            }), flatPageLayoutTabMaps);
        const { widgetsToCreate, widgetsToUpdate, widgetsToDelete } = this.computeWidgetOperationsForAllTabs({
            tabs,
            flatPageLayoutWidgetMaps,
            flatPageLayoutTabMaps: optimisticFlatPageLayoutTabMaps,
            flatObjectMetadataMaps,
            workspaceId,
            workspaceCustomApplicationId: workspaceCustomFlatApplication.id,
            workspaceCustomApplicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
            flatFieldMetadataMaps,
            flatFrontComponentMaps,
            flatViewFieldGroupMaps,
            flatViewMaps
        });
        const orphanedViewIds = this.collectOrphanedViewIdsFromDeletedWidgets({
            widgetsToUpdate,
            tabsToUpdate,
            flatPageLayoutWidgetMaps
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                pageLayout: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        flatPageLayoutToUpdate
                    ]
                },
                pageLayoutTab: {
                    flatEntityToCreate: tabsToCreate,
                    flatEntityToDelete: tabsToDelete,
                    flatEntityToUpdate: tabsToUpdate
                },
                pageLayoutWidget: {
                    flatEntityToCreate: widgetsToCreate,
                    flatEntityToDelete: widgetsToDelete,
                    flatEntityToUpdate: widgetsToUpdate
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while updating page layout with tabs');
        }
        const { flatPageLayoutMaps: recomputedFlatPageLayoutMaps, flatPageLayoutTabMaps: recomputedFlatPageLayoutTabMaps, flatPageLayoutWidgetMaps: recomputedFlatPageLayoutWidgetMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatPageLayoutMaps',
                'flatPageLayoutTabMaps',
                'flatPageLayoutWidgetMaps'
            ]
        });
        const flatLayout = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: id,
            flatEntityMaps: recomputedFlatPageLayoutMaps
        });
        await this.dashboardSyncService.updateLinkedDashboardsUpdatedAtByPageLayoutId({
            pageLayoutId: id,
            workspaceId,
            updatedAt: new Date(flatLayout.updatedAt)
        });
        await this.destroyOrphanedFieldsWidgetViews({
            viewIds: orphanedViewIds,
            workspaceId
        });
        return (0, _fromflatpagelayoutwithtabsandwidgetstopagelayoutdtoutil.fromFlatPageLayoutWithTabsAndWidgetsToPageLayoutDto)((0, _reconstructflatpagelayoutwithtabsandwidgetsutil.reconstructFlatPageLayoutWithTabsAndWidgets)({
            layout: flatLayout,
            flatPageLayoutTabMaps: recomputedFlatPageLayoutTabMaps,
            flatPageLayoutWidgetMaps: recomputedFlatPageLayoutWidgetMaps
        }));
    }
    computeTabOperations({ existingPageLayout, tabs, flatPageLayoutTabMaps, workspaceId, workspaceCustomApplicationId, workspaceCustomApplicationUniversalIdentifier }) {
        const existingTabs = Object.values(flatPageLayoutTabMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((tab)=>tab.pageLayoutId === existingPageLayout.id);
        const { toCreate: entitiesToCreate, toUpdate: entitiesToUpdate, toRestoreAndUpdate: entitiesToRestoreAndUpdate, idsToDelete } = (0, _utils.computeDiffBetweenObjects)({
            existingObjects: existingTabs,
            receivedObjects: tabs,
            propertiesToCompare: _flatpagelayouttabeditablepropertiesconstant.FLAT_PAGE_LAYOUT_TAB_EDITABLE_PROPERTIES
        });
        const now = new Date();
        const tabsToCreate = entitiesToCreate.map((tabInput)=>{
            const tabId = tabInput.id ?? (0, _uuid.v4)();
            return {
                id: tabId,
                title: tabInput.title,
                position: tabInput.position,
                pageLayoutId: existingPageLayout.id,
                pageLayoutUniversalIdentifier: existingPageLayout.universalIdentifier,
                workspaceId,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
                deletedAt: null,
                universalIdentifier: tabId,
                applicationId: workspaceCustomApplicationId,
                applicationUniversalIdentifier: workspaceCustomApplicationUniversalIdentifier,
                widgetIds: [],
                widgetUniversalIdentifiers: [],
                icon: null,
                layoutMode: tabInput.layoutMode ?? _types.PageLayoutTabLayoutMode.GRID,
                overrides: null
            };
        });
        const tabsToUpdate = entitiesToUpdate.map((tabInput)=>{
            const existingTab = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
                flatEntityId: tabInput.id,
                flatEntityMaps: flatPageLayoutTabMaps
            });
            return {
                ...existingTab,
                title: tabInput.title,
                position: tabInput.position,
                layoutMode: tabInput.layoutMode ?? existingTab.layoutMode,
                updatedAt: now.toISOString()
            };
        });
        const tabsToRestoreAndUpdate = entitiesToRestoreAndUpdate.map((tabInput)=>{
            const existingTab = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
                flatEntityId: tabInput.id,
                flatEntityMaps: flatPageLayoutTabMaps
            });
            return {
                ...existingTab,
                title: tabInput.title,
                position: tabInput.position,
                layoutMode: tabInput.layoutMode ?? existingTab.layoutMode,
                deletedAt: null,
                updatedAt: now.toISOString()
            };
        });
        const tabsToDelete = idsToDelete.map((tabId)=>{
            const existingTab = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: tabId,
                flatEntityMaps: flatPageLayoutTabMaps
            });
            if (!(0, _utils.isDefined)(existingTab)) {
                return null;
            }
            return {
                ...existingTab,
                deletedAt: now.toISOString(),
                updatedAt: now.toISOString()
            };
        }).filter(_utils.isDefined);
        return {
            tabsToCreate,
            tabsToUpdate: [
                ...tabsToUpdate,
                ...tabsToRestoreAndUpdate,
                ...tabsToDelete
            ],
            tabsToDelete: []
        };
    }
    computeWidgetOperationsForAllTabs({ tabs, flatPageLayoutWidgetMaps, flatPageLayoutTabMaps, flatObjectMetadataMaps, workspaceId, workspaceCustomApplicationId, workspaceCustomApplicationUniversalIdentifier, flatFieldMetadataMaps, flatFrontComponentMaps, flatViewFieldGroupMaps, flatViewMaps }) {
        const allWidgetsToCreate = [];
        const allWidgetsToUpdate = [];
        for (const tabInput of tabs){
            const { widgetsToCreate, widgetsToUpdate } = this.computeWidgetOperationsForTab({
                tabId: tabInput.id,
                widgets: tabInput.widgets,
                flatPageLayoutWidgetMaps,
                flatPageLayoutTabMaps,
                flatObjectMetadataMaps,
                workspaceId,
                workspaceCustomApplicationId,
                workspaceCustomApplicationUniversalIdentifier,
                flatFieldMetadataMaps,
                flatFrontComponentMaps,
                flatViewFieldGroupMaps,
                flatViewMaps
            });
            allWidgetsToCreate.push(...widgetsToCreate);
            allWidgetsToUpdate.push(...widgetsToUpdate);
        }
        return {
            widgetsToCreate: allWidgetsToCreate,
            widgetsToUpdate: allWidgetsToUpdate,
            widgetsToDelete: []
        };
    }
    computeWidgetOperationsForTab({ tabId, widgets, flatPageLayoutWidgetMaps, flatPageLayoutTabMaps, flatObjectMetadataMaps, workspaceId, workspaceCustomApplicationId, workspaceCustomApplicationUniversalIdentifier, flatFieldMetadataMaps, flatFrontComponentMaps, flatViewFieldGroupMaps, flatViewMaps }) {
        for (const widgetInput of widgets){
            this.validateChartFieldReferences({
                widgetInput,
                flatFieldMetadataMaps,
                flatObjectMetadataMaps
            });
        }
        const existingWidgets = Object.values(flatPageLayoutWidgetMaps.byUniversalIdentifier).filter(_utils.isDefined).filter((widget)=>widget.pageLayoutTabId === tabId);
        const { toCreate: entitiesToCreate, toUpdate: entitiesToUpdate, toRestoreAndUpdate: entitiesToRestoreAndUpdate, idsToDelete } = (0, _utils.computeDiffBetweenObjects)({
            existingObjects: existingWidgets,
            receivedObjects: widgets,
            propertiesToCompare: _flatpagelayoutwidgeteditablepropertiesconstant.FLAT_PAGE_LAYOUT_WIDGET_EDITABLE_PROPERTIES
        });
        const now = new Date();
        const widgetsToCreate = entitiesToCreate.map((widgetInput)=>{
            const widgetId = widgetInput.id ?? (0, _uuid.v4)();
            return {
                id: widgetId,
                ...(0, _buildflatpagelayoutwidgetcommonpropertiesutil.buildFlatPageLayoutWidgetCommonProperties)({
                    widgetInput,
                    flatPageLayoutTabMaps,
                    flatObjectMetadataMaps
                }),
                configuration: widgetInput.configuration,
                workspaceId,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString(),
                deletedAt: null,
                universalIdentifier: widgetId,
                applicationId: workspaceCustomApplicationId,
                applicationUniversalIdentifier: workspaceCustomApplicationUniversalIdentifier,
                conditionalDisplay: null,
                overrides: null,
                universalConfiguration: (0, _frompagelayoutwidgetconfigurationtouniversalconfigurationutil.fromPageLayoutWidgetConfigurationToUniversalConfiguration)({
                    configuration: widgetInput.configuration,
                    fieldMetadataUniversalIdentifierById: flatFieldMetadataMaps.universalIdentifierById,
                    frontComponentUniversalIdentifierById: flatFrontComponentMaps.universalIdentifierById,
                    viewFieldGroupUniversalIdentifierById: flatViewFieldGroupMaps.universalIdentifierById,
                    viewUniversalIdentifierById: flatViewMaps.universalIdentifierById
                })
            };
        });
        const widgetsToUpdate = entitiesToUpdate.map((widgetInput)=>{
            const existingWidget = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
                flatEntityId: widgetInput.id,
                flatEntityMaps: flatPageLayoutWidgetMaps
            });
            const updatedConfiguration = widgetInput.configuration ?? null;
            return {
                ...existingWidget,
                ...(0, _buildflatpagelayoutwidgetcommonpropertiesutil.buildFlatPageLayoutWidgetCommonProperties)({
                    widgetInput,
                    flatPageLayoutTabMaps,
                    flatObjectMetadataMaps
                }),
                configuration: updatedConfiguration,
                updatedAt: now.toISOString(),
                ...(0, _utils.isDefined)(updatedConfiguration) && {
                    universalConfiguration: (0, _frompagelayoutwidgetconfigurationtouniversalconfigurationutil.fromPageLayoutWidgetConfigurationToUniversalConfiguration)({
                        configuration: updatedConfiguration,
                        fieldMetadataUniversalIdentifierById: flatFieldMetadataMaps.universalIdentifierById,
                        frontComponentUniversalIdentifierById: flatFrontComponentMaps.universalIdentifierById,
                        viewFieldGroupUniversalIdentifierById: flatViewFieldGroupMaps.universalIdentifierById,
                        viewUniversalIdentifierById: flatViewMaps.universalIdentifierById
                    })
                }
            };
        });
        const widgetsToRestoreAndUpdate = entitiesToRestoreAndUpdate.map((widgetInput)=>{
            const existingWidget = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
                flatEntityId: widgetInput.id,
                flatEntityMaps: flatPageLayoutWidgetMaps
            });
            const restoredConfiguration = widgetInput.configuration ?? null;
            return {
                ...existingWidget,
                ...(0, _buildflatpagelayoutwidgetcommonpropertiesutil.buildFlatPageLayoutWidgetCommonProperties)({
                    widgetInput,
                    flatPageLayoutTabMaps,
                    flatObjectMetadataMaps
                }),
                configuration: restoredConfiguration,
                deletedAt: null,
                updatedAt: now.toISOString(),
                ...(0, _utils.isDefined)(restoredConfiguration) && {
                    universalConfiguration: (0, _frompagelayoutwidgetconfigurationtouniversalconfigurationutil.fromPageLayoutWidgetConfigurationToUniversalConfiguration)({
                        configuration: restoredConfiguration,
                        fieldMetadataUniversalIdentifierById: flatFieldMetadataMaps.universalIdentifierById,
                        frontComponentUniversalIdentifierById: flatFrontComponentMaps.universalIdentifierById,
                        viewFieldGroupUniversalIdentifierById: flatViewFieldGroupMaps.universalIdentifierById,
                        viewUniversalIdentifierById: flatViewMaps.universalIdentifierById
                    })
                }
            };
        });
        const widgetsToDelete = idsToDelete.map((widgetId)=>{
            const existingWidget = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: widgetId,
                flatEntityMaps: flatPageLayoutWidgetMaps
            });
            if (!(0, _utils.isDefined)(existingWidget)) {
                return null;
            }
            return {
                ...existingWidget,
                deletedAt: now.toISOString(),
                updatedAt: now.toISOString()
            };
        }).filter(_utils.isDefined);
        return {
            widgetsToCreate,
            widgetsToUpdate: [
                ...widgetsToUpdate,
                ...widgetsToRestoreAndUpdate,
                ...widgetsToDelete
            ]
        };
    }
    validateChartFieldReferences({ widgetInput, flatFieldMetadataMaps, flatObjectMetadataMaps }) {
        if (!(0, _utils.isDefined)(widgetInput.configuration)) {
            return;
        }
        (0, _validatechartconfigurationfieldreferencesutil.validateChartConfigurationFieldReferencesOrThrow)({
            widgetConfiguration: widgetInput.configuration,
            widgetObjectMetadataId: widgetInput.objectMetadataId,
            widgetTitle: widgetInput.title,
            flatFieldMetadataMaps,
            flatObjectMetadataMaps
        });
    }
    collectOrphanedViewIdsFromDeletedWidgets({ widgetsToUpdate, tabsToUpdate, flatPageLayoutWidgetMaps }) {
        const viewIdsToDelete = new Set();
        const directlyDeletedWidgetIds = new Set();
        for (const widget of widgetsToUpdate){
            if ((0, _utils.isDefined)(widget.deletedAt)) {
                directlyDeletedWidgetIds.add(widget.id);
                const viewId = this.getViewIdFromFieldsWidget(widget);
                if ((0, _utils.isDefined)(viewId)) {
                    viewIdsToDelete.add(viewId);
                }
            }
        }
        const deletedTabIds = new Set(tabsToUpdate.filter((tab)=>(0, _utils.isDefined)(tab.deletedAt)).map((tab)=>tab.id));
        const allExistingWidgets = Object.values(flatPageLayoutWidgetMaps.byUniversalIdentifier).filter(_utils.isDefined);
        for (const widget of allExistingWidgets){
            if (!(0, _utils.isDefined)(widget.deletedAt) && deletedTabIds.has(widget.pageLayoutTabId)) {
                const viewId = this.getViewIdFromFieldsWidget(widget);
                if ((0, _utils.isDefined)(viewId)) {
                    viewIdsToDelete.add(viewId);
                }
            }
        }
        for (const widget of allExistingWidgets){
            if (!(0, _utils.isDefined)(widget.deletedAt) && !directlyDeletedWidgetIds.has(widget.id) && !deletedTabIds.has(widget.pageLayoutTabId)) {
                const viewId = this.getViewIdFromFieldsWidget(widget);
                if ((0, _utils.isDefined)(viewId)) {
                    viewIdsToDelete.delete(viewId);
                }
            }
        }
        return [
            ...viewIdsToDelete
        ];
    }
    getViewIdFromFieldsWidget(widget) {
        if (widget.configuration.configurationType !== _widgetconfigurationtypetype.WidgetConfigurationType.FIELDS) {
            return undefined;
        }
        const viewId = widget.configuration.viewId;
        return typeof viewId === 'string' ? viewId : undefined;
    }
    async destroyOrphanedFieldsWidgetViews({ viewIds, workspaceId }) {
        for (const viewId of viewIds){
            try {
                await this.viewService.destroyOne({
                    destroyViewInput: {
                        id: viewId
                    },
                    workspaceId
                });
            } catch (error) {
                this.logger.warn(`Failed to destroy view ${viewId} after Fields widget deletion: ${error}`);
            }
        }
    }
    constructor(workspaceMigrationValidateBuildAndRunService, workspaceManyOrAllFlatEntityMapsCacheService, applicationService, dashboardSyncService, viewService){
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.applicationService = applicationService;
        this.dashboardSyncService = dashboardSyncService;
        this.viewService = viewService;
        this.logger = new _common.Logger(PageLayoutUpdateService.name);
    }
};
PageLayoutUpdateService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _dashboardsyncservice.DashboardSyncService === "undefined" ? Object : _dashboardsyncservice.DashboardSyncService,
        typeof _viewservice.ViewService === "undefined" ? Object : _viewservice.ViewService
    ])
], PageLayoutUpdateService);

//# sourceMappingURL=page-layout-update.service.js.map