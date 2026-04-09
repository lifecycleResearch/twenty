"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceDataSourceService", {
    enumerable: true,
    get: function() {
        return WorkspaceDataSourceService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _typeorm1 = require("typeorm");
const _featureflagservice = require("../core-modules/feature-flag/services/feature-flag.service");
const _workspaceentity = require("../core-modules/workspace/workspace.entity");
const _datasourceservice = require("../metadata-modules/data-source/data-source.service");
const _permissionsexception = require("../metadata-modules/permissions/permissions.exception");
const _getworkspaceschemanameutil = require("./utils/get-workspace-schema-name.util");
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
let WorkspaceDataSourceService = class WorkspaceDataSourceService {
    async checkSchemaExists(workspaceId) {
        const isDataSourceMigrated = await this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_DATASOURCE_MIGRATED, workspaceId);
        if (isDataSourceMigrated) {
            const workspace = await this.workspaceRepository.findOne({
                select: [
                    'databaseSchema'
                ],
                where: {
                    id: workspaceId
                }
            });
            return (0, _guards.isNonEmptyString)(workspace?.databaseSchema);
        }
        const dataSources = await this.dataSourceService.getDataSourcesMetadataFromWorkspaceId(workspaceId);
        return dataSources.length > 0;
    }
    /**
   *
   * Create a new DB schema for a workspace
   *
   * @param workspaceId
   * @returns
   */ async createWorkspaceDBSchema(workspaceId) {
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const queryRunner = this.coreDataSource.createQueryRunner();
        try {
            await queryRunner.createSchema(schemaName, true);
            return schemaName;
        } finally{
            await queryRunner.release();
        }
    }
    /**
   *
   * Delete a DB schema for a workspace
   *
   * @param workspaceId
   * @returns
   */ async deleteWorkspaceDBSchema(workspaceId) {
        const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(workspaceId);
        const queryRunner = this.coreDataSource.createQueryRunner();
        try {
            await queryRunner.dropSchema(schemaName, true, true);
        } finally{
            await queryRunner.release();
        }
    }
    async executeRawQuery(_query, // oxlint-disable-next-line @typescripttypescript/no-explicit-any
    _parameters = [], _workspaceId, _transactionManager) {
        throw new _permissionsexception.PermissionsException('Method not allowed as permissions are not handled at datasource level.', _permissionsexception.PermissionsExceptionCode.METHOD_NOT_ALLOWED, {
            userFriendlyMessage: /*i18n*/ {
                id: "eitC3W",
                message: "This operation is not allowed. Please try a different approach or contact support if you need assistance."
            }
        });
    }
    constructor(workspaceRepository, coreDataSource, featureFlagService, dataSourceService){
        this.workspaceRepository = workspaceRepository;
        this.coreDataSource = coreDataSource;
        this.featureFlagService = featureFlagService;
        this.dataSourceService = dataSourceService;
    }
};
WorkspaceDataSourceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(1, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof DataSource === "undefined" ? Object : DataSource,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService
    ])
], WorkspaceDataSourceService);

//# sourceMappingURL=workspace-datasource.service.js.map