"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountDataAccessService", {
    enumerable: true,
    get: function() {
        return ConnectedAccountDataAccessService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _featureflagservice = require("../../../../core-modules/feature-flag/services/feature-flag.service");
const _userworkspaceentity = require("../../../../core-modules/user-workspace/user-workspace.entity");
const _connectedaccountentity = require("../../entities/connected-account.entity");
const _globalworkspaceormmanager = require("../../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
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
let ConnectedAccountDataAccessService = class ConnectedAccountDataAccessService {
    async isMigrated(workspaceId) {
        return this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_CONNECTED_ACCOUNT_MIGRATED, workspaceId);
    }
    async resolveUserWorkspaceId(workspaceId, workspaceMemberId) {
        const workspaceMemberRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'workspaceMember');
        const workspaceMember = await workspaceMemberRepository.findOne({
            where: {
                id: workspaceMemberId
            }
        });
        if (!workspaceMember) {
            return null;
        }
        const userWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                userId: workspaceMember.userId,
                workspaceId
            }
        });
        return userWorkspace?.id ?? null;
    }
    async toCore(workspaceId, data) {
        const { handleAliases, lastSyncHistoryId: _lastSyncHistoryId, accountOwnerId, ...rest } = data;
        const coreData = {
            ...rest
        };
        if (handleAliases !== undefined) {
            if (Array.isArray(handleAliases)) {
                coreData.handleAliases = handleAliases;
            } else if ((0, _guards.isNonEmptyString)(handleAliases)) {
                coreData.handleAliases = handleAliases.split(',').map((alias)=>alias.trim());
            } else {
                coreData.handleAliases = null;
            }
        }
        if (accountOwnerId !== undefined) {
            const userWorkspaceId = await this.resolveUserWorkspaceId(workspaceId, accountOwnerId);
            if (!userWorkspaceId) {
                this.logger.warn(`Could not resolve userWorkspaceId for workspaceMember ${accountOwnerId}`);
            }
            coreData.userWorkspaceId = userWorkspaceId;
        }
        return coreData;
    }
    async toCoreWhere(workspaceId, where) {
        const { accountOwnerId, ...rest } = where;
        const coreWhere = {
            ...rest,
            workspaceId
        };
        if (accountOwnerId !== undefined) {
            const userWorkspaceId = await this.resolveUserWorkspaceId(workspaceId, accountOwnerId);
            if (userWorkspaceId) {
                coreWhere.userWorkspaceId = userWorkspaceId;
            } else {
                this.logger.warn(`toCoreWhere: could not resolve userWorkspaceId for workspaceMember ${accountOwnerId}, returning empty result`);
                coreWhere.id = '00000000-0000-0000-0000-000000000000';
            }
        }
        return coreWhere;
    }
    async fromCoreEntities(workspaceId, entities) {
        if (entities.length === 0) {
            return [];
        }
        const userWorkspaceIds = entities.map((entity)=>entity.userWorkspaceId).filter(_utils.isDefined);
        const userWorkspaces = userWorkspaceIds.length > 0 ? await this.userWorkspaceRepository.find({
            where: {
                id: (0, _typeorm1.In)(userWorkspaceIds)
            },
            select: [
                'id',
                'userId'
            ]
        }) : [];
        const userIdByUserWorkspaceId = new Map(userWorkspaces.map((userWorkspace)=>[
                userWorkspace.id,
                userWorkspace.userId
            ]));
        const uniqueUserIds = [
            ...new Set(userWorkspaces.map((userWorkspace)=>userWorkspace.userId))
        ];
        const workspaceMemberRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'workspaceMember');
        const workspaceMembers = uniqueUserIds.length > 0 ? await workspaceMemberRepository.find({
            where: {
                userId: (0, _typeorm1.In)(uniqueUserIds)
            }
        }) : [];
        const workspaceMemberIdByUserId = new Map(workspaceMembers.map((workspaceMember)=>[
                workspaceMember.userId,
                workspaceMember.id
            ]));
        return entities.map((entity)=>{
            const userId = entity.userWorkspaceId ? userIdByUserWorkspaceId.get(entity.userWorkspaceId) : undefined;
            const accountOwnerId = userId ? workspaceMemberIdByUserId.get(userId) : undefined;
            const handleAliases = Array.isArray(entity.handleAliases) ? entity.handleAliases.join(',') : entity.handleAliases ?? '';
            return {
                ...entity,
                handleAliases,
                accountOwnerId: accountOwnerId ?? null
            };
        });
    }
    async getWorkspaceRepository(workspaceId) {
        return this.globalWorkspaceOrmManager.getRepository(workspaceId, 'connectedAccount');
    }
    async findOne(workspaceId, options) {
        if (await this.isMigrated(workspaceId)) {
            const where = options.where;
            const coreWhere = Array.isArray(where) ? await Promise.all(where.map((whereItem)=>this.toCoreWhere(workspaceId, whereItem))) : await this.toCoreWhere(workspaceId, where);
            const coreResult = await this.coreRepository.findOne({
                ...options,
                where: coreWhere
            });
            if (!coreResult) {
                return null;
            }
            const [transformed] = await this.fromCoreEntities(workspaceId, [
                coreResult
            ]);
            return transformed ?? null;
        }
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        return workspaceRepository.findOne(options);
    }
    async find(workspaceId, where) {
        if (await this.isMigrated(workspaceId)) {
            const coreWhere = where ? await this.toCoreWhere(workspaceId, where) : {
                workspaceId
            };
            const coreResults = await this.coreRepository.find({
                where: coreWhere
            });
            return this.fromCoreEntities(workspaceId, coreResults);
        }
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        return workspaceRepository.find({
            where
        });
    }
    async save(workspaceId, data, manager) {
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        await workspaceRepository.save(data, {}, manager);
        if (await this.isMigrated(workspaceId)) {
            try {
                const coreData = await this.toCore(workspaceId, data);
                await this.coreRepository.save({
                    ...coreData,
                    workspaceId
                });
            } catch (error) {
                this.logger.error(`Failed to dual-write connectedAccount to core: ${error}`);
                throw error;
            }
        }
    }
    async update(workspaceId, where, data) {
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        await workspaceRepository.update(where, data);
        if (await this.isMigrated(workspaceId)) {
            try {
                const coreData = await this.toCore(workspaceId, data);
                const coreWhere = await this.toCoreWhere(workspaceId, where);
                await this.coreRepository.update(coreWhere, coreData);
            } catch (error) {
                this.logger.error(`Failed to dual-write connectedAccount update to core: ${error}`);
                throw error;
            }
        }
    }
    async delete(workspaceId, where) {
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        await workspaceRepository.delete(where);
        if (await this.isMigrated(workspaceId)) {
            try {
                const coreWhere = await this.toCoreWhere(workspaceId, where);
                await this.coreRepository.delete(coreWhere);
            } catch (error) {
                this.logger.error(`Failed to dual-write connectedAccount delete to core: ${error}`);
                throw error;
            }
        }
    }
    constructor(coreRepository, userWorkspaceRepository, featureFlagService, globalWorkspaceOrmManager){
        this.coreRepository = coreRepository;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.featureFlagService = featureFlagService;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.logger = new _common.Logger(ConnectedAccountDataAccessService.name);
    }
};
ConnectedAccountDataAccessService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager
    ])
], ConnectedAccountDataAccessService);

//# sourceMappingURL=connected-account-data-access.service.js.map