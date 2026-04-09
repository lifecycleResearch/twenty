"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImapSmtpCalDavAPIService", {
    enumerable: true,
    get: function() {
        return ImapSmtpCalDavAPIService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _createcalendarchannelservice = require("../../../engine/core-modules/auth/services/create-calendar-channel.service");
const _createmessagechannelservice = require("../../../engine/core-modules/auth/services/create-message-channel.service");
const _calendarchanneldataaccessservice = require("../../../engine/metadata-modules/calendar-channel/data-access/services/calendar-channel-data-access.service");
const _connectedaccountdataaccessservice = require("../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _messagechanneldataaccessservice = require("../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ImapSmtpCalDavAPIService = class ImapSmtpCalDavAPIService {
    async getImapSmtpCaldavConnectedAccount(workspaceId, id) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const connectedAccount = await this.connectedAccountDataAccessService.findOne(workspaceId, {
                where: {
                    id,
                    provider: _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV
                }
            });
            return connectedAccount;
        }, authContext);
    }
    async processAccount(input) {
        const { handle, workspaceId, workspaceMemberId, connectedAccountId } = input;
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const existingAccount = connectedAccountId ? await this.connectedAccountDataAccessService.findOne(workspaceId, {
                where: {
                    id: connectedAccountId
                }
            }) : await this.connectedAccountDataAccessService.findOne(workspaceId, {
                where: {
                    handle,
                    accountOwnerId: workspaceMemberId
                }
            });
            const newOrExistingAccountId = existingAccount?.id ?? connectedAccountId ?? (0, _uuid.v4)();
            const workspaceDataSource = await this.globalWorkspaceOrmManager.getGlobalWorkspaceDataSource();
            const existingMessageChannel = existingAccount ? await this.messageChannelDataAccessService.findOne(workspaceId, {
                where: {
                    connectedAccountId: existingAccount.id
                }
            }) : null;
            const existingCalendarChannel = existingAccount ? await this.calendarChannelDataAccessService.findOne(workspaceId, {
                where: {
                    connectedAccountId: existingAccount.id
                }
            }) : null;
            const shouldCreateMessageChannel = !(0, _utils.isDefined)(existingMessageChannel) && Boolean(input.connectionParameters.IMAP);
            const shouldCreateCalendarChannel = !(0, _utils.isDefined)(existingCalendarChannel) && Boolean(input.connectionParameters.CALDAV);
            await workspaceDataSource.transaction(async (manager)=>{
                await this.connectedAccountDataAccessService.save(workspaceId, {
                    id: newOrExistingAccountId,
                    handle,
                    provider: _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV,
                    connectionParameters: input.connectionParameters,
                    accountOwnerId: workspaceMemberId
                }, manager);
                if (shouldCreateMessageChannel) {
                    await this.createMessageChannelService.createMessageChannel({
                        workspaceId,
                        connectedAccountId: newOrExistingAccountId,
                        handle,
                        manager
                    });
                }
                if (shouldCreateCalendarChannel) {
                    await this.createCalendarChannelService.createCalendarChannel({
                        workspaceId,
                        connectedAccountId: newOrExistingAccountId,
                        handle,
                        manager
                    });
                }
            });
            return newOrExistingAccountId;
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, calendarChannelDataAccessService, connectedAccountDataAccessService, messageChannelDataAccessService, createMessageChannelService, createCalendarChannelService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.calendarChannelDataAccessService = calendarChannelDataAccessService;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
        this.createMessageChannelService = createMessageChannelService;
        this.createCalendarChannelService = createCalendarChannelService;
    }
};
ImapSmtpCalDavAPIService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _calendarchanneldataaccessservice.CalendarChannelDataAccessService === "undefined" ? Object : _calendarchanneldataaccessservice.CalendarChannelDataAccessService,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService,
        typeof _createmessagechannelservice.CreateMessageChannelService === "undefined" ? Object : _createmessagechannelservice.CreateMessageChannelService,
        typeof _createcalendarchannelservice.CreateCalendarChannelService === "undefined" ? Object : _createcalendarchannelservice.CreateCalendarChannelService
    ])
], ImapSmtpCalDavAPIService);

//# sourceMappingURL=imap-smtp-caldav-apis.service.js.map