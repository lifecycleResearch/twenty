"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddMissingSystemFieldsToStandardObjectsCommand", {
    enumerable: true,
    get: function() {
        return AddMissingSystemFieldsToStandardObjectsCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../command-runners/active-or-suspended-workspaces-migration.command-runner");
const _1771420702241addmissingsystemfieldstostandardobjects = require("../workspace-migrations/1771420702241-add-missing-system-fields-to-standard-objects");
const _workspacemigrationrunnerexception = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/exceptions/workspace-migration-runner.exception");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
const _workspacemigrationrunnerservice = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/services/workspace-migration-runner.service");
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
const { applicationUniversalIdentifier, actions: allActions } = _1771420702241addmissingsystemfieldstostandardobjects.ADD_MISSING_SYSTEM_FIELDS_TO_STANDARD_OBJECTS_1771420702241;
const NON_TS_VECTOR_MIGRATION = {
    applicationUniversalIdentifier,
    actions: allActions.filter((action)=>action.flatEntity.type !== _types.FieldMetadataType.TS_VECTOR)
};
const TS_VECTOR_INDIVIDUAL_MIGRATIONS = allActions.filter((action)=>action.flatEntity.type === _types.FieldMetadataType.TS_VECTOR).map((action)=>({
        universalIdentifier: action.flatEntity.universalIdentifier,
        fieldName: action.flatEntity.name,
        objectIdentifier: action.flatEntity.objectMetadataUniversalIdentifier,
        migration: {
            applicationUniversalIdentifier,
            actions: [
                action
            ]
        }
    }));
const NON_TS_VECTOR_INDIVIDUAL_MIGRATIONS = allActions.filter((action)=>action.flatEntity.type !== _types.FieldMetadataType.TS_VECTOR).map((action)=>({
        universalIdentifier: action.flatEntity.universalIdentifier,
        fieldName: action.flatEntity.name,
        objectIdentifier: action.flatEntity.objectMetadataUniversalIdentifier,
        migration: {
            applicationUniversalIdentifier,
            actions: [
                action
            ]
        }
    }));
const FIRST_NON_TS_VECTOR_UNIVERSAL_IDENTIFIER = allActions[0].flatEntity.universalIdentifier;
const DUPLICATE_KEY_MESSAGE = 'duplicate key value violates unique constraint';
const getNestedErrorMessages = (error)=>{
    const nestedErrors = error.errors;
    if (!(0, _utils.isDefined)(nestedErrors)) {
        return undefined;
    }
    const details = [
        nestedErrors.metadata && `metadata: ${nestedErrors.metadata.message}`,
        nestedErrors.workspaceSchema && `workspaceSchema: ${nestedErrors.workspaceSchema.message}`,
        nestedErrors.actionTranspilation && `actionTranspilation: ${nestedErrors.actionTranspilation.message}`
    ].filter(_utils.isDefined).join('; ');
    return details || undefined;
};
const isUniqueViolationError = (error)=>{
    if (error.message.includes(DUPLICATE_KEY_MESSAGE)) {
        return true;
    }
    if (error instanceof _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException) {
        const nestedMessages = getNestedErrorMessages(error);
        return nestedMessages?.includes(DUPLICATE_KEY_MESSAGE) === true;
    }
    return false;
};
const enrichErrorMessage = (error)=>{
    if (!(error instanceof _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException)) {
        return error;
    }
    const details = getNestedErrorMessages(error);
    if ((0, _utils.isDefined)(details)) {
        error.message = `${error.message} (${details})`;
    }
    return error;
};
let AddMissingSystemFieldsToStandardObjectsCommand = class AddMissingSystemFieldsToStandardObjectsCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runIndividualMigrations(workspaceId, migrations) {
        for (const entry of migrations){
            const alreadyCreated = await this.hasFieldBeenCreated(workspaceId, entry.universalIdentifier);
            if (alreadyCreated) {
                continue;
            }
            this.logger.log(`Adding field ${entry.fieldName} on object ${entry.objectIdentifier} in workspace ${workspaceId}`);
            try {
                await this.workspaceMigrationRunnerService.run({
                    workspaceId,
                    workspaceMigration: entry.migration
                });
            } catch (error) {
                if (!isUniqueViolationError(error)) {
                    throw enrichErrorMessage(error);
                }
                this.logger.warn(`Field ${entry.fieldName} on object ${entry.objectIdentifier} already exists in workspace ${workspaceId}, skipping`);
            }
        }
    }
    async hasFieldBeenCreated(workspaceId, universalIdentifier) {
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        return (0, _utils.isDefined)(flatFieldMetadataMaps.byUniversalIdentifier[universalIdentifier]);
    }
    async runOnWorkspace({ workspaceId, options }) {
        const dryRun = options?.dryRun ?? false;
        this.logger.log(`${dryRun ? '[DRY RUN] ' : ''}Adding missing system fields to standard objects in workspace ${workspaceId}`);
        if (dryRun) {
            this.logger.log(`[DRY RUN] Would add ${NON_TS_VECTOR_MIGRATION.actions.length} non-tsVector fields and ${TS_VECTOR_INDIVIDUAL_MIGRATIONS.length} tsVector fields to standard objects in workspace ${workspaceId}. Skipping.`);
            return;
        }
        const nonTsVectorAlreadyRan = await this.hasFieldBeenCreated(workspaceId, FIRST_NON_TS_VECTOR_UNIVERSAL_IDENTIFIER);
        if (!nonTsVectorAlreadyRan) {
            this.logger.log(`Adding ${NON_TS_VECTOR_MIGRATION.actions.length} non-tsVector fields (position, createdBy, updatedBy) in workspace ${workspaceId}`);
            try {
                await this.workspaceMigrationRunnerService.run({
                    workspaceId,
                    workspaceMigration: NON_TS_VECTOR_MIGRATION
                });
            } catch (error) {
                if (!isUniqueViolationError(error)) {
                    throw enrichErrorMessage(error);
                }
                this.logger.warn(`Batch non-tsVector migration hit a duplicate field in workspace ${workspaceId}, falling back to individual field migrations`);
                await this.runIndividualMigrations(workspaceId, NON_TS_VECTOR_INDIVIDUAL_MIGRATIONS);
            }
        } else {
            this.logger.log(`Non-tsVector fields already exist in workspace ${workspaceId}, skipping.`);
        }
        await this.runIndividualMigrations(workspaceId, TS_VECTOR_INDIVIDUAL_MIGRATIONS);
        this.logger.log(`Successfully added missing system fields to standard objects in workspace ${workspaceId}`);
    }
    constructor(workspaceRepository, twentyORMGlobalManager, dataSourceService, workspaceCacheService, workspaceMigrationRunnerService){
        super(workspaceRepository, twentyORMGlobalManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.twentyORMGlobalManager = twentyORMGlobalManager, this.dataSourceService = dataSourceService, this.workspaceCacheService = workspaceCacheService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService;
    }
};
AddMissingSystemFieldsToStandardObjectsCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade:1-19:add-missing-system-fields-to-standard-objects',
        description: 'Add missing system fields (position, searchVector, createdBy, updatedBy) to standard objects'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService
    ])
], AddMissingSystemFieldsToStandardObjectsCommand);

//# sourceMappingURL=1-19-add-missing-system-fields-to-standard-objects.command.js.map