"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageChannelDataAccessService", {
    enumerable: true,
    get: function() {
        return MessageChannelDataAccessService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _typeorm1 = require("typeorm");
const _featureflagservice = require("../../../../core-modules/feature-flag/services/feature-flag.service");
const _connectedaccountdataaccessservice = require("../../../connected-account/data-access/services/connected-account-data-access.service");
const _messagechannelentity = require("../../entities/message-channel.entity");
const _messagefolderdataaccessservice = require("../../../message-folder/data-access/services/message-folder-data-access.service");
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
let MessageChannelDataAccessService = class MessageChannelDataAccessService {
    async isMigrated(workspaceId) {
        return this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_CONNECTED_ACCOUNT_MIGRATED, workspaceId);
    }
    async toCoreWhere(workspaceId, where) {
        const coreWhere = {
            ...where,
            workspaceId
        };
        if (coreWhere.connectedAccount && typeof coreWhere.connectedAccount === 'object') {
            const connectedAccountWhere = {
                ...coreWhere.connectedAccount
            };
            if ('accountOwnerId' in connectedAccountWhere) {
                const { accountOwnerId, ...restConnectedAccount } = connectedAccountWhere;
                const resolvedConnectedAccounts = await this.connectedAccountDataAccessService.find(workspaceId, {
                    accountOwnerId
                });
                if (resolvedConnectedAccounts.length > 0) {
                    coreWhere.connectedAccountId = resolvedConnectedAccounts[0].id;
                } else {
                    coreWhere.connectedAccountId = '00000000-0000-0000-0000-000000000000';
                }
                if (Object.keys(restConnectedAccount).length > 0) {
                    coreWhere.connectedAccount = restConnectedAccount;
                } else {
                    delete coreWhere.connectedAccount;
                }
            }
        }
        return coreWhere;
    }
    async getWorkspaceRepository(workspaceId) {
        return this.globalWorkspaceOrmManager.getRepository(workspaceId, 'messageChannel');
    }
    async findOne(workspaceId, options) {
        if (await this.isMigrated(workspaceId)) {
            const where = options.where;
            const coreWhere = Array.isArray(where) ? await Promise.all(where.map((whereItem)=>this.toCoreWhere(workspaceId, whereItem))) : await this.toCoreWhere(workspaceId, where);
            const requestedRelations = options.relations?.slice() ?? [];
            const needsConnectedAccount = requestedRelations.includes('connectedAccount');
            const needsMessageFolders = requestedRelations.includes('messageFolders');
            const coreRelations = requestedRelations.filter((r)=>r !== 'connectedAccount' && r !== 'messageFolders');
            const result = await this.coreRepository.findOne({
                ...options,
                where: coreWhere,
                relations: coreRelations
            });
            if (!result) {
                return null;
            }
            const workspaceResult = result;
            if (needsConnectedAccount) {
                const connectedAccount = await this.connectedAccountDataAccessService.findOne(workspaceId, {
                    where: {
                        id: result.connectedAccountId
                    }
                });
                if (connectedAccount) {
                    workspaceResult.connectedAccount = connectedAccount;
                }
            }
            if (needsMessageFolders) {
                const messageFolders = await this.messageFolderDataAccessService.find(workspaceId, {
                    messageChannelId: result.id
                });
                workspaceResult.messageFolders = messageFolders;
            }
            return workspaceResult;
        }
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        return workspaceRepository.findOne(options);
    }
    async find(workspaceId, where) {
        if (await this.isMigrated(workspaceId)) {
            return this.coreRepository.find({
                where: {
                    ...where,
                    workspaceId
                }
            });
        }
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        return workspaceRepository.find({
            where
        });
    }
    async findMany(workspaceId, options) {
        if (await this.isMigrated(workspaceId)) {
            const baseWhere = options.where;
            if (!baseWhere) {
                return this.coreRepository.find({
                    ...options,
                    where: {
                        workspaceId
                    }
                });
            }
            if (Array.isArray(baseWhere)) {
                const coreWhereArray = await Promise.all(baseWhere.map((whereItem)=>this.toCoreWhere(workspaceId, whereItem)));
                return this.coreRepository.find({
                    ...options,
                    where: coreWhereArray
                });
            }
            const coreWhere = await this.toCoreWhere(workspaceId, baseWhere);
            return this.coreRepository.find({
                ...options,
                where: coreWhere
            });
        }
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        return workspaceRepository.find(options);
    }
    async save(workspaceId, data, manager) {
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        await workspaceRepository.save(data, {}, manager);
        if (await this.isMigrated(workspaceId)) {
            try {
                await this.coreRepository.save({
                    ...data,
                    workspaceId
                });
            } catch (error) {
                this.logger.error(`Failed to dual-write messageChannel to core: ${error}`);
                throw error;
            }
        }
    }
    async update(workspaceId, where, data, manager) {
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        await workspaceRepository.update(where, data, manager);
        if (await this.isMigrated(workspaceId)) {
            try {
                await this.coreRepository.update({
                    ...where,
                    workspaceId
                }, data);
            } catch (error) {
                this.logger.error(`Failed to dual-write messageChannel update to core: ${error}`);
                throw error;
            }
        }
    }
    async increment(workspaceId, where, propertyPath, value) {
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        await workspaceRepository.increment(where, propertyPath, value, undefined, [
            propertyPath,
            'id'
        ]);
        if (await this.isMigrated(workspaceId)) {
            try {
                await this.coreRepository.increment({
                    ...where,
                    workspaceId
                }, propertyPath, value);
            } catch (error) {
                this.logger.error(`Failed to dual-write messageChannel increment to core: ${error}`);
                throw error;
            }
        }
    }
    async delete(workspaceId, where) {
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        await workspaceRepository.delete(where);
        if (await this.isMigrated(workspaceId)) {
            try {
                await this.coreRepository.delete({
                    ...where,
                    workspaceId
                });
            } catch (error) {
                this.logger.error(`Failed to dual-write messageChannel delete to core: ${error}`);
                throw error;
            }
        }
    }
    constructor(coreRepository, featureFlagService, globalWorkspaceOrmManager, connectedAccountDataAccessService, messageFolderDataAccessService){
        this.coreRepository = coreRepository;
        this.featureFlagService = featureFlagService;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
        this.messageFolderDataAccessService = messageFolderDataAccessService;
        this.logger = new _common.Logger(MessageChannelDataAccessService.name);
    }
};
MessageChannelDataAccessService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_messagechannelentity.MessageChannelEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService,
        typeof _messagefolderdataaccessservice.MessageFolderDataAccessService === "undefined" ? Object : _messagefolderdataaccessservice.MessageFolderDataAccessService
    ])
], MessageChannelDataAccessService);

//# sourceMappingURL=message-channel-data-access.service.js.map