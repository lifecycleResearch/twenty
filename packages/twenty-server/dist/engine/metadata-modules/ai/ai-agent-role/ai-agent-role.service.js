"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AiAgentRoleService", {
    enumerable: true,
    get: function() {
        return AiAgentRoleService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _agentexception = require("../ai-agent/agent.exception");
const _agententity = require("../ai-agent/entities/agent.entity");
const _roletargetentity = require("../../role-target/role-target.entity");
const _roletargetservice = require("../../role-target/services/role-target.service");
const _roleentity = require("../../role/role.entity");
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
let AiAgentRoleService = class AiAgentRoleService {
    async assignRoleToAgent({ workspaceId, agentId, roleId }) {
        const validationResult = await this.validateAssignRoleInput({
            agentId,
            workspaceId,
            roleId
        });
        if (validationResult?.roleToAssignIsSameAsCurrentRole) {
            return;
        }
        await this.roleTargetService.create({
            createRoleTargetInput: {
                roleId,
                targetId: agentId,
                targetMetadataForeignKey: 'agentId'
            },
            workspaceId
        });
    }
    async removeRoleFromAgent({ workspaceId, agentId }) {
        const existingRoleTarget = await this.roleTargetRepository.findOne({
            where: {
                agentId,
                workspaceId
            }
        });
        if (!(0, _utils.isDefined)(existingRoleTarget)) {
            throw new _agentexception.AgentException(`Role target not found for agent ${agentId}`, _agentexception.AgentExceptionCode.ROLE_NOT_FOUND);
        }
        await this.roleTargetService.delete({
            id: existingRoleTarget.id,
            workspaceId
        });
    }
    async getAgentsAssignedToRole(roleId, workspaceId) {
        const roleTargets = await this.roleTargetRepository.find({
            where: {
                roleId,
                workspaceId,
                agentId: (0, _typeorm1.Not)((0, _typeorm1.IsNull)())
            }
        });
        const agentIds = roleTargets.map((roleTarget)=>roleTarget.agentId).filter((agentId)=>agentId !== null);
        if (!agentIds.length) {
            return [];
        }
        const agents = await this.agentRepository.find({
            where: {
                id: (0, _typeorm1.In)(agentIds),
                workspaceId
            }
        });
        return agents;
    }
    async validateAssignRoleInput({ agentId, workspaceId, roleId }) {
        const agent = await this.agentRepository.findOne({
            where: {
                id: agentId,
                workspaceId
            }
        });
        if (!agent) {
            throw new _agentexception.AgentException(`Agent with id ${agentId} not found in workspace`, _agentexception.AgentExceptionCode.AGENT_NOT_FOUND);
        }
        const role = await this.roleRepository.findOne({
            where: {
                id: roleId,
                workspaceId
            }
        });
        if (!role) {
            throw new _agentexception.AgentException(`Role with id ${roleId} not found in workspace`, _agentexception.AgentExceptionCode.ROLE_NOT_FOUND);
        }
        if (!role.canBeAssignedToAgents) {
            throw new _agentexception.AgentException(`Role "${role.label}" cannot be assigned to agents`, _agentexception.AgentExceptionCode.ROLE_CANNOT_BE_ASSIGNED_TO_AGENTS);
        }
        const existingRoleTarget = await this.roleTargetRepository.findOne({
            where: {
                agentId,
                roleId,
                workspaceId
            }
        });
        return {
            roleToAssignIsSameAsCurrentRole: Boolean(existingRoleTarget)
        };
    }
    async deleteAgentOnlyRoleIfUnused({ roleId, roleTargetId, workspaceId }) {
        const role = await this.roleRepository.findOne({
            where: {
                id: roleId,
                workspaceId
            }
        });
        if (!(0, _utils.isDefined)(role) || !role.canBeAssignedToAgents || role.canBeAssignedToUsers || role.canBeAssignedToApiKeys) {
            return;
        }
        const remainingAssignments = await this.roleTargetRepository.count({
            where: {
                roleId,
                workspaceId,
                id: (0, _typeorm1.Not)(roleTargetId)
            }
        });
        if (remainingAssignments === 0) {
            await this.roleRepository.delete({
                id: roleId,
                workspaceId
            });
        }
    }
    constructor(agentRepository, roleRepository, roleTargetRepository, roleTargetService){
        this.agentRepository = agentRepository;
        this.roleRepository = roleRepository;
        this.roleTargetRepository = roleTargetRepository;
        this.roleTargetService = roleTargetService;
    }
};
AiAgentRoleService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_agententity.AgentEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_roleentity.RoleEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_roletargetentity.RoleTargetEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _roletargetservice.RoleTargetService === "undefined" ? Object : _roletargetservice.RoleTargetService
    ])
], AiAgentRoleService);

//# sourceMappingURL=ai-agent-role.service.js.map