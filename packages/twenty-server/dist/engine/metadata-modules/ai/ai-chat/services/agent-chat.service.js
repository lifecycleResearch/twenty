"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentChatService", {
    enumerable: true,
    get: function() {
        return AgentChatService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _agentmessagepartentity = require("../../ai-agent-execution/entities/agent-message-part.entity");
const _agentmessageentity = require("../../ai-agent-execution/entities/agent-message.entity");
const _agentturnentity = require("../../ai-agent-execution/entities/agent-turn.entity");
const _mapUIMessagePartsToDBParts = require("../../ai-agent-execution/utils/mapUIMessagePartsToDBParts");
const _agentexception = require("../../ai-agent/agent.exception");
const _agentchatthreadentity = require("../entities/agent-chat-thread.entity");
const _agenttitlegenerationservice = require("./agent-title-generation.service");
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
let AgentChatService = class AgentChatService {
    async createThread(userWorkspaceId) {
        const thread = this.threadRepository.create({
            userWorkspaceId
        });
        return this.threadRepository.save(thread);
    }
    async getThreadById(threadId, userWorkspaceId) {
        const thread = await this.threadRepository.findOne({
            where: {
                id: threadId,
                userWorkspaceId
            }
        });
        if (!thread) {
            throw new _agentexception.AgentException('Thread not found', _agentexception.AgentExceptionCode.AGENT_EXECUTION_FAILED);
        }
        return thread;
    }
    async addMessage({ threadId, uiMessage, agentId, turnId }) {
        let actualTurnId = turnId;
        if (!actualTurnId) {
            const turn = this.turnRepository.create({
                threadId,
                agentId: agentId ?? null
            });
            const savedTurn = await this.turnRepository.save(turn);
            actualTurnId = savedTurn.id;
        }
        const message = this.messageRepository.create({
            threadId,
            turnId: actualTurnId,
            role: uiMessage.role,
            agentId: agentId ?? null
        });
        const savedMessage = await this.messageRepository.save(message);
        if (uiMessage.parts && uiMessage.parts.length > 0) {
            const dbParts = (0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)(uiMessage.parts, savedMessage.id);
            await this.messagePartRepository.save(dbParts);
        }
        return savedMessage;
    }
    async getMessagesForThread(threadId, userWorkspaceId) {
        const thread = await this.threadRepository.findOne({
            where: {
                id: threadId,
                userWorkspaceId
            }
        });
        if (!thread) {
            throw new _agentexception.AgentException('Thread not found', _agentexception.AgentExceptionCode.AGENT_EXECUTION_FAILED);
        }
        return this.messageRepository.find({
            where: {
                threadId
            },
            order: {
                createdAt: 'ASC'
            },
            relations: [
                'parts',
                'parts.file'
            ]
        });
    }
    async generateTitleIfNeeded(threadId, messageContent) {
        const thread = await this.threadRepository.findOne({
            where: {
                id: threadId
            },
            select: [
                'id',
                'title'
            ]
        });
        if (!thread || thread.title || !messageContent) {
            return null;
        }
        const title = await this.titleGenerationService.generateThreadTitle(messageContent);
        await this.threadRepository.update(threadId, {
            title
        });
        return title;
    }
    constructor(threadRepository, turnRepository, messageRepository, messagePartRepository, titleGenerationService){
        this.threadRepository = threadRepository;
        this.turnRepository = turnRepository;
        this.messageRepository = messageRepository;
        this.messagePartRepository = messagePartRepository;
        this.titleGenerationService = titleGenerationService;
    }
};
AgentChatService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_agentchatthreadentity.AgentChatThreadEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_agentturnentity.AgentTurnEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_agentmessageentity.AgentMessageEntity)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_agentmessagepartentity.AgentMessagePartEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _agenttitlegenerationservice.AgentTitleGenerationService === "undefined" ? Object : _agenttitlegenerationservice.AgentTitleGenerationService
    ])
], AgentChatService);

//# sourceMappingURL=agent-chat.service.js.map