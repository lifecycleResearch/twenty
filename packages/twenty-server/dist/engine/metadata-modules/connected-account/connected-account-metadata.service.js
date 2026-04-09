"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountMetadataService", {
    enumerable: true,
    get: function() {
        return ConnectedAccountMetadataService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _connectedaccountexception = require("./connected-account.exception");
const _connectedaccountentity = require("./entities/connected-account.entity");
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
let ConnectedAccountMetadataService = class ConnectedAccountMetadataService {
    async findAll(workspaceId) {
        return this.repository.find({
            where: {
                workspaceId
            }
        });
    }
    async findByUserWorkspaceId({ userWorkspaceId, workspaceId }) {
        return this.repository.find({
            where: {
                userWorkspaceId,
                workspaceId
            }
        });
    }
    async findById({ id, workspaceId }) {
        return this.repository.findOne({
            where: {
                id,
                workspaceId
            }
        });
    }
    async findByIds({ ids, workspaceId }) {
        return this.repository.find({
            where: {
                id: (0, _typeorm1.In)(ids),
                workspaceId
            }
        });
    }
    async verifyOwnership({ id, userWorkspaceId, workspaceId }) {
        const connectedAccount = await this.repository.findOne({
            where: {
                id,
                workspaceId
            }
        });
        if (!connectedAccount) {
            throw new _connectedaccountexception.ConnectedAccountException(`Connected account ${id} not found`, _connectedaccountexception.ConnectedAccountExceptionCode.CONNECTED_ACCOUNT_NOT_FOUND);
        }
        if (connectedAccount.userWorkspaceId !== userWorkspaceId) {
            throw new _connectedaccountexception.ConnectedAccountException(`Connected account ${id} does not belong to user workspace ${userWorkspaceId}`, _connectedaccountexception.ConnectedAccountExceptionCode.CONNECTED_ACCOUNT_OWNERSHIP_VIOLATION);
        }
        return connectedAccount;
    }
    async getUserConnectedAccountIds({ userWorkspaceId, workspaceId }) {
        const accounts = await this.repository.find({
            where: {
                userWorkspaceId,
                workspaceId
            },
            select: [
                'id'
            ]
        });
        return accounts.map((account)=>account.id);
    }
    async create(data) {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }
    async update({ id, workspaceId, data }) {
        await this.repository.update({
            id,
            workspaceId
        }, data);
        return this.repository.findOneOrFail({
            where: {
                id,
                workspaceId
            }
        });
    }
    async delete({ id, workspaceId }) {
        const connectedAccount = await this.repository.findOneOrFail({
            where: {
                id,
                workspaceId
            }
        });
        await this.repository.delete({
            id,
            workspaceId
        });
        return connectedAccount;
    }
    constructor(repository){
        this.repository = repository;
    }
};
ConnectedAccountMetadataService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ConnectedAccountMetadataService);

//# sourceMappingURL=connected-account-metadata.service.js.map