"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DataSourceService", {
    enumerable: true,
    get: function() {
        return DataSourceService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _workspaceentity = require("../../core-modules/workspace/workspace.entity");
const _datasourceexception = require("./data-source.exception");
const _datasourceentity = require("./data-source.entity");
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
let DataSourceService = class DataSourceService {
    async createDataSourceMetadata(workspaceId, workspaceSchema) {
        const dataSource = await this.dataSourceMetadataRepository.findOne({
            where: {
                workspaceId
            }
        });
        // Dual-write: always keep workspace.databaseSchema in sync
        await this.workspaceRepository.update(workspaceId, {
            databaseSchema: workspaceSchema
        });
        if (dataSource) {
            return dataSource;
        }
        return this.dataSourceMetadataRepository.save({
            workspaceId,
            schema: workspaceSchema
        });
    }
    // @deprecated - Use workspace.activationStatus or workspace.databaseSchema
    // to check if a workspace has been initialized instead.
    async getManyDataSourceMetadata(options = {}) {
        return this.dataSourceMetadataRepository.find(options);
    }
    // @deprecated - Use workspace.databaseSchema or
    // getWorkspaceSchemaName(workspaceId) instead.
    async getDataSourcesMetadataFromWorkspaceId(workspaceId) {
        return this.dataSourceMetadataRepository.find({
            where: {
                workspaceId
            },
            order: {
                createdAt: 'DESC'
            }
        });
    }
    // @deprecated - Use workspace.databaseSchema or
    // getWorkspaceSchemaName(workspaceId) instead.
    async getLastDataSourceMetadataFromWorkspaceId(workspaceId) {
        return this.dataSourceMetadataRepository.findOne({
            where: {
                workspaceId
            },
            order: {
                createdAt: 'DESC'
            }
        });
    }
    // @deprecated - Use workspace.databaseSchema or
    // getWorkspaceSchemaName(workspaceId) instead.
    async getLastDataSourceMetadataFromWorkspaceIdOrFail(workspaceId) {
        try {
            return this.dataSourceMetadataRepository.findOneOrFail({
                where: {
                    workspaceId
                },
                order: {
                    createdAt: 'DESC'
                }
            });
        } catch (error) {
            throw new _datasourceexception.DataSourceException(`Data source not found for workspace ${workspaceId}: ${error}`, _datasourceexception.DataSourceExceptionCode.DATA_SOURCE_NOT_FOUND);
        }
    }
    async delete(workspaceId) {
        await this.dataSourceMetadataRepository.delete({
            workspaceId
        });
        // Dual-write: clear workspace.databaseSchema on delete
        await this.workspaceRepository.update(workspaceId, {
            databaseSchema: null
        });
    }
    constructor(dataSourceMetadataRepository, workspaceRepository){
        this.dataSourceMetadataRepository = dataSourceMetadataRepository;
        this.workspaceRepository = workspaceRepository;
    }
};
DataSourceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_datasourceentity.DataSourceEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], DataSourceService);

//# sourceMappingURL=data-source.service.js.map