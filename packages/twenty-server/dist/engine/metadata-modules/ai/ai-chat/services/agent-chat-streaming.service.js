"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentChatStreamingService", {
    enumerable: true,
    get: function() {
        return AgentChatStreamingService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _ai = require("ai");
const _agentmessageentity = require("../../ai-agent-execution/entities/agent-message.entity");
const _agentexception = require("../../ai-agent/agent.exception");
const _computecostbreakdownutil = require("../../ai-billing/utils/compute-cost-breakdown.util");
const _convertdollarstobillingcreditsutil = require("../../ai-billing/utils/convert-dollars-to-billing-credits.util");
const _extractcachecreationtokensutil = require("../../ai-billing/utils/extract-cache-creation-tokens.util");
const _todisplaycreditsutil = require("../../../../core-modules/usage/utils/to-display-credits.util");
const _agentchatthreadentity = require("../entities/agent-chat-thread.entity");
const _agentchatservice = require("./agent-chat.service");
const _chatexecutionservice = require("./chat-execution.service");
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
let AgentChatStreamingService = class AgentChatStreamingService {
    async streamAgentChat({ threadId, userWorkspaceId, workspace, messages, browsingContext, response, modelId }) {
        const thread = await this.threadRepository.findOne({
            where: {
                id: threadId,
                userWorkspaceId
            }
        });
        if (!thread) {
            throw new _agentexception.AgentException('Thread not found', _agentexception.AgentExceptionCode.AGENT_EXECUTION_FAILED);
        }
        // Fire user-message save without awaiting to avoid delaying time-to-first-letter.
        // The promise is awaited inside onFinish where we need the turnId.
        const lastUserMessage = messages[messages.length - 1];
        const lastUserText = lastUserMessage?.parts.find((part)=>part.type === 'text')?.text ?? '';
        const userMessagePromise = this.agentChatService.addMessage({
            threadId: thread.id,
            uiMessage: {
                role: _agentmessageentity.AgentMessageRole.USER,
                parts: lastUserMessage?.parts.filter((part)=>part.type === 'text' || part.type === 'file') ?? []
            }
        });
        // Prevent unhandled rejection if onFinish never runs (e.g. stream
        // setup error or empty response early-return). The real error still
        // surfaces when awaited in onFinish.
        userMessagePromise.catch(()=>{});
        // Title generation runs in parallel with AI streaming so it's
        // typically ready by the time onFinish fires
        const titlePromise = thread.title ? Promise.resolve(null) : this.agentChatService.generateTitleIfNeeded(thread.id, lastUserText).catch(()=>null);
        try {
            const uiStream = (0, _ai.createUIMessageStream)({
                execute: async ({ writer })=>{
                    const onCodeExecutionUpdate = (data)=>{
                        writer.write({
                            type: 'data-code-execution',
                            id: `code-execution-${data.executionId}`,
                            data
                        });
                    };
                    const { stream, modelConfig } = await this.chatExecutionService.streamChat({
                        workspace,
                        userWorkspaceId,
                        messages,
                        browsingContext,
                        onCodeExecutionUpdate,
                        modelId
                    });
                    let streamUsage = {
                        inputTokens: 0,
                        outputTokens: 0,
                        inputCredits: 0,
                        outputCredits: 0
                    };
                    let lastStepConversationSize = 0;
                    let totalCacheCreationTokens = 0;
                    writer.merge(stream.toUIMessageStream({
                        onError: (error)=>{
                            return error instanceof Error ? error.message : String(error);
                        },
                        sendStart: false,
                        messageMetadata: ({ part })=>{
                            if (part.type === 'finish-step') {
                                const stepInput = part.usage?.inputTokens ?? 0;
                                const stepCached = part.usage?.inputTokenDetails?.cacheReadTokens ?? 0;
                                const stepCacheCreation = (0, _extractcachecreationtokensutil.extractCacheCreationTokens)(part.providerMetadata);
                                totalCacheCreationTokens += stepCacheCreation;
                                lastStepConversationSize = stepInput + stepCached + stepCacheCreation;
                            }
                            if (part.type === 'finish') {
                                const { inputCredits, outputCredits, tokenCounts } = computeStreamCosts(modelConfig, part.totalUsage, totalCacheCreationTokens);
                                streamUsage = {
                                    inputTokens: tokenCounts.totalInputTokens,
                                    outputTokens: tokenCounts.outputTokens,
                                    inputCredits,
                                    outputCredits
                                };
                                return {
                                    createdAt: new Date().toISOString(),
                                    usage: {
                                        inputTokens: tokenCounts.totalInputTokens,
                                        outputTokens: tokenCounts.outputTokens,
                                        cachedInputTokens: tokenCounts.cachedInputTokens,
                                        inputCredits: (0, _todisplaycreditsutil.toDisplayCredits)(inputCredits),
                                        outputCredits: (0, _todisplaycreditsutil.toDisplayCredits)(outputCredits),
                                        conversationSize: lastStepConversationSize
                                    },
                                    model: {
                                        contextWindowTokens: modelConfig.contextWindowTokens
                                    }
                                };
                            }
                            return undefined;
                        },
                        onFinish: async ({ responseMessage })=>{
                            if (responseMessage.parts.length === 0) {
                                return;
                            }
                            const userMessage = await userMessagePromise;
                            await this.agentChatService.addMessage({
                                threadId: thread.id,
                                uiMessage: responseMessage,
                                turnId: userMessage.turnId
                            });
                            await this.threadRepository.update(thread.id, {
                                totalInputTokens: ()=>`"totalInputTokens" + ${streamUsage.inputTokens}`,
                                totalOutputTokens: ()=>`"totalOutputTokens" + ${streamUsage.outputTokens}`,
                                totalInputCredits: ()=>`"totalInputCredits" + ${streamUsage.inputCredits}`,
                                totalOutputCredits: ()=>`"totalOutputCredits" + ${streamUsage.outputCredits}`,
                                contextWindowTokens: modelConfig.contextWindowTokens,
                                conversationSize: lastStepConversationSize
                            });
                            const generatedTitle = await titlePromise;
                            if (generatedTitle) {
                                writer.write({
                                    type: 'data-thread-title',
                                    id: `thread-title-${thread.id}`,
                                    data: {
                                        title: generatedTitle
                                    }
                                });
                            }
                        },
                        sendReasoning: true
                    }));
                }
            });
            (0, _ai.pipeUIMessageStreamToResponse)({
                stream: uiStream,
                response,
                // Consume the stream independently so onFinish fires even if
                // the client disconnects (e.g., page refresh mid-stream)
                consumeSseStream: ({ stream })=>{
                    stream.pipeTo(new WritableStream()).catch(()=>{});
                }
            });
        } catch (error) {
            response.end();
            throw error;
        }
    }
    constructor(threadRepository, agentChatService, chatExecutionService){
        this.threadRepository = threadRepository;
        this.agentChatService = agentChatService;
        this.chatExecutionService = chatExecutionService;
    }
};
AgentChatStreamingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_agentchatthreadentity.AgentChatThreadEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof _agentchatservice.AgentChatService === "undefined" ? Object : _agentchatservice.AgentChatService,
        typeof _chatexecutionservice.ChatExecutionService === "undefined" ? Object : _chatexecutionservice.ChatExecutionService
    ])
], AgentChatStreamingService);
function computeStreamCosts(modelConfig, totalUsage, cacheCreationTokens) {
    const breakdown = (0, _computecostbreakdownutil.computeCostBreakdown)(modelConfig, {
        inputTokens: totalUsage?.inputTokens,
        outputTokens: totalUsage?.outputTokens,
        cachedInputTokens: totalUsage?.inputTokenDetails?.cacheReadTokens,
        reasoningTokens: totalUsage?.outputTokenDetails?.reasoningTokens,
        cacheCreationTokens
    });
    return {
        inputCredits: Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(breakdown.inputCostInDollars)),
        outputCredits: Math.round((0, _convertdollarstobillingcreditsutil.convertDollarsToBillingCredits)(breakdown.outputCostInDollars)),
        tokenCounts: {
            totalInputTokens: breakdown.tokenCounts.totalInputTokens,
            outputTokens: totalUsage?.outputTokens ?? 0,
            cachedInputTokens: breakdown.tokenCounts.cachedInputTokens
        }
    };
}

//# sourceMappingURL=agent-chat-streaming.service.js.map