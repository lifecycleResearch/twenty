"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BlocklistItemDeleteMessagesJob", {
    enumerable: true,
    get: function() {
        return BlocklistItemDeleteMessagesJob;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _processdecorator = require("../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagechanneldataaccessservice = require("../../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagingmessagecleanerservice = require("../../message-cleaner/services/messaging-message-cleaner.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BlocklistItemDeleteMessagesJob = class BlocklistItemDeleteMessagesJob {
    async handle(data) {
        const workspaceId = data.workspaceId;
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const blocklistItemIds = data.events.map((eventPayload)=>eventPayload.recordId);
            const blocklistRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'blocklist');
            const blocklist = await blocklistRepository.find({
                where: {
                    id: (0, _typeorm.Any)(blocklistItemIds)
                }
            });
            const handlesToDeleteByWorkspaceMemberIdMap = blocklist.reduce((acc, blocklistItem)=>{
                const { handle, workspaceMemberId } = blocklistItem;
                if (!acc.has(workspaceMemberId)) {
                    acc.set(workspaceMemberId, []);
                }
                if (!(0, _utils.isDefined)(handle)) {
                    return acc;
                }
                acc.get(workspaceMemberId)?.push(handle);
                return acc;
            }, new Map());
            const messageChannelMessageAssociationRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'messageChannelMessageAssociation');
            for (const workspaceMemberId of handlesToDeleteByWorkspaceMemberIdMap.keys()){
                const handles = handlesToDeleteByWorkspaceMemberIdMap.get(workspaceMemberId);
                if (!handles) {
                    continue;
                }
                const rolesToDelete = [
                    _types.MessageParticipantRole.FROM,
                    _types.MessageParticipantRole.TO
                ];
                const messageChannels = await this.messageChannelDataAccessService.findMany(workspaceId, {
                    select: {
                        id: true,
                        handle: true,
                        connectedAccount: {
                            handleAliases: true
                        }
                    },
                    where: {
                        connectedAccount: {
                            accountOwnerId: workspaceMemberId,
                            deletedAt: (0, _typeorm.IsNull)()
                        }
                    },
                    relations: [
                        'connectedAccount'
                    ]
                });
                for (const messageChannel of messageChannels){
                    const messageChannelHandles = [
                        messageChannel.handle
                    ];
                    const handleAliases = messageChannel.connectedAccount?.handleAliases;
                    if ((0, _utils.isDefined)(handleAliases)) {
                        const aliasList = Array.isArray(handleAliases) ? handleAliases : handleAliases.split(',');
                        messageChannelHandles.push(...aliasList);
                    }
                    const handleConditions = handles.map((handle)=>{
                        const isHandleDomain = handle.startsWith('@');
                        return isHandleDomain ? {
                            handle: (0, _typeorm.And)((0, _typeorm.Or)((0, _typeorm.ILike)(`%${handle}`), (0, _typeorm.ILike)(`%.${handle.slice(1)}`)), (0, _typeorm.Not)((0, _typeorm.In)(messageChannelHandles))),
                            role: (0, _typeorm.In)(rolesToDelete)
                        } : {
                            handle,
                            role: (0, _typeorm.In)(rolesToDelete)
                        };
                    });
                    const messageChannelMessageAssociationsToDelete = await messageChannelMessageAssociationRepository.find({
                        where: {
                            messageChannelId: messageChannel.id,
                            message: {
                                messageParticipants: handleConditions
                            }
                        }
                    });
                    if (messageChannelMessageAssociationsToDelete.length === 0) {
                        continue;
                    }
                    await messageChannelMessageAssociationRepository.delete(messageChannelMessageAssociationsToDelete.map(({ id })=>id));
                }
            }
            await this.threadCleanerService.cleanOrphanMessagesAndThreads(workspaceId);
        }, authContext);
    }
    constructor(threadCleanerService, globalWorkspaceOrmManager, messageChannelDataAccessService){
        this.threadCleanerService = threadCleanerService;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(BlocklistItemDeleteMessagesJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof BlocklistItemDeleteMessagesJobData === "undefined" ? Object : BlocklistItemDeleteMessagesJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], BlocklistItemDeleteMessagesJob.prototype, "handle", null);
BlocklistItemDeleteMessagesJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.messagingQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _messagingmessagecleanerservice.MessagingMessageCleanerService === "undefined" ? Object : _messagingmessagecleanerservice.MessagingMessageCleanerService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService
    ])
], BlocklistItemDeleteMessagesJob);

//# sourceMappingURL=messaging-blocklist-item-delete-messages.job.js.map