"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillMessageChannelMessageAssociationMessageFolderCommand", {
    enumerable: true,
    get: function() {
        return BackfillMessageChannelMessageAssociationMessageFolderCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _findflatentitybyuniversalidentifierorthrowutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier-or-throw.util");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-many-flat-entity-by-universal-identifier-in-universal-flat-entity-maps-or-throw.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../engine/metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
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
const OBJECT_UNIVERSAL_IDENTIFIER_TO_CREATE = _metadata.STANDARD_OBJECTS.messageChannelMessageAssociationMessageFolder.universalIdentifier;
const FIELD_UNIVERSAL_IDENTIFIERS_TO_CREATE = Object.values(_metadata.STANDARD_OBJECTS.messageChannelMessageAssociationMessageFolder.fields).map((el)=>el.universalIdentifier);
let BackfillMessageChannelMessageAssociationMessageFolderCommand = class BackfillMessageChannelMessageAssociationMessageFolderCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Starting backfill of messageChannelMessageAssociationMessageFolder for workspace ${workspaceId}`);
        const { flatObjectMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatObjectMetadataMaps'
        ]);
        const existingObject = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER_TO_CREATE
        });
        if (existingObject) {
            this.logger.log(`messageChannelMessageAssociationMessageFolder object already exists for workspace ${workspaceId}, skipping`);
            return;
        }
        if (isDryRun) {
            this.logger.log(`[DRY RUN] Would create messageChannelMessageAssociationMessageFolder object and relation fields for workspace ${workspaceId}`);
            return;
        }
        const { twentyStandardFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { allFlatEntityMaps: standardAllFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
            now: new Date().toISOString(),
            workspaceId,
            twentyStandardApplicationId: twentyStandardFlatApplication.id
        });
        const flatObjectMetadataToCreate = (0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
            flatEntityMaps: standardAllFlatEntityMaps.flatObjectMetadataMaps,
            universalIdentifier: OBJECT_UNIVERSAL_IDENTIFIER_TO_CREATE
        });
        const flatFieldMetadataToCreateOnObject = (0, _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil.findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMapsOrThrow)({
            flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
            universalIdentifiers: FIELD_UNIVERSAL_IDENTIFIERS_TO_CREATE
        });
        const relatedFlatFieldMetadataToCreate = flatFieldMetadataToCreateOnObject.map((flatFieldMetadata)=>{
            if (!(0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(flatFieldMetadata)) {
                return undefined;
            }
            return (0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
                flatEntityMaps: standardAllFlatEntityMaps.flatFieldMetadataMaps,
                universalIdentifier: flatFieldMetadata.relationTargetFieldMetadataUniversalIdentifier
            });
        }).filter(_utils.isDefined);
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                objectMetadata: {
                    flatEntityToCreate: [
                        flatObjectMetadataToCreate
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                fieldMetadata: {
                    flatEntityToCreate: [
                        ...flatFieldMetadataToCreateOnObject,
                        ...relatedFlatFieldMetadataToCreate
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            applicationUniversalIdentifier: twentyStandardFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            this.logger.error(`Failed to create messageChannelMessageAssociationMessageFolder:\n${JSON.stringify(validateAndBuildResult, null, 2)}`);
            throw new Error(`Failed to create messageChannelMessageAssociationMessageFolder for workspace ${workspaceId}`);
        }
        this.logger.log(`Successfully created messageChannelMessageAssociationMessageFolder for workspace ${workspaceId}`);
    }
    constructor(workspaceRepository, twentyORMGlobalManager, dataSourceService, applicationService, workspaceCacheService, workspaceMigrationValidateBuildAndRunService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
    }
};
BackfillMessageChannelMessageAssociationMessageFolderCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-19:backfill-message-channel-message-association-message-folder',
        description: 'Backfill messageChannelMessageAssociationMessageFolder standard object and its relation fields'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService
    ])
], BackfillMessageChannelMessageAssociationMessageFolderCommand);

//# sourceMappingURL=1-19-backfill-message-channel-message-association-message-folder.command.js.map