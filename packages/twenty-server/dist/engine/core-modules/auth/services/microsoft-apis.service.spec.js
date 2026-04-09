"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _createcalendarchannelservice = require("./create-calendar-channel.service");
const _createconnectedaccountservice = require("./create-connected-account.service");
const _createmessagechannelservice = require("./create-message-channel.service");
const _microsoftapisservice = require("./microsoft-apis.service");
const _updateconnectedaccountonreconnectservice = require("./update-connected-account-on-reconnect.service");
const _calendarchanneldataaccessservice = require("../../../metadata-modules/calendar-channel/data-access/services/calendar-channel-data-access.service");
const _connectedaccountdataaccessservice = require("../../../metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _messagechanneldataaccessservice = require("../../../metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _getqueuetokenutil = require("../../message-queue/utils/get-queue-token.util");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _objectmetadataentity = require("../../../metadata-modules/object-metadata/object-metadata.entity");
const _globalworkspaceormmanager = require("../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _calendarchannelsyncstatusservice = require("../../../../modules/calendar/common/services/calendar-channel-sync-status.service");
const _calendarchannelworkspaceentity = require("../../../../modules/calendar/common/standard-objects/calendar-channel.workspace-entity");
const _accountstoreconnectservice = require("../../../../modules/connected-account/services/accounts-to-reconnect.service");
const _messagechannelsyncstatusservice = require("../../../../modules/messaging/common/services/message-channel-sync-status.service");
const _messagechannelworkspaceentity = require("../../../../modules/messaging/common/standard-objects/message-channel.workspace-entity");
jest.mock('uuid', ()=>({
        v4: jest.fn(()=>'mocked-uuid')
    }));
describe('MicrosoftAPIsService', ()=>{
    let service;
    let messagingChannelSyncStatusService;
    let calendarChannelSyncStatusService;
    let createMessageChannelService;
    const mockConnectedAccountDataAccessService = {
        findOne: jest.fn()
    };
    const mockMessageChannelDataAccessService = {
        find: jest.fn()
    };
    const mockCalendarChannelDataAccessService = {
        find: jest.fn()
    };
    const mockWorkspaceMemberRepository = {
        findOneOrFail: jest.fn()
    };
    const mockWorkspaceDataSource = {
        transaction: jest.fn((callback)=>callback({}))
    };
    const mockTwentyConfigService = {
        get: jest.fn()
    };
    const mockMessageQueueService = {
        add: jest.fn()
    };
    const mockCalendarQueueService = {
        add: jest.fn()
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _microsoftapisservice.MicrosoftAPIsService,
                {
                    provide: _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
                    useValue: {
                        getRepository: jest.fn().mockImplementation((_workspaceId, entity)=>{
                            if (entity === 'workspaceMember') return mockWorkspaceMemberRepository;
                            return {};
                        }),
                        getGlobalWorkspaceDataSource: jest.fn().mockResolvedValue(mockWorkspaceDataSource),
                        executeInWorkspaceContext: jest.fn().mockImplementation((fn, _authContext)=>fn())
                    }
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_objectmetadataentity.ObjectMetadataEntity),
                    useValue: {
                        findOneOrFail: jest.fn()
                    }
                },
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: mockTwentyConfigService
                },
                {
                    provide: _calendarchannelsyncstatusservice.CalendarChannelSyncStatusService,
                    useValue: {
                        resetAndMarkAsCalendarEventListFetchPending: jest.fn()
                    }
                },
                {
                    provide: _messagechannelsyncstatusservice.MessageChannelSyncStatusService,
                    useValue: {
                        resetAndMarkAsMessagesListFetchPending: jest.fn()
                    }
                },
                {
                    provide: _createconnectedaccountservice.CreateConnectedAccountService,
                    useValue: {
                        createConnectedAccount: jest.fn()
                    }
                },
                {
                    provide: _createmessagechannelservice.CreateMessageChannelService,
                    useValue: {
                        createMessageChannel: jest.fn().mockResolvedValue('message-channel-id')
                    }
                },
                {
                    provide: _createcalendarchannelservice.CreateCalendarChannelService,
                    useValue: {
                        createCalendarChannel: jest.fn()
                    }
                },
                {
                    provide: _updateconnectedaccountonreconnectservice.UpdateConnectedAccountOnReconnectService,
                    useValue: {
                        updateConnectedAccountOnReconnect: jest.fn()
                    }
                },
                {
                    provide: _accountstoreconnectservice.AccountsToReconnectService,
                    useValue: {
                        removeAccountToReconnect: jest.fn()
                    }
                },
                {
                    provide: (0, _getqueuetokenutil.getQueueToken)(_messagequeueconstants.MessageQueue.messagingQueue),
                    useValue: mockMessageQueueService
                },
                {
                    provide: (0, _getqueuetokenutil.getQueueToken)(_messagequeueconstants.MessageQueue.calendarQueue),
                    useValue: mockCalendarQueueService
                },
                {
                    provide: _connectedaccountdataaccessservice.ConnectedAccountDataAccessService,
                    useValue: mockConnectedAccountDataAccessService
                },
                {
                    provide: _messagechanneldataaccessservice.MessageChannelDataAccessService,
                    useValue: mockMessageChannelDataAccessService
                },
                {
                    provide: _calendarchanneldataaccessservice.CalendarChannelDataAccessService,
                    useValue: mockCalendarChannelDataAccessService
                }
            ]
        }).compile();
        service = module.get(_microsoftapisservice.MicrosoftAPIsService);
        calendarChannelSyncStatusService = module.get(_calendarchannelsyncstatusservice.CalendarChannelSyncStatusService);
        messagingChannelSyncStatusService = module.get(_messagechannelsyncstatusservice.MessageChannelSyncStatusService);
        createMessageChannelService = module.get(_createmessagechannelservice.CreateMessageChannelService);
    });
    describe('refreshMicrosoftRefreshToken', ()=>{
        it('should reset calendar channels and message channels', async ()=>{
            mockTwentyConfigService.get.mockImplementation((key)=>{
                if (key === 'CALENDAR_PROVIDER_MICROSOFT_ENABLED') return true;
                if (key === 'MESSAGING_PROVIDER_MICROSOFT_ENABLED') return true;
                return false;
            });
            const existingConnectedAccount = {
                id: 'existing-account-id',
                handle: 'test@example.com',
                accountOwnerId: 'workspace-member-id',
                provider: _types.ConnectedAccountProvider.MICROSOFT
            };
            mockConnectedAccountDataAccessService.findOne.mockResolvedValue(existingConnectedAccount);
            mockWorkspaceMemberRepository.findOneOrFail.mockResolvedValue({
                id: 'workspace-member-id',
                userId: 'user-id'
            });
            const failedCalendarChannel = {
                id: 'calendar-channel-id',
                connectedAccountId: 'existing-account-id',
                syncStatus: 'FAILED_UNKNOWN',
                syncStage: _calendarchannelworkspaceentity.CalendarChannelSyncStage.FAILED
            };
            mockCalendarChannelDataAccessService.find.mockResolvedValue([
                failedCalendarChannel
            ]);
            mockMessageChannelDataAccessService.find.mockResolvedValue([
                {
                    id: 'message-channel-id',
                    connectedAccountId: 'existing-account-id'
                }
            ]);
            await service.refreshMicrosoftRefreshToken({
                handle: 'test@example.com',
                workspaceMemberId: 'workspace-member-id',
                workspaceId: 'workspace-id',
                accessToken: 'new-access-token',
                refreshToken: 'new-refresh-token',
                calendarVisibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING,
                messageVisibility: _messagechannelworkspaceentity.MessageChannelVisibility.SHARE_EVERYTHING
            });
            expect(calendarChannelSyncStatusService.resetAndMarkAsCalendarEventListFetchPending).toHaveBeenCalledWith([
                existingConnectedAccount.id
            ], 'workspace-id');
            expect(messagingChannelSyncStatusService.resetAndMarkAsMessagesListFetchPending).toHaveBeenCalledWith([
                existingConnectedAccount.id
            ], 'workspace-id');
            expect(createMessageChannelService.createMessageChannel).not.toHaveBeenCalled();
        });
    });
});

//# sourceMappingURL=microsoft-apis.service.spec.js.map