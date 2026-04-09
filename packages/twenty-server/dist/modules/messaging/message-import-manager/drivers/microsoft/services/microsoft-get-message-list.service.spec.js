"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _types = require("twenty-shared/types");
const _oauth2clientmanagerservice = require("../../../../../connected-account/oauth2-client-manager/services/oauth2-client-manager.service");
const _messagechannelworkspaceentity = require("../../../../common/standard-objects/message-channel.workspace-entity");
const _messagefolderworkspaceentity = require("../../../../common/standard-objects/message-folder.workspace-entity");
const _microsoftgetmessagelistservice = require("./microsoft-get-message-list.service");
const _microsoftmessagelistfetcherrorhandlerservice = require("./microsoft-message-list-fetch-error-handler.service");
const createMockFolder = (overrides)=>({
        id: `folder-${overrides.externalId}`,
        syncCursor: null,
        isSentFolder: false,
        parentFolderId: null,
        pendingSyncAction: _messagefolderworkspaceentity.MessageFolderPendingSyncAction.NONE,
        ...overrides
    });
describe('MicrosoftGetMessageListService', ()=>{
    let service;
    let oAuth2ClientManagerService;
    const mockConnectedAccount = {
        id: 'connected-account-id',
        provider: _types.ConnectedAccountProvider.MICROSOFT,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        handle: 'test@outlook.com',
        connectionParameters: {}
    };
    const createMockMicrosoftClient = ()=>({
            api: jest.fn().mockReturnThis(),
            version: jest.fn().mockReturnThis(),
            headers: jest.fn().mockReturnThis(),
            get: jest.fn().mockResolvedValue({
                value: [
                    {
                        id: 'msg-1'
                    },
                    {
                        id: 'msg-2'
                    }
                ],
                '@odata.deltaLink': 'https://graph.microsoft.com/delta?token=abc'
            })
        });
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _microsoftgetmessagelistservice.MicrosoftGetMessageListService,
                {
                    provide: _oauth2clientmanagerservice.OAuth2ClientManagerService,
                    useValue: {
                        getMicrosoftOAuth2Client: jest.fn()
                    }
                },
                {
                    provide: _microsoftmessagelistfetcherrorhandlerservice.MicrosoftMessageListFetchErrorHandler,
                    useValue: {
                        handleError: jest.fn()
                    }
                }
            ]
        }).compile();
        service = module.get(_microsoftgetmessagelistservice.MicrosoftGetMessageListService);
        oAuth2ClientManagerService = module.get(_oauth2clientmanagerservice.OAuth2ClientManagerService);
    });
    afterEach(()=>{
        jest.clearAllMocks();
    });
    describe('folder filtering based on import policy', ()=>{
        it('should only process synced folders when SELECTED_FOLDERS policy is set', async ()=>{
            const mockClient = createMockMicrosoftClient();
            oAuth2ClientManagerService.getMicrosoftOAuth2Client.mockResolvedValue(mockClient);
            const syncedFolder = createMockFolder({
                name: 'Inbox',
                externalId: 'inbox-id',
                isSynced: true
            });
            const nonSyncedFolder = createMockFolder({
                name: 'Personal',
                externalId: 'personal-id',
                isSynced: false
            });
            const result = await service.getMessageLists({
                connectedAccount: mockConnectedAccount,
                messageChannel: {
                    syncCursor: '',
                    id: 'channel-1',
                    messageFolderImportPolicy: _messagechannelworkspaceentity.MessageFolderImportPolicy.SELECTED_FOLDERS
                },
                messageFolders: [
                    syncedFolder,
                    nonSyncedFolder
                ]
            });
            expect(result).toHaveLength(1);
            expect(result[0].folderId).toBe(syncedFolder.id);
            expect(oAuth2ClientManagerService.getMicrosoftOAuth2Client).toHaveBeenCalledTimes(1);
        });
        it('should process all folders when ALL_FOLDERS policy is set', async ()=>{
            const mockClient = createMockMicrosoftClient();
            oAuth2ClientManagerService.getMicrosoftOAuth2Client.mockResolvedValue(mockClient);
            const syncedFolder = createMockFolder({
                name: 'Inbox',
                externalId: 'inbox-id',
                isSynced: true
            });
            const nonSyncedFolder = createMockFolder({
                name: 'Personal',
                externalId: 'personal-id',
                isSynced: false
            });
            const result = await service.getMessageLists({
                connectedAccount: mockConnectedAccount,
                messageChannel: {
                    syncCursor: '',
                    id: 'channel-1',
                    messageFolderImportPolicy: _messagechannelworkspaceentity.MessageFolderImportPolicy.ALL_FOLDERS
                },
                messageFolders: [
                    syncedFolder,
                    nonSyncedFolder
                ]
            });
            expect(result).toHaveLength(2);
            expect(result.map((r)=>r.folderId)).toEqual([
                syncedFolder.id,
                nonSyncedFolder.id
            ]);
        });
        it('should return empty array when SELECTED_FOLDERS policy and no folders are synced', async ()=>{
            const nonSyncedFolder1 = createMockFolder({
                name: 'Personal',
                externalId: 'personal-id',
                isSynced: false
            });
            const nonSyncedFolder2 = createMockFolder({
                name: 'Work',
                externalId: 'work-id',
                isSynced: false
            });
            const result = await service.getMessageLists({
                connectedAccount: mockConnectedAccount,
                messageChannel: {
                    syncCursor: '',
                    id: 'channel-1',
                    messageFolderImportPolicy: _messagechannelworkspaceentity.MessageFolderImportPolicy.SELECTED_FOLDERS
                },
                messageFolders: [
                    nonSyncedFolder1,
                    nonSyncedFolder2
                ]
            });
            expect(result).toEqual([]);
        });
        it('should process all non-synced folders when ALL_FOLDERS policy is set', async ()=>{
            const mockClient = createMockMicrosoftClient();
            oAuth2ClientManagerService.getMicrosoftOAuth2Client.mockResolvedValue(mockClient);
            const nonSyncedFolder1 = createMockFolder({
                name: 'Personal',
                externalId: 'personal-id',
                isSynced: false
            });
            const nonSyncedFolder2 = createMockFolder({
                name: 'Work',
                externalId: 'work-id',
                isSynced: false
            });
            const result = await service.getMessageLists({
                connectedAccount: mockConnectedAccount,
                messageChannel: {
                    syncCursor: '',
                    id: 'channel-1',
                    messageFolderImportPolicy: _messagechannelworkspaceentity.MessageFolderImportPolicy.ALL_FOLDERS
                },
                messageFolders: [
                    nonSyncedFolder1,
                    nonSyncedFolder2
                ]
            });
            expect(result).toHaveLength(2);
        });
        it('should return empty array when ALL_FOLDERS policy but messageFolders array is empty', async ()=>{
            const result = await service.getMessageLists({
                connectedAccount: mockConnectedAccount,
                messageChannel: {
                    syncCursor: '',
                    id: 'channel-1',
                    messageFolderImportPolicy: _messagechannelworkspaceentity.MessageFolderImportPolicy.ALL_FOLDERS
                },
                messageFolders: []
            });
            expect(result).toEqual([]);
        });
    });
});

//# sourceMappingURL=microsoft-get-message-list.service.spec.js.map