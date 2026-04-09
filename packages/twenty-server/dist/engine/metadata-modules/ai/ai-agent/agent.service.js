"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentService", {
    enumerable: true,
    get: function() {
        return AgentService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _applicationservice = require("../../../core-modules/application/application.service");
const _fromcreateagentinputtoflatagentutil = require("./utils/from-create-agent-input-to-flat-agent.util");
const _fromupdateagentinputtoflatagenttoupdateutil = require("./utils/from-update-agent-input-to-flat-agent-to-update.util");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _findflatentitybyidinflatentitymapsutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
const _agentexception = require("./agent.exception");
const _agententity = require("./entities/agent.entity");
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
let AgentService = class AgentService {
    async findManyAgents(workspaceId) {
        const { flatAgentMaps, flatRoleTargetByAgentIdMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatAgentMaps',
            'flatRoleTargetByAgentIdMaps'
        ]);
        return Object.values(flatAgentMaps.byUniversalIdentifier).filter(_utils.isDefined).map((flatAgent)=>{
            const roleId = flatRoleTargetByAgentIdMaps[flatAgent.id]?.roleId;
            return {
                ...flatAgent,
                roleId: roleId ?? null
            };
        });
    }
    async findOneAgentByName({ name, workspaceId }) {
        const agent = await this.agentRepository.findOne({
            where: {
                name,
                workspaceId
            }
        });
        if (!agent) {
            const identifier = `name "${name}"`;
            throw new _agentexception.AgentException(`Agent with ${identifier} not found`, _agentexception.AgentExceptionCode.AGENT_NOT_FOUND);
        }
        return agent;
    }
    async findOneAgentById({ id, workspaceId }) {
        const { flatAgentMaps, flatRoleTargetByAgentIdMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatAgentMaps',
            'flatRoleTargetByAgentIdMaps'
        ]);
        const flatAgent = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: id,
            flatEntityMaps: flatAgentMaps
        });
        if (!(0, _utils.isDefined)(flatAgent)) {
            throw new _agentexception.AgentException(`Agent not found`, _agentexception.AgentExceptionCode.AGENT_NOT_FOUND);
        }
        const roleId = flatRoleTargetByAgentIdMaps[flatAgent.id]?.roleId;
        return {
            ...flatAgent,
            roleId: roleId ?? null
        };
    }
    async createOneAgent(input, workspaceId) {
        const { flatApplicationMaps, flatRoleMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatApplicationMaps',
            'flatRoleMaps'
        ]);
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const flatApplication = (0, _utils.isDefined)(input.applicationId) ? flatApplicationMaps.byId[input.applicationId] : undefined;
        const resolvedFlatApplication = flatApplication ?? workspaceCustomFlatApplication;
        const { flatAgentToCreate, flatRoleTargetToCreate } = (0, _fromcreateagentinputtoflatagentutil.fromCreateAgentInputToFlatAgent)({
            createAgentInput: input,
            workspaceId,
            flatApplication: resolvedFlatApplication,
            flatRoleMaps
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                agent: {
                    flatEntityToCreate: [
                        flatAgentToCreate
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                },
                roleTarget: {
                    flatEntityToCreate: (0, _utils.isDefined)(flatRoleTargetToCreate) ? [
                        flatRoleTargetToCreate
                    ] : [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while creating agent');
        }
        const { flatAgentMaps: recomputedFlatAgentMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatAgentMaps'
        ]);
        const createdAgent = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: flatAgentToCreate.id,
            flatEntityMaps: recomputedFlatAgentMaps
        });
        return {
            ...createdAgent,
            roleId: flatRoleTargetToCreate?.roleId ?? null
        };
    }
    async updateOneAgent({ input, workspaceId }) {
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatRoleTargetByAgentIdMaps, flatAgentMaps, flatRoleMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatRoleTargetByAgentIdMaps',
            'flatAgentMaps',
            'flatRoleMaps'
        ]);
        const { flatAgentToUpdate, flatRoleTargetToCreate, flatRoleTargetToDelete, flatRoleTargetToUpdate } = (0, _fromupdateagentinputtoflatagenttoupdateutil.fromUpdateAgentInputToFlatAgentToUpdate)({
            updateAgentInput: input,
            flatAgentMaps,
            flatRoleTargetByAgentIdMaps,
            flatRoleMaps
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                agent: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        flatAgentToUpdate
                    ]
                },
                roleTarget: {
                    flatEntityToCreate: (0, _utils.isDefined)(flatRoleTargetToCreate) ? [
                        flatRoleTargetToCreate
                    ] : [],
                    flatEntityToDelete: (0, _utils.isDefined)(flatRoleTargetToDelete) ? [
                        flatRoleTargetToDelete
                    ] : [],
                    flatEntityToUpdate: (0, _utils.isDefined)(flatRoleTargetToUpdate) ? [
                        flatRoleTargetToUpdate
                    ] : []
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while updating agent');
        }
        const { flatAgentMaps: recomputedFlatAgentMaps, flatRoleTargetByAgentIdMaps: recomputedFlatRoleTargetByAgentIdMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatAgentMaps',
            'flatRoleTargetByAgentIdMaps'
        ]);
        const updatedAgent = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: input.id,
            flatEntityMaps: recomputedFlatAgentMaps
        });
        const existingRoleTarget = recomputedFlatRoleTargetByAgentIdMaps[flatAgentToUpdate.id];
        return {
            ...updatedAgent,
            roleId: existingRoleTarget?.roleId ?? null
        };
    }
    async deleteOneAgent(id, workspaceId) {
        const deletedAgents = await this.deleteManyAgents({
            ids: [
                id
            ],
            workspaceId
        });
        if (deletedAgents.length !== 1) {
            throw new _agentexception.AgentException('Could not retrieve deleted agent', _agentexception.AgentExceptionCode.AGENT_NOT_FOUND);
        }
        const [deletedAgent] = deletedAgents;
        return deletedAgent;
    }
    async deleteManyAgents({ ids, workspaceId, isSystemBuild = false }) {
        if (ids.length === 0) {
            return [];
        }
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatAgentMaps, flatRoleTargetByAgentIdMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatAgentMaps',
            'flatRoleTargetByAgentIdMaps'
        ]);
        const agentsToDelete = ids.map((id)=>(0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: id,
                flatEntityMaps: flatAgentMaps
            })).filter(_utils.isDefined);
        if (agentsToDelete.length === 0) {
            return [];
        }
        const roleTargetsToDelete = agentsToDelete.map((agent)=>flatRoleTargetByAgentIdMaps[agent.id]).filter(_utils.isDefined);
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                agent: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: agentsToDelete,
                    flatEntityToUpdate: []
                },
                roleTarget: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: roleTargetsToDelete,
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            isSystemBuild,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, `Multiple validation errors occurred while deleting agent${ids.length > 1 ? 's' : ''}`);
        }
        return agentsToDelete.map((agent)=>({
                ...agent,
                roleId: flatRoleTargetByAgentIdMaps[agent.id]?.roleId ?? null
            }));
    }
    async searchAgents(query, workspaceId, options = {
        limit: 2
    }) {
        const queryLower = query.toLowerCase();
        return this.agentRepository.find({
            where: [
                {
                    workspaceId,
                    deletedAt: (0, _typeorm1.IsNull)(),
                    name: (0, _typeorm1.ILike)(`%${queryLower}%`)
                },
                {
                    workspaceId,
                    deletedAt: (0, _typeorm1.IsNull)(),
                    description: (0, _typeorm1.ILike)(`%${queryLower}%`)
                },
                {
                    workspaceId,
                    deletedAt: (0, _typeorm1.IsNull)(),
                    label: (0, _typeorm1.ILike)(`%${queryLower}%`)
                }
            ],
            take: options.limit,
            order: {
                name: 'ASC'
            }
        });
    }
    constructor(agentRepository, workspaceMigrationValidateBuildAndRunService, applicationService, workspaceCacheService){
        this.agentRepository = agentRepository;
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.applicationService = applicationService;
        this.workspaceCacheService = workspaceCacheService;
    }
};
AgentService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_agententity.AgentEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService
    ])
], AgentService);

//# sourceMappingURL=agent.service.js.map