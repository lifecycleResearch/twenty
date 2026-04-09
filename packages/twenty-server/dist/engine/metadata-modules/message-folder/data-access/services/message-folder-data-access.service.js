"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageFolderDataAccessService", {
    enumerable: true,
    get: function() {
        return MessageFolderDataAccessService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _uuid = require("uuid");
const _typeorm1 = require("typeorm");
const _featureflagservice = require("../../../../core-modules/feature-flag/services/feature-flag.service");
const _messagefolderentity = require("../../entities/message-folder.entity");
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
let MessageFolderDataAccessService = class MessageFolderDataAccessService {
    async isMigrated(workspaceId) {
        return this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_CONNECTED_ACCOUNT_MIGRATED, workspaceId);
    }
    // Workspace stores parentFolderId as an externalId (text),
    // core stores it as a uuid FK. Resolve during dual-write.
    async toCore(workspaceId, data, messageChannelId) {
        const coreData = {
            ...data,
            workspaceId
        };
        const parentFolderId = coreData.parentFolderId;
        const channelId = coreData.messageChannelId ?? messageChannelId;
        if (parentFolderId && !(0, _uuid.validate)(parentFolderId) && channelId) {
            const parentFolder = await this.coreRepository.findOne({
                where: {
                    workspaceId,
                    messageChannelId: channelId,
                    externalId: parentFolderId
                },
                select: [
                    'id'
                ]
            });
            coreData.parentFolderId = parentFolder?.id ?? null;
        }
        return coreData;
    }
    async getWorkspaceRepository(workspaceId) {
        return this.globalWorkspaceOrmManager.getRepository(workspaceId, 'messageFolder');
    }
    async findOne(workspaceId, options) {
        if (await this.isMigrated(workspaceId)) {
            const where = options.where;
            const coreWhere = Array.isArray(where) ? where.map((whereItem)=>({
                    ...whereItem,
                    workspaceId
                })) : {
                ...where,
                workspaceId
            };
            return this.coreRepository.findOne({
                ...options,
                where: coreWhere
            });
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
    async save(workspaceId, data) {
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        const savedData = await workspaceRepository.save(data);
        if (await this.isMigrated(workspaceId)) {
            try {
                const coreData = await this.toCore(workspaceId, savedData);
                await this.coreRepository.save(coreData);
            } catch (error) {
                this.logger.error(`Failed to dual-write messageFolder to core: ${error}`);
                throw error;
            }
        }
    }
    async update(workspaceId, where, data, manager) {
        const workspaceRepository = await this.getWorkspaceRepository(workspaceId);
        await workspaceRepository.update(where, data, manager);
        if (await this.isMigrated(workspaceId)) {
            try {
                const coreData = await this.toCore(workspaceId, data, where.messageChannelId);
                await this.coreRepository.update({
                    ...where,
                    workspaceId
                }, coreData);
            } catch (error) {
                this.logger.error(`Failed to dual-write messageFolder update to core: ${error}`);
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
                this.logger.error(`Failed to dual-write messageFolder delete to core: ${error}`);
                throw error;
            }
        }
    }
    constructor(coreRepository, featureFlagService, globalWorkspaceOrmManager){
        this.coreRepository = coreRepository;
        this.featureFlagService = featureFlagService;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.logger = new _common.Logger(MessageFolderDataAccessService.name);
    }
};
MessageFolderDataAccessService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_messagefolderentity.MessageFolderEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager
    ])
], MessageFolderDataAccessService);

//# sourceMappingURL=message-folder-data-access.service.js.map