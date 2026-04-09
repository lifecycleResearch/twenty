"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _testing = require("@nestjs/testing");
const _types = require("twenty-shared/types");
const _cachestorageservice = require("../../../../../engine/core-modules/cache-storage/services/cache-storage.service");
const _cachestoragenamespaceenum = require("../../../../../engine/core-modules/cache-storage/types/cache-storage-namespace.enum");
const _globalworkspaceormmanager = require("../../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _blocklistrepository = require("../../../../blocklist/repositories/blocklist.repository");
const _emailaliasmanagerservice = require("../../../../connected-account/email-alias-manager/services/email-alias-manager.service");
const _connectedaccountrefreshtokensservice = require("../../../../connected-account/refresh-tokens-manager/services/connected-account-refresh-tokens.service");
const _messagechannelsyncstatusservice = require("../../../common/services/message-channel-sync-status.service");
const _messagechannelworkspaceentity = require("../../../common/standard-objects/message-channel.workspace-entity");
const _messaginggmailusersmessagesgetbatchsizeconstant = require("../../drivers/gmail/constants/messaging-gmail-users-messages-get-batch-size.constant");
const _messagingaccountauthenticationservice = require("../messaging-account-authentication.service");
const _messaginggetmessagesservice = require("../messaging-get-messages.service");
const _messagingimportexceptionhandlerservice = require("../messaging-import-exception-handler.service");
const _messagingmessagesimportservice = require("../messaging-messages-import.service");
const _messagingsavemessagesandenqueuecontactcreationservice = require("../messaging-save-messages-and-enqueue-contact-creation.service");
const _messagechanneldataaccessservice = require("../../../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _messagingmonitoringservice = require("../../../monitoring/services/messaging-monitoring.service");
describe('MessagingMessagesImportService', ()=>{
    let service;
    let messageChannelSyncStatusService;
    let connectedAccountRefreshTokensService;
    let emailAliasManagerService;
    let messagingGetMessagesService;
    let saveMessagesService;
    const workspaceId = 'workspace-id';
    let mockMessageChannel;
    let mockConnectedAccount;
    let providersBase;
    beforeEach(async ()=>{
        mockConnectedAccount = {
            id: 'connected-account-id',
            provider: _types.ConnectedAccountProvider.GOOGLE,
            handle: 'test@gmail.com',
            refreshToken: 'refresh-token',
            accessToken: 'old-access-token',
            accountOwnerId: 'account-owner-id',
            handleAliases: 'alias1@gmail.com,alias2@gmail.com'
        };
        mockMessageChannel = {
            id: 'message-channel-id',
            syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGES_IMPORT_SCHEDULED,
            connectedAccountId: mockConnectedAccount.id,
            handle: 'test@gmail.com',
            messageFolders: [],
            messageFolderImportPolicy: _messagechannelworkspaceentity.MessageFolderImportPolicy.ALL_FOLDERS
        };
        providersBase = [
            _messagingmessagesimportservice.MessagingMessagesImportService,
            {
                provide: _cachestorageservice.CacheStorageService,
                useValue: {
                    setAdd: jest.fn().mockResolvedValue(undefined)
                }
            },
            {
                provide: _messagechannelsyncstatusservice.MessageChannelSyncStatusService,
                useValue: {
                    markAsMessagesImportOngoing: jest.fn().mockResolvedValue(undefined),
                    markAsCompletedAndMarkAsMessagesListFetchPending: jest.fn().mockResolvedValue(undefined),
                    markAsMessagesImportPending: jest.fn().mockResolvedValue(undefined)
                }
            },
            {
                provide: _connectedaccountrefreshtokensservice.ConnectedAccountRefreshTokensService,
                useValue: {
                    refreshAndSaveTokens: jest.fn().mockResolvedValue({
                        accessToken: 'new-access-token',
                        refreshToken: 'new-refresh-token'
                    })
                }
            },
            {
                provide: _messagingmonitoringservice.MessagingMonitoringService,
                useValue: {
                    track: jest.fn().mockResolvedValue(undefined)
                }
            },
            {
                provide: 'BlocklistRepository',
                useValue: {
                    getByWorkspaceMemberId: jest.fn().mockResolvedValue([])
                }
            },
            {
                provide: _blocklistrepository.BlocklistRepository,
                useValue: {
                    getByWorkspaceMemberId: jest.fn().mockResolvedValue([])
                }
            },
            {
                provide: _emailaliasmanagerservice.EmailAliasManagerService,
                useValue: {
                    refreshHandleAliases: jest.fn().mockResolvedValue(undefined)
                }
            },
            {
                provide: _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
                useValue: {
                    getRepository: jest.fn().mockResolvedValue({
                        update: jest.fn().mockResolvedValue(undefined)
                    }),
                    executeInWorkspaceContext: jest.fn().mockImplementation((fn, _authContext)=>fn())
                }
            },
            {
                provide: _messagechanneldataaccessservice.MessageChannelDataAccessService,
                useValue: {
                    update: jest.fn().mockResolvedValue(undefined)
                }
            },
            {
                provide: _messaginggetmessagesservice.MessagingGetMessagesService,
                useValue: {
                    getMessages: jest.fn().mockResolvedValue([
                        {
                            id: 'message-1',
                            from: 'sender@example.com',
                            to: 'test@gmail.com'
                        },
                        {
                            id: 'message-2',
                            from: 'test@gmail.com',
                            to: 'recipient@example.com'
                        }
                    ])
                }
            },
            {
                provide: _messagingsavemessagesandenqueuecontactcreationservice.MessagingSaveMessagesAndEnqueueContactCreationService,
                useValue: {
                    saveMessagesAndEnqueueContactCreation: jest.fn().mockResolvedValue(undefined)
                }
            },
            {
                provide: _messagingimportexceptionhandlerservice.MessageImportExceptionHandlerService,
                useValue: {
                    handleDriverException: jest.fn().mockResolvedValue(undefined)
                }
            },
            {
                provide: _messagingaccountauthenticationservice.MessagingAccountAuthenticationService,
                useClass: _messagingaccountauthenticationservice.MessagingAccountAuthenticationService
            }
        ];
        const module = await _testing.Test.createTestingModule({
            providers: [
                ...providersBase,
                {
                    provide: _cachestoragenamespaceenum.CacheStorageNamespace.ModuleMessaging,
                    useValue: {
                        setPop: jest.fn().mockResolvedValue([
                            'message-id-1',
                            'message-id-2'
                        ]),
                        setAdd: jest.fn().mockResolvedValue(undefined)
                    }
                }
            ]
        }).overrideProvider(_common.Logger).useValue({
            log: jest.fn()
        }).compile();
        service = module.get(_messagingmessagesimportservice.MessagingMessagesImportService);
        messageChannelSyncStatusService = module.get(_messagechannelsyncstatusservice.MessageChannelSyncStatusService);
        connectedAccountRefreshTokensService = module.get(_connectedaccountrefreshtokensservice.ConnectedAccountRefreshTokensService);
        emailAliasManagerService = module.get(_emailaliasmanagerservice.EmailAliasManagerService);
        messagingGetMessagesService = module.get(_messaginggetmessagesservice.MessagingGetMessagesService);
        saveMessagesService = module.get(_messagingsavemessagesandenqueuecontactcreationservice.MessagingSaveMessagesAndEnqueueContactCreationService);
    });
    it('should fails if SyncStage is not MESSAGES_IMPORT_SCHEDULED', async ()=>{
        mockMessageChannel.syncStage = _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGES_IMPORT_PENDING;
        expect(service.processMessageBatchImport(mockMessageChannel, mockConnectedAccount, workspaceId)).resolves.toBeFalsy();
    });
    it('should process message batch import successfully', async ()=>{
        await service.processMessageBatchImport(mockMessageChannel, mockConnectedAccount, workspaceId);
        expect(messageChannelSyncStatusService.markAsMessagesImportOngoing).toHaveBeenCalledWith([
            mockMessageChannel.id
        ], workspaceId);
        expect(connectedAccountRefreshTokensService.refreshAndSaveTokens).toHaveBeenCalledWith(mockConnectedAccount, workspaceId);
        expect(emailAliasManagerService.refreshHandleAliases).toHaveBeenCalledWith({
            ...mockConnectedAccount,
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token'
        }, workspaceId);
        expect(messagingGetMessagesService.getMessages).toHaveBeenCalledWith([
            'message-id-1',
            'message-id-2'
        ], {
            ...mockConnectedAccount,
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token'
        }, mockMessageChannel);
        expect(saveMessagesService.saveMessagesAndEnqueueContactCreation).toHaveBeenCalled();
        expect(messageChannelSyncStatusService.markAsMessagesImportPending).toHaveBeenCalledTimes(0);
    });
    it('should process message batch import of more than MESSAGING_GMAIL_USERS_MESSAGES_GET_BATCH_SIZE successfully', async ()=>{
        const arrayMessagesBig = Array.from({
            length: _messaginggmailusersmessagesgetbatchsizeconstant.MESSAGING_GMAIL_USERS_MESSAGES_GET_BATCH_SIZE + 1
        }, (_, index)=>`message-id-${index + 1}`);
        const module = await _testing.Test.createTestingModule({
            providers: [
                ...providersBase,
                {
                    provide: _cachestoragenamespaceenum.CacheStorageNamespace.ModuleMessaging,
                    useValue: {
                        setPop: jest.fn().mockResolvedValue(arrayMessagesBig),
                        setAdd: jest.fn().mockResolvedValue(undefined)
                    }
                }
            ]
        }).overrideProvider(_common.Logger).useValue({
            log: jest.fn()
        }).compile();
        service = module.get(_messagingmessagesimportservice.MessagingMessagesImportService);
        messageChannelSyncStatusService = module.get(_messagechannelsyncstatusservice.MessageChannelSyncStatusService);
        connectedAccountRefreshTokensService = module.get(_connectedaccountrefreshtokensservice.ConnectedAccountRefreshTokensService);
        emailAliasManagerService = module.get(_emailaliasmanagerservice.EmailAliasManagerService);
        messagingGetMessagesService = module.get(_messaginggetmessagesservice.MessagingGetMessagesService);
        saveMessagesService = module.get(_messagingsavemessagesandenqueuecontactcreationservice.MessagingSaveMessagesAndEnqueueContactCreationService);
        await service.processMessageBatchImport(mockMessageChannel, mockConnectedAccount, workspaceId);
        expect(messageChannelSyncStatusService.markAsMessagesImportPending).toHaveBeenCalledTimes(1);
    });
});

//# sourceMappingURL=messaging-messages-import.service.spec.js.map