"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineMessagingService", {
    enumerable: true,
    get: function() {
        return TimelineMessagingService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _typeorm = require("typeorm");
const _globalworkspaceormmanager = require("../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
const _messagechannelworkspaceentity = require("../../../../modules/messaging/common/standard-objects/message-channel.workspace-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TimelineMessagingService = class TimelineMessagingService {
    async getAndCountMessageThreads(personIds, workspaceId, offset, pageSize) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageThreadRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'messageThread');
            const totalNumberOfThreads = await messageThreadRepository.createQueryBuilder('messageThread').innerJoin('messageThread.messages', 'messages').innerJoin('messages.messageParticipants', 'messageParticipants').where('messageParticipants.personId IN(:...personIds)', {
                personIds
            }).groupBy('messageThread.id').getCount();
            const threadIdsQuery = await messageThreadRepository.createQueryBuilder('messageThread').select('messageThread.id', 'id').addSelect('MAX(messages.receivedAt)', 'max_received_at').innerJoin('messageThread.messages', 'messages').innerJoin('messages.messageParticipants', 'messageParticipants').where('messageParticipants.personId IN (:...personIds)', {
                personIds
            }).groupBy('messageThread.id').orderBy('max_received_at', 'DESC').offset(offset).limit(pageSize).getRawMany();
            const messageThreadIds = threadIdsQuery.map((thread)=>thread.id);
            const messageThreads = await messageThreadRepository.find({
                where: {
                    id: (0, _typeorm.In)(messageThreadIds)
                },
                order: {
                    messages: {
                        receivedAt: 'DESC'
                    }
                },
                relations: [
                    'messages'
                ]
            });
            return {
                messageThreads: messageThreads.map((messageThread)=>{
                    const lastMessage = messageThread.messages[0];
                    const firstMessage = messageThread.messages[messageThread.messages.length - 1];
                    return {
                        id: messageThread.id,
                        subject: firstMessage.subject ?? '',
                        lastMessageBody: lastMessage.text ?? '',
                        lastMessageReceivedAt: lastMessage.receivedAt ?? new Date(),
                        numberOfMessagesInThread: messageThread.messages.length
                    };
                }),
                totalNumberOfThreads
            };
        }, authContext);
    }
    async getThreadParticipantsByThreadId(messageThreadIds, workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageParticipantRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'messageParticipant');
            const threadParticipants = await messageParticipantRepository.createQueryBuilder().select('messageParticipant').addSelect('message.messageThreadId').addSelect('message.receivedAt').leftJoinAndSelect('messageParticipant.person', 'person').leftJoinAndSelect('messageParticipant.workspaceMember', 'workspaceMember').leftJoin('messageParticipant.message', 'message').where('message.messageThreadId = ANY(:messageThreadIds)', {
                messageThreadIds
            }).andWhere('messageParticipant.role = :role', {
                role: _types.MessageParticipantRole.FROM
            }).orderBy('message.messageThreadId').distinctOn([
                'message.messageThreadId',
                'messageParticipant.handle'
            ]).getMany();
            const orderedThreadParticipants = threadParticipants.sort((a, b)=>(a.message.receivedAt ?? new Date()).getTime() - (b.message.receivedAt ?? new Date()).getTime());
            const threadParticipantsWithCompositeFields = orderedThreadParticipants.map((threadParticipant)=>({
                    ...threadParticipant,
                    person: {
                        id: threadParticipant.person?.id,
                        name: {
                            //oxlint-disable-next-line
                            //@ts-ignore
                            firstName: threadParticipant.person?.nameFirstName,
                            //oxlint-disable-next-line
                            //@ts-ignore
                            lastName: threadParticipant.person?.nameLastName
                        },
                        avatarUrl: threadParticipant.person?.avatarUrl
                    },
                    workspaceMember: {
                        id: threadParticipant.workspaceMember?.id,
                        name: {
                            //oxlint-disable-next-line
                            //@ts-ignore
                            firstName: threadParticipant.workspaceMember?.nameFirstName,
                            //oxlint-disable-next-line
                            //@ts-ignore
                            lastName: threadParticipant.workspaceMember?.nameLastName
                        },
                        avatarUrl: threadParticipant.workspaceMember?.avatarUrl
                    }
                }));
            return threadParticipantsWithCompositeFields.reduce((threadParticipantsAcc, threadParticipant)=>{
                if (!threadParticipant.message.messageThreadId) return threadParticipantsAcc;
                if (// @ts-expect-error legacy noImplicitAny
                !threadParticipantsAcc[threadParticipant.message.messageThreadId]) // @ts-expect-error legacy noImplicitAny
                threadParticipantsAcc[threadParticipant.message.messageThreadId] = [];
                // @ts-expect-error legacy noImplicitAny
                threadParticipantsAcc[threadParticipant.message.messageThreadId].push(threadParticipant);
                return threadParticipantsAcc;
            }, {});
        }, authContext);
    }
    async getThreadVisibilityByThreadId(messageThreadIds, workspaceMemberId, workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageThreadRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'messageThread');
            const threadVisibility = await messageThreadRepository.createQueryBuilder().select('messageThread.id', 'id').addSelect('messageChannel.visibility', 'visibility').addSelect('connectedAccount.accountOwnerId', 'accountOwnerId').leftJoin('messageThread.messages', 'message').leftJoin('message.messageChannelMessageAssociations', 'messageChannelMessageAssociation').leftJoin('messageChannelMessageAssociation.messageChannel', 'messageChannel').leftJoin('messageChannel.connectedAccount', 'connectedAccount').where('messageThread.id = ANY(:messageThreadIds)', {
                messageThreadIds: messageThreadIds
            }).getRawMany();
            const visibilityValues = Object.values(_messagechannelworkspaceentity.MessageChannelVisibility);
            const threadVisibilityByThreadId = threadVisibility.reduce((threadVisibilityAcc, threadVisibility)=>{
                if (threadVisibility.accountOwnerId === workspaceMemberId) {
                    threadVisibilityAcc[threadVisibility.id] = _messagechannelworkspaceentity.MessageChannelVisibility.SHARE_EVERYTHING;
                    return threadVisibilityAcc;
                }
                threadVisibilityAcc[threadVisibility.id] = visibilityValues[Math.max(visibilityValues.indexOf(threadVisibility.visibility), visibilityValues.indexOf(threadVisibilityAcc[threadVisibility.id] ?? _messagechannelworkspaceentity.MessageChannelVisibility.METADATA))];
                return threadVisibilityAcc;
            }, {});
            return threadVisibilityByThreadId;
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
    }
};
TimelineMessagingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager
    ])
], TimelineMessagingService);

//# sourceMappingURL=timeline-messaging.service.js.map