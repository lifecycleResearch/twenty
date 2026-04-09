"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DevSeederService", {
    enumerable: true,
    get: function() {
        return DevSeederService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _metadata = require("twenty-shared/metadata");
const _typeorm1 = require("typeorm");
const _applicationregistrationservice = require("../../../core-modules/application/application-registration/application-registration.service");
const _applicationservice = require("../../../core-modules/application/application.service");
const _sdkclientgenerationservice = require("../../../core-modules/sdk-client/sdk-client-generation.service");
const _twentyconfigservice = require("../../../core-modules/twenty-config/twenty-config.service");
const _datasourceservice = require("../../../metadata-modules/data-source/data-source.service");
const _getmetadataflatentitymapskeyutil = require("../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _objectmetadataentity = require("../../../metadata-modules/object-metadata/object-metadata.entity");
const _workspacecachestorageservice = require("../../../workspace-cache-storage/workspace-cache-storage.service");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _workspacedatasourceservice = require("../../../workspace-datasource/workspace-datasource.service");
const _devseederpermissionsservice = require("../core/services/dev-seeder-permissions.service");
const _seedcoreschemautil = require("../core/utils/seed-core-schema.util");
const _seedpagelayouttabsutil = require("../core/utils/seed-page-layout-tabs.util");
const _seedpagelayoutwidgetsutil = require("../core/utils/seed-page-layout-widgets.util");
const _seedpagelayoutsutil = require("../core/utils/seed-page-layouts.util");
const _devseederdataservice = require("../data/services/dev-seeder-data.service");
const _devseedermetadataservice = require("../metadata/services/dev-seeder-metadata.service");
const _twentystandardapplicationservice = require("../../twenty-standard-application/services/twenty-standard-application.service");
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
let DevSeederService = class DevSeederService {
    async seedDev(workspaceId, options) {
        const light = options?.light ?? false;
        const isBillingEnabled = this.twentyConfigService.get('IS_BILLING_ENABLED');
        const appVersion = this.twentyConfigService.get('APP_VERSION');
        await (0, _seedcoreschemautil.seedCoreSchema)({
            dataSource: this.coreDataSource,
            workspaceId,
            applicationService: this.applicationService,
            seedBilling: isBillingEnabled,
            appVersion
        });
        await this.applicationRegistrationService.createCliRegistrationIfNotExists();
        const schemaName = await this.workspaceDataSourceService.createWorkspaceDBSchema(workspaceId);
        const { featureFlagsMap } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatApplicationMaps',
            'featureFlagsMap'
        ]);
        const dataSourceMetadata = await this.dataSourceService.createDataSourceMetadata(workspaceId, schemaName);
        const { workspaceCustomFlatApplication, twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        await this.twentyStandardApplicationService.synchronizeTwentyStandardApplicationOrThrow({
            workspaceId
        });
        await this.sdkClientGenerationService.generateSdkClientForApplication({
            workspaceId,
            applicationId: twentyStandardFlatApplication.id,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        await this.devSeederMetadataService.seed({
            dataSourceMetadata,
            workspaceId,
            light
        });
        await this.sdkClientGenerationService.generateSdkClientForApplication({
            workspaceId,
            applicationId: workspaceCustomFlatApplication.id,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        await this.devSeederMetadataService.seedRelations({
            workspaceId,
            light
        });
        await this.devSeederPermissionsService.initPermissions({
            workspaceId,
            twentyStandardFlatApplication,
            workspaceCustomFlatApplication,
            light
        });
        await (0, _seedpagelayoutsutil.seedPageLayouts)(this.coreDataSource, 'core', workspaceId, workspaceCustomFlatApplication.id);
        await (0, _seedpagelayouttabsutil.seedPageLayoutTabs)({
            applicationId: workspaceCustomFlatApplication.id,
            workspaceId,
            dataSource: this.coreDataSource,
            schemaName: 'core'
        });
        const objectMetadataRepository = this.coreDataSource.getRepository(_objectmetadataentity.ObjectMetadataEntity);
        const objectMetadataItems = await objectMetadataRepository.find({
            where: {
                workspaceId
            },
            relations: {
                fields: true
            }
        });
        await (0, _seedpagelayoutwidgetsutil.seedPageLayoutWidgets)({
            dataSource: this.coreDataSource,
            schemaName: 'core',
            workspaceId,
            objectMetadataItems,
            workspaceCustomApplicationId: workspaceCustomFlatApplication.id
        });
        const relatedPageLayoutCacheKeysToInvalidate = [
            ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)(_metadata.ALL_METADATA_NAME.pageLayout),
            ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)(_metadata.ALL_METADATA_NAME.pageLayoutTab),
            ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)(_metadata.ALL_METADATA_NAME.pageLayoutWidget)
        ].map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey);
        await this.workspaceCacheService.invalidateAndRecompute(workspaceId, relatedPageLayoutCacheKeysToInvalidate);
        await this.devSeederDataService.seed({
            schemaName: dataSourceMetadata.schema,
            workspaceId,
            featureFlags: featureFlagsMap,
            light
        });
        await this.workspaceCacheStorageService.flush(workspaceId, undefined);
    }
    constructor(workspaceCacheStorageService, twentyConfigService, workspaceDataSourceService, dataSourceService, twentyStandardApplicationService, devSeederMetadataService, devSeederPermissionsService, devSeederDataService, applicationService, applicationRegistrationService, workspaceCacheService, sdkClientGenerationService, coreDataSource){
        this.workspaceCacheStorageService = workspaceCacheStorageService;
        this.twentyConfigService = twentyConfigService;
        this.workspaceDataSourceService = workspaceDataSourceService;
        this.dataSourceService = dataSourceService;
        this.twentyStandardApplicationService = twentyStandardApplicationService;
        this.devSeederMetadataService = devSeederMetadataService;
        this.devSeederPermissionsService = devSeederPermissionsService;
        this.devSeederDataService = devSeederDataService;
        this.applicationService = applicationService;
        this.applicationRegistrationService = applicationRegistrationService;
        this.workspaceCacheService = workspaceCacheService;
        this.sdkClientGenerationService = sdkClientGenerationService;
        this.coreDataSource = coreDataSource;
        this.logger = new _common.Logger(DevSeederService.name);
    }
};
DevSeederService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(12, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacecachestorageservice.WorkspaceCacheStorageService === "undefined" ? Object : _workspacecachestorageservice.WorkspaceCacheStorageService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _workspacedatasourceservice.WorkspaceDataSourceService === "undefined" ? Object : _workspacedatasourceservice.WorkspaceDataSourceService,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _twentystandardapplicationservice.TwentyStandardApplicationService === "undefined" ? Object : _twentystandardapplicationservice.TwentyStandardApplicationService,
        typeof _devseedermetadataservice.DevSeederMetadataService === "undefined" ? Object : _devseedermetadataservice.DevSeederMetadataService,
        typeof _devseederpermissionsservice.DevSeederPermissionsService === "undefined" ? Object : _devseederpermissionsservice.DevSeederPermissionsService,
        typeof _devseederdataservice.DevSeederDataService === "undefined" ? Object : _devseederdataservice.DevSeederDataService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _sdkclientgenerationservice.SdkClientGenerationService === "undefined" ? Object : _sdkclientgenerationservice.SdkClientGenerationService,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], DevSeederService);

//# sourceMappingURL=dev-seeder.service.js.map