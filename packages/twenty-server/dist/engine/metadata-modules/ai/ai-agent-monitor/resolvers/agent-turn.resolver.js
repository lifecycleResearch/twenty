"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentTurnResolver", {
    enumerable: true,
    get: function() {
        return AgentTurnResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _typeorm = require("@nestjs/typeorm");
const _constants = require("twenty-shared/constants");
const _typeorm1 = require("typeorm");
const _metadataresolverdecorator = require("../../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _scalars = require("../../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _graphqlerrorsutil = require("../../../../core-modules/graphql/utils/graphql-errors.util");
const _messagequeuedecorator = require("../../../../core-modules/message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../../../core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../core-modules/message-queue/services/message-queue.service");
const _authuserworkspaceiddecorator = require("../../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../../decorators/auth/auth-workspace.decorator");
const _settingspermissionguard = require("../../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../../guards/workspace-auth.guard");
const _agentturndto = require("../../ai-agent-execution/dtos/agent-turn.dto");
const _agentturnentity = require("../../ai-agent-execution/entities/agent-turn.entity");
const _agentturnevaluationdto = require("../dtos/agent-turn-evaluation.dto");
const _runevaluationinputjob = require("../jobs/run-evaluation-input.job");
const _agentturngraderservice = require("../services/agent-turn-grader.service");
const _agentchatthreadentity = require("../../ai-chat/entities/agent-chat-thread.entity");
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
let AgentTurnResolver = class AgentTurnResolver {
    async agentTurns(agentId) {
        return this.turnRepository.find({
            where: {
                agentId
            },
            relations: [
                'evaluations',
                'messages',
                'messages.parts'
            ],
            order: {
                createdAt: 'DESC'
            }
        });
    }
    async evaluateAgentTurn(turnId) {
        const evaluation = await this.graderService.evaluateTurn(turnId);
        return evaluation;
    }
    async runEvaluationInput(agentId, input, workspace, userWorkspaceId) {
        const thread = this.threadRepository.create({
            userWorkspaceId,
            title: `Eval: ${input.substring(0, 50)}...`
        });
        const savedThread = await this.threadRepository.save(thread);
        const turn = this.turnRepository.create({
            threadId: savedThread.id,
            agentId
        });
        const savedTurn = await this.turnRepository.save(turn);
        this.messageQueueService.add(_runevaluationinputjob.RunEvaluationInputJob.name, {
            turnId: savedTurn.id,
            threadId: savedThread.id,
            agentId,
            input,
            workspaceId: workspace.id
        });
        const turnWithRelations = await this.turnRepository.findOne({
            where: {
                id: savedTurn.id
            },
            relations: [
                'evaluations',
                'messages',
                'messages.parts'
            ]
        });
        if (!turnWithRelations) {
            throw new _graphqlerrorsutil.NotFoundError('Turn not found after creation', {
                userFriendlyMessage: /*i18n*/ {
                    id: "E7Dsiq",
                    message: "Failed to create evaluation. Please try again."
                }
            });
        }
        return turnWithRelations;
    }
    constructor(turnRepository, threadRepository, messageQueueService, graderService){
        this.turnRepository = turnRepository;
        this.threadRepository = threadRepository;
        this.messageQueueService = messageQueueService;
        this.graderService = graderService;
        this.logger = new _common.Logger(AgentTurnResolver.name);
    }
};
_ts_decorate([
    (0, _graphql.Query)(()=>[
            _agentturndto.AgentTurnDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('agentId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AgentTurnResolver.prototype, "agentTurns", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_agentturnevaluationdto.AgentTurnEvaluationDTO),
    _ts_param(0, (0, _graphql.Args)('turnId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AgentTurnResolver.prototype, "evaluateAgentTurn", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_agentturndto.AgentTurnDTO),
    _ts_param(0, (0, _graphql.Args)('agentId', {
        type: ()=>_scalars.UUIDScalarType
    })),
    _ts_param(1, (0, _graphql.Args)('input')),
    _ts_param(2, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(3, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AgentTurnResolver.prototype, "runEvaluationInput", null);
AgentTurnResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.AI)),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_agentturnentity.AgentTurnEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_agentchatthreadentity.AgentChatThreadEntity)),
    _ts_param(2, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.aiQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _agentturngraderservice.AgentTurnGraderService === "undefined" ? Object : _agentturngraderservice.AgentTurnGraderService
    ])
], AgentTurnResolver);

//# sourceMappingURL=agent-turn.resolver.js.map