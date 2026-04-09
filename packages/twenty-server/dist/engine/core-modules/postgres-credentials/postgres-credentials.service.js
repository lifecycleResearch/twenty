"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostgresCredentialsService", {
    enumerable: true,
    get: function() {
        return PostgresCredentialsService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _crypto = require("crypto");
const _typeorm1 = require("typeorm");
const _authutil = require("../auth/auth.util");
const _graphqlerrorsutil = require("../graphql/utils/graphql-errors.util");
const _jwtwrapperservice = require("../jwt/services/jwt-wrapper.service");
const _postgrescredentialsentity = require("./postgres-credentials.entity");
const _authcontexttype = require("../auth/types/auth-context.type");
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
let PostgresCredentialsService = class PostgresCredentialsService {
    async enablePostgresProxy(workspaceId) {
        const user = `user_${(0, _crypto.randomBytes)(4).toString('hex')}`;
        const password = (0, _crypto.randomBytes)(16).toString('hex');
        const key = this.jwtWrapperService.generateAppSecret(_authcontexttype.JwtTokenTypeEnum.POSTGRES_PROXY, workspaceId);
        const passwordHash = (0, _authutil.encryptText)(password, key);
        const existingCredentials = await this.postgresCredentialsRepository.findOne({
            where: {
                workspaceId
            }
        });
        if (existingCredentials) {
            throw new _common.BadRequestException('Postgres credentials already exist for this workspace');
        }
        const postgresCredentials = await this.postgresCredentialsRepository.create({
            user,
            passwordHash,
            workspaceId
        });
        await this.postgresCredentialsRepository.save(postgresCredentials);
        return {
            id: postgresCredentials.id,
            user,
            password,
            workspaceId
        };
    }
    async disablePostgresProxy(workspaceId) {
        const postgresCredentials = await this.postgresCredentialsRepository.findOne({
            where: {
                workspaceId
            }
        });
        if (!postgresCredentials?.id) {
            throw new _graphqlerrorsutil.NotFoundError('No valid Postgres credentials not found for this workspace');
        }
        await this.postgresCredentialsRepository.delete({
            id: postgresCredentials.id
        });
        const key = this.jwtWrapperService.generateAppSecret(_authcontexttype.JwtTokenTypeEnum.POSTGRES_PROXY, workspaceId);
        return {
            id: postgresCredentials.id,
            user: postgresCredentials.user,
            password: (0, _authutil.decryptText)(postgresCredentials.passwordHash, key),
            workspaceId: postgresCredentials.workspaceId
        };
    }
    async getPostgresCredentials(workspaceId) {
        const postgresCredentials = await this.postgresCredentialsRepository.findOne({
            where: {
                workspaceId
            }
        });
        if (!postgresCredentials) {
            return null;
        }
        const key = this.jwtWrapperService.generateAppSecret(_authcontexttype.JwtTokenTypeEnum.POSTGRES_PROXY, workspaceId);
        return {
            id: postgresCredentials.id,
            user: postgresCredentials.user,
            password: (0, _authutil.decryptText)(postgresCredentials.passwordHash, key),
            workspaceId: postgresCredentials.workspaceId
        };
    }
    constructor(postgresCredentialsRepository, jwtWrapperService){
        this.postgresCredentialsRepository = postgresCredentialsRepository;
        this.jwtWrapperService = jwtWrapperService;
    }
};
PostgresCredentialsService = _ts_decorate([
    _ts_param(0, (0, _typeorm.InjectRepository)(_postgrescredentialsentity.PostgresCredentialsEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService
    ])
], PostgresCredentialsService);

//# sourceMappingURL=postgres-credentials.service.js.map