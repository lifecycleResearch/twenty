"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplyMessagesVisibilityRestrictionsService", {
    enumerable: true,
    get: function() {
        return ApplyMessagesVisibilityRestrictionsService;
    }
});
const _common = require("@nestjs/common");
const _lodashgroupby = /*#__PURE__*/ _interop_require_default(require("lodash.groupby"));
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _graphqlerrorsutil = require("../../../../../engine/core-modules/graphql/utils/graphql-errors.util");
const _connectedaccountdataaccessservice = require("../../../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _messagechannelworkspaceentity = require("../../standard-objects/message-channel.workspace-entity");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplyMessagesVisibilityRestrictionsService = class ApplyMessagesVisibilityRestrictionsService {
    async applyMessagesVisibilityRestrictions(messages, workspaceId, userId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageChannelMessageAssociationRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'messageChannelMessageAssociation');
            const messageChannelMessagesAssociations = await messageChannelMessageAssociationRepository.find({
                where: {
                    messageId: (0, _typeorm.In)(messages.map((message)=>message.id))
                },
                relations: [
                    'messageChannel'
                ]
            });
            const workspaceMemberRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, 'workspaceMember');
            for(let i = messages.length - 1; i >= 0; i--){
                const messageChannelMessageAssociations = messageChannelMessagesAssociations.filter((association)=>association.messageId === messages[i].id);
                const messageChannels = messageChannelMessageAssociations.map((association)=>association.messageChannel).filter((channel)=>channel !== null);
                if (messageChannels.length === 0) {
                    throw new _graphqlerrorsutil.NotFoundError('Associated message channels not found');
                }
                const messageChannelsGroupByVisibility = (0, _lodashgroupby.default)(messageChannels, (channel)=>channel.visibility);
                if (messageChannelsGroupByVisibility[_messagechannelworkspaceentity.MessageChannelVisibility.SHARE_EVERYTHING]) {
                    continue;
                }
                if ((0, _utils.isDefined)(userId)) {
                    const workspaceMember = await workspaceMemberRepository.findOneByOrFail({
                        userId
                    });
                    const connectedAccounts = await this.connectedAccountDataAccessService.find(workspaceId, {
                        messageChannels: {
                            id: (0, _typeorm.In)(messageChannels.map((channel)=>channel.id))
                        },
                        accountOwnerId: workspaceMember.id
                    });
                    if (connectedAccounts.length > 0) {
                        continue;
                    }
                }
                if (messageChannelsGroupByVisibility[_messagechannelworkspaceentity.MessageChannelVisibility.SUBJECT]) {
                    messages[i].text = _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED;
                    continue;
                }
                if (messageChannelsGroupByVisibility[_messagechannelworkspaceentity.MessageChannelVisibility.METADATA]) {
                    messages[i].subject = _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED;
                    messages[i].text = _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED;
                    continue;
                }
                messages.splice(i, 1);
            }
            return messages;
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, connectedAccountDataAccessService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
    }
};
ApplyMessagesVisibilityRestrictionsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService
    ])
], ApplyMessagesVisibilityRestrictionsService);

//# sourceMappingURL=apply-messages-visibility-restrictions.service.js.map