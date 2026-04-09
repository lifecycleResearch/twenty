"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FlatCacheInvalidateCommand", {
    enumerable: true,
    get: function() {
        return FlatCacheInvalidateCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _metadata = require("twenty-shared/metadata");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../../../../database/commands/command-runners/active-or-suspended-workspaces-migration.command-runner");
const _workspaceentity = require("../../../../core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../metadata-modules/data-source/data-source.service");
const _getmetadataflatentitymapskeyutil = require("../../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _globalworkspaceormmanager = require("../../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _workspacemigrationrunnerservice = require("../services/workspace-migration-runner.service");
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
let FlatCacheInvalidateCommand = class FlatCacheInvalidateCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    parseMetadataName(val) {
        this.metadataNames.push(val);
        return this.metadataNames;
    }
    parseAllMetadata() {
        return true;
    }
    async runMigrationCommand(passedParams, options) {
        if (!options.allMetadata && this.metadataNames.length === 0) {
            this.logger.error('Either --all-metadata or at least one --metadataName must be provided.');
            return;
        }
        const validatedMetadataNames = this.validateAndExpandMetadataNames({
            inputMetadataNames: this.metadataNames,
            allMetadata: options.allMetadata
        });
        if (validatedMetadataNames === null) {
            return;
        }
        this.flatMapsKeysToFlush = this.computeFlatMapsKeysWithRelated(validatedMetadataNames);
        this.logger.log(`Will flush cache for the following flat maps keys: ${this.flatMapsKeysToFlush.join(', ')}`);
        await super.runMigrationCommand(passedParams, options);
    }
    async runOnWorkspace({ workspaceId }) {
        await this.workspaceMigrationRunnerService.invalidateCache({
            allFlatEntityMapsKeys: this.flatMapsKeysToFlush,
            workspaceId
        });
        this.logger.log(`Successfully invalidated cache for workspace: ${workspaceId}`);
    }
    validateAndExpandMetadataNames({ inputMetadataNames, allMetadata }) {
        const validMetadataNames = Object.keys(_metadata.ALL_METADATA_NAME);
        if (allMetadata) {
            this.logger.log('Using all metadata names');
            return validMetadataNames;
        }
        const invalidNames = inputMetadataNames.filter((name)=>!validMetadataNames.includes(name));
        if (invalidNames.length > 0) {
            this.logger.error(`Invalid metadata name(s) provided: ${invalidNames.join(', ')}`);
            this.logger.error(`Valid metadata names are: ${validMetadataNames.join(', ')}, or use --all-metadata`);
            return null;
        }
        return inputMetadataNames;
    }
    computeFlatMapsKeysWithRelated(metadataNames) {
        const allMetadataNamesToFlush = [
            ...new Set([
                ...metadataNames,
                ...metadataNames.flatMap(_getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)
            ])
        ];
        const allFlatMapsKeys = allMetadataNamesToFlush.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey);
        return allFlatMapsKeys;
    }
    constructor(workspaceRepository, globalWorkspaceOrmManager, dataSourceService, workspaceMigrationRunnerService){
        super(workspaceRepository, globalWorkspaceOrmManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.globalWorkspaceOrmManager = globalWorkspaceOrmManager, this.dataSourceService = dataSourceService, this.workspaceMigrationRunnerService = workspaceMigrationRunnerService, this.metadataNames = [], this.flatMapsKeysToFlush = [];
    }
};
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--metadataName <metadataName>',
        description: 'Metadata name(s) to flush cache for. Can be specified multiple times.',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Array)
], FlatCacheInvalidateCommand.prototype, "parseMetadataName", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--all-metadata',
        description: 'Flush cache for all metadata names. Takes precedence over --metadataName.',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Boolean)
], FlatCacheInvalidateCommand.prototype, "parseAllMetadata", null);
FlatCacheInvalidateCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'cache:flat-cache-invalidate',
        description: 'Flush flat entity cache for specific metadata names and workspaces'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService === "undefined" ? Object : _workspacemigrationrunnerservice.WorkspaceMigrationRunnerService
    ])
], FlatCacheInvalidateCommand);

//# sourceMappingURL=flat-cache-invalidate.command.js.map