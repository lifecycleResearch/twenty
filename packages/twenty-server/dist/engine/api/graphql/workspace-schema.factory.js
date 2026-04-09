"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceSchemaFactory", {
    enumerable: true,
    get: function() {
        return WorkspaceSchemaFactory;
    }
});
const _common = require("@nestjs/common");
const _schema = require("@graphql-tools/schema");
const _guards = require("@sniptt/guards");
const _graphql = require("graphql");
const _graphqltag = require("graphql-tag");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _scalarsexplorerservice = require("./services/scalars-explorer.service");
const _factories = require("./workspace-resolver-builder/factories/factories");
const _workspaceresolverfactory = require("./workspace-resolver-builder/workspace-resolver.factory");
const _workspacegraphqlschemafactory = require("./workspace-schema-builder/workspace-graphql-schema.factory");
const _featureflagservice = require("../../core-modules/feature-flag/services/feature-flag.service");
const _datasourceservice = require("../../metadata-modules/data-source/data-source.service");
const _flatentitymapsexception = require("../../metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const _workspacemanyorallflatentitymapscacheservice = require("../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _getsubflatentitymapsbyapplicationidsorthrowutil = require("../../metadata-modules/flat-entity/utils/get-sub-flat-entity-maps-by-application-ids-or-throw.util");
const _buildobjectidbynamemapsutil = require("../../metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util");
const _workspacecachestorageservice = require("../../workspace-cache-storage/workspace-cache-storage.service");
const _twentystandardapplications = require("../../workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkspaceSchemaFactory = class WorkspaceSchemaFactory {
    async createGraphQLSchema(workspace, applicationId) {
        const isDataSourceMigrated = await this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_DATASOURCE_MIGRATED, workspace.id);
        const hasSchema = isDataSourceMigrated ? (0, _guards.isNonEmptyString)(workspace.databaseSchema) : (await this.dataSourceService.getDataSourcesMetadataFromWorkspaceId(workspace.id)).length > 0;
        if (!hasSchema) {
            return new _graphql.GraphQLSchema({});
        }
        const { flatObjectMetadataMaps: allFlatObjectMetadataMaps, flatFieldMetadataMaps: allFlatFieldMetadataMaps, flatIndexMaps: allFlatIndexMaps, flatApplicationMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId: workspace.id,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMaps',
                'flatIndexMaps',
                'flatApplicationMaps'
            ]
        });
        if (!(0, _utils.isDefined)(allFlatObjectMetadataMaps)) {
            throw new _flatentitymapsexception.FlatEntityMapsException('Object metadata collection not found', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
        }
        if (!(0, _utils.isDefined)(allFlatFieldMetadataMaps)) {
            throw new _flatentitymapsexception.FlatEntityMapsException('Field metadata collection not found', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
        }
        let flatObjectMetadataMaps = allFlatObjectMetadataMaps;
        let flatFieldMetadataMaps = allFlatFieldMetadataMaps;
        let flatIndexMaps = allFlatIndexMaps;
        if ((0, _utils.isDefined)(applicationId)) {
            const twentyStandardApplicationId = flatApplicationMaps?.idByUniversalIdentifier[_twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier];
            const applicationIds = (0, _utils.isDefined)(twentyStandardApplicationId) ? [
                twentyStandardApplicationId,
                applicationId
            ] : [
                applicationId
            ];
            flatObjectMetadataMaps = this.filterFlatEntityMapsByApplicationIds(allFlatObjectMetadataMaps, applicationIds);
            flatFieldMetadataMaps = this.filterFlatEntityMapsByApplicationIds(allFlatFieldMetadataMaps, applicationIds);
            flatObjectMetadataMaps = this.reconcileObjectFieldIdsWithFilteredFieldMaps(flatObjectMetadataMaps, flatFieldMetadataMaps);
            if ((0, _utils.isDefined)(allFlatIndexMaps)) {
                flatIndexMaps = this.filterFlatEntityMapsByApplicationIds(allFlatIndexMaps, applicationIds);
            }
        }
        let metadataVersion = await this.workspaceCacheStorageService.getMetadataVersion(workspace.id);
        if (!(0, _utils.isDefined)(metadataVersion)) {
            metadataVersion = (0, _utils.isDefined)(workspace.metadataVersion) ? workspace.metadataVersion : 0;
            await this.workspaceCacheStorageService.setMetadataVersion(workspace.id, metadataVersion);
        }
        const { idByNameSingular } = (0, _buildobjectidbynamemapsutil.buildObjectIdByNameMaps)(flatObjectMetadataMaps);
        let typeDefs = await this.workspaceCacheStorageService.getGraphQLTypeDefs(workspace.id, metadataVersion, applicationId);
        let usedScalarNames = await this.workspaceCacheStorageService.getGraphQLUsedScalarNames(workspace.id, metadataVersion, applicationId);
        if (!typeDefs || !usedScalarNames) {
            const autoGeneratedSchema = await this.workspaceGraphQLSchemaGenerator.generateSchema({
                flatObjectMetadataMaps,
                flatFieldMetadataMaps,
                flatIndexMaps
            });
            usedScalarNames = this.scalarsExplorerService.getUsedScalarNames(autoGeneratedSchema);
            typeDefs = (0, _graphql.printSchema)(autoGeneratedSchema);
            await this.workspaceCacheStorageService.setGraphQLTypeDefs(workspace.id, metadataVersion, typeDefs, applicationId);
            await this.workspaceCacheStorageService.setGraphQLUsedScalarNames(workspace.id, metadataVersion, usedScalarNames, applicationId);
        }
        const autoGeneratedResolvers = await this.workspaceResolverFactory.create(flatObjectMetadataMaps, flatFieldMetadataMaps, idByNameSingular, _factories.workspaceResolverBuilderMethodNames);
        const scalarsResolvers = this.scalarsExplorerService.getScalarResolvers(usedScalarNames);
        const executableSchema = (0, _schema.makeExecutableSchema)({
            typeDefs: (0, _graphqltag.gql)`
        ${typeDefs}
      `,
            resolvers: {
                ...scalarsResolvers,
                ...autoGeneratedResolvers
            }
        });
        return executableSchema;
    }
    reconcileObjectFieldIdsWithFilteredFieldMaps(flatObjectMetadataMaps, flatFieldMetadataMaps) {
        const filteredFieldIds = new Set(Object.keys(flatFieldMetadataMaps.universalIdentifierById));
        const reconciledByUniversalIdentifier = {};
        for (const [universalId, object] of Object.entries(flatObjectMetadataMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(object)) continue;
            reconciledByUniversalIdentifier[universalId] = {
                ...object,
                fieldIds: object.fieldIds.filter((id)=>filteredFieldIds.has(id))
            };
        }
        return {
            ...flatObjectMetadataMaps,
            byUniversalIdentifier: reconciledByUniversalIdentifier
        };
    }
    filterFlatEntityMapsByApplicationIds(flatEntityMaps, applicationIds) {
        return (0, _getsubflatentitymapsbyapplicationidsorthrowutil.getSubFlatEntityMapsByApplicationIdsOrThrow)({
            applicationIds,
            flatEntityMaps
        });
    }
    constructor(scalarsExplorerService, workspaceGraphQLSchemaGenerator, workspaceResolverFactory, workspaceCacheStorageService, workspaceManyOrAllFlatEntityMapsCacheService, featureFlagService, dataSourceService){
        this.scalarsExplorerService = scalarsExplorerService;
        this.workspaceGraphQLSchemaGenerator = workspaceGraphQLSchemaGenerator;
        this.workspaceResolverFactory = workspaceResolverFactory;
        this.workspaceCacheStorageService = workspaceCacheStorageService;
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.featureFlagService = featureFlagService;
        this.dataSourceService = dataSourceService;
    }
};
WorkspaceSchemaFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _scalarsexplorerservice.ScalarsExplorerService === "undefined" ? Object : _scalarsexplorerservice.ScalarsExplorerService,
        typeof _workspacegraphqlschemafactory.WorkspaceGraphQLSchemaGenerator === "undefined" ? Object : _workspacegraphqlschemafactory.WorkspaceGraphQLSchemaGenerator,
        typeof _workspaceresolverfactory.WorkspaceResolverFactory === "undefined" ? Object : _workspaceresolverfactory.WorkspaceResolverFactory,
        typeof _workspacecachestorageservice.WorkspaceCacheStorageService === "undefined" ? Object : _workspacecachestorageservice.WorkspaceCacheStorageService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService
    ])
], WorkspaceSchemaFactory);

//# sourceMappingURL=workspace-schema.factory.js.map