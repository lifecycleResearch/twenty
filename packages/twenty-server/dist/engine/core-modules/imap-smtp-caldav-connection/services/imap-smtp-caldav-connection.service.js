"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImapSmtpCaldavService", {
    enumerable: true,
    get: function() {
        return ImapSmtpCaldavService;
    }
});
const _common = require("@nestjs/common");
const _imapflow = require("imapflow");
const _nodemailer = require("nodemailer");
const _types = require("twenty-shared/types");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
const _connectedaccountdataaccessservice = require("../../../metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
const _caldavclient = require("../../../../modules/calendar/calendar-event-import-manager/drivers/caldav/lib/caldav.client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ImapSmtpCaldavService = class ImapSmtpCaldavService {
    async testImapConnection(handle, params) {
        const client = new _imapflow.ImapFlow({
            host: params.host,
            port: params.port,
            secure: params.secure ?? true,
            auth: {
                user: params.username ?? handle,
                pass: params.password
            },
            logger: false,
            tls: {
                rejectUnauthorized: false
            }
        });
        try {
            await client.connect();
            const mailboxes = await client.list();
            this.logger.log(`IMAP connection successful. Found ${mailboxes.length} mailboxes.`);
            return true;
        } catch (error) {
            this.logger.error(`IMAP connection failed: ${error.message}`, error.stack);
            if (error.authenticationFailed) {
                throw new _graphqlerrorsutil.UserInputError('IMAP authentication failed. Please check your credentials.', {
                    userFriendlyMessage: /*i18n*/ {
                        id: "v8UNEA",
                        message: "We couldn't log in to your email account. Please check your email address and password, then try again."
                    }
                });
            }
            if (error.code === 'ECONNREFUSED') {
                throw new _graphqlerrorsutil.UserInputError(`IMAP connection refused. Please verify server and port.`, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "ax8unE",
                        message: "We couldn't connect to your email server. Please check your server settings and try again."
                    }
                });
            }
            throw new _graphqlerrorsutil.UserInputError(`IMAP connection failed: ${error.message}`, {
                userFriendlyMessage: /*i18n*/ {
                    id: "YxBvFz",
                    message: "We encountered an issue connecting to your email account. Please check your settings and try again."
                }
            });
        } finally{
            if (client.authenticated) {
                await client.logout();
            }
        }
    }
    async testSmtpConnection(handle, params) {
        const transport = (0, _nodemailer.createTransport)({
            host: params.host,
            port: params.port,
            auth: {
                user: params.username ?? handle,
                pass: params.password
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        try {
            await transport.verify();
        } catch (error) {
            this.logger.error(`SMTP connection failed: ${error.message}`, error.stack);
            throw new _graphqlerrorsutil.UserInputError(`SMTP connection failed: ${error.message}`, {
                userFriendlyMessage: /*i18n*/ {
                    id: "g4rOV3",
                    message: "We couldn't connect to your outgoing email server. Please check your SMTP settings and try again."
                }
            });
        }
        return true;
    }
    async testCaldavConnection(handle, params) {
        const client = new _caldavclient.CalDAVClient({
            serverUrl: params.host,
            username: params.username ?? handle,
            password: params.password
        });
        try {
            await client.listCalendars();
            await client.validateSyncCollectionSupport();
        } catch (error) {
            this.logger.error(`CALDAV connection failed: ${error.message}`, error.stack);
            if (error.message?.includes('CALDAV_SYNC_COLLECTION_NOT_SUPPORTED')) {
                throw new _graphqlerrorsutil.UserInputError(`CALDAV connection failed: ${error.message}`, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "hDEOuv",
                        message: "Your CalDAV server does not support incremental sync (RFC 6578). Please use a compatible provider such as Nextcloud, iCloud, or Fastmail."
                    }
                });
            }
            if (error.code === 'FailedToOpenSocket') {
                throw new _graphqlerrorsutil.UserInputError(`CALDAV connection failed: ${error.message}`, {
                    userFriendlyMessage: /*i18n*/ {
                        id: "B3CG/U",
                        message: "We couldn't connect to your CalDAV server. Please check your server settings and try again."
                    }
                });
            }
            throw new _graphqlerrorsutil.UserInputError(`CALDAV connection failed: ${error.message}`, {
                userFriendlyMessage: /*i18n*/ {
                    id: "mIrUSZ",
                    message: "Invalid CALDAV credentials. Please check your username and password."
                }
            });
        }
        return true;
    }
    async testImapSmtpCaldav(handle, params, accountType) {
        if (accountType === 'IMAP') {
            return this.testImapConnection(handle, params);
        }
        if (accountType === 'SMTP') {
            return this.testSmtpConnection(handle, params);
        }
        if (accountType === 'CALDAV') {
            return this.testCaldavConnection(handle, params);
        }
        throw new _graphqlerrorsutil.UserInputError('Invalid account type. Must be one of: IMAP, SMTP, CALDAV', {
            userFriendlyMessage: /*i18n*/ {
                id: "0ldKS0",
                message: "Please select a valid connection type (IMAP, SMTP, or CalDAV) and try again."
            }
        });
    }
    async getImapSmtpCaldav(workspaceId, connectionId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const connectedAccount = await this.connectedAccountDataAccessService.findOne(workspaceId, {
                where: {
                    id: connectionId,
                    provider: _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV
                }
            });
            return connectedAccount;
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, connectedAccountDataAccessService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
        this.logger = new _common.Logger(ImapSmtpCaldavService.name);
    }
};
ImapSmtpCaldavService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService
    ])
], ImapSmtpCaldavService);

//# sourceMappingURL=imap-smtp-caldav-connection.service.js.map