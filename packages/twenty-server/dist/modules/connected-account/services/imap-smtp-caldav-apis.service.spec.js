"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _types = require("twenty-shared/types");
const _createcalendarchannelservice = require("../../../engine/core-modules/auth/services/create-calendar-channel.service");
const _createmessagechannelservice = require("../../../engine/core-modules/auth/services/create-message-channel.service");
const _calendarchanneldataaccessservice = require("../../../engine/metadata-modules/calendar-channel/data-access/services/calendar-channel-data-access.service");
const _connectedaccountdataaccessservice = require("../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _messagechanneldataaccessservice = require("../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _imapsmtpcaldavapisservice = require("./imap-smtp-caldav-apis.service");
jest.mock('uuid', ()=>({
        v4: jest.fn(()=>'mocked-uuid')
    }));
describe('ImapSmtpCalDavAPIService', ()=>{
    let service;
    const mockConnectedAccountDataAccessService = {
        findOne: jest.fn(),
        save: jest.fn()
    };
    const mockMessageChannelDataAccessService = {
        findOne: jest.fn()
    };
    const mockCalendarChannelDataAccessService = {
        findOne: jest.fn()
    };
    const mockWorkspaceDataSource = {
        transaction: jest.fn((callback)=>callback({}))
    };
    const mockCreateMessageChannelService = {
        createMessageChannel: jest.fn().mockResolvedValue('mocked-uuid')
    };
    const mockCreateCalendarChannelService = {
        createCalendarChannel: jest.fn().mockResolvedValue('mocked-uuid')
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _imapsmtpcaldavapisservice.ImapSmtpCalDavAPIService,
                {
                    provide: _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
                    useValue: {
                        getGlobalWorkspaceDataSource: jest.fn().mockResolvedValue(mockWorkspaceDataSource),
                        executeInWorkspaceContext: jest.fn().mockImplementation((fn, _authContext)=>fn())
                    }
                },
                {
                    provide: _createmessagechannelservice.CreateMessageChannelService,
                    useValue: mockCreateMessageChannelService
                },
                {
                    provide: _createcalendarchannelservice.CreateCalendarChannelService,
                    useValue: mockCreateCalendarChannelService
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
        service = module.get(_imapsmtpcaldavapisservice.ImapSmtpCalDavAPIService);
        jest.clearAllMocks();
    });
    describe('processAccount', ()=>{
        const baseInput = {
            handle: 'test@example.com',
            workspaceMemberId: 'workspace-member-id',
            workspaceId: 'workspace-id',
            connectionParameters: {
                IMAP: {
                    host: 'imap.example.com',
                    port: 993,
                    secure: true,
                    password: 'password'
                },
                SMTP: {
                    host: 'smtp.example.com',
                    port: 587,
                    secure: true,
                    username: 'test@example.com',
                    password: 'password'
                }
            }
        };
        it('should create new account with message channel when account does not exist and IMAP is configured', async ()=>{
            mockConnectedAccountDataAccessService.findOne.mockResolvedValue(null);
            mockMessageChannelDataAccessService.findOne.mockResolvedValue(null);
            mockCalendarChannelDataAccessService.findOne.mockResolvedValue(null);
            await service.processAccount(baseInput);
            expect(mockConnectedAccountDataAccessService.save).toHaveBeenCalledWith('workspace-id', {
                id: 'mocked-uuid',
                handle: 'test@example.com',
                provider: _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV,
                connectionParameters: baseInput.connectionParameters,
                accountOwnerId: 'workspace-member-id'
            }, {});
            expect(mockCreateMessageChannelService.createMessageChannel).toHaveBeenCalledWith({
                workspaceId: 'workspace-id',
                connectedAccountId: 'mocked-uuid',
                handle: 'test@example.com',
                manager: {}
            });
            expect(mockCreateCalendarChannelService.createCalendarChannel).not.toHaveBeenCalled();
        });
        it('should preserve existing channels when updating account credentials', async ()=>{
            const existingAccount = {
                id: 'existing-account-id',
                handle: 'test@example.com',
                accountOwnerId: 'workspace-member-id',
                provider: _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV
            };
            const existingMessageChannel = {
                id: 'existing-message-channel-id',
                connectedAccountId: 'existing-account-id'
            };
            const existingCalendarChannel = {
                id: 'existing-calendar-channel-id',
                connectedAccountId: 'existing-account-id'
            };
            mockConnectedAccountDataAccessService.findOne.mockResolvedValue(existingAccount);
            mockMessageChannelDataAccessService.findOne.mockResolvedValue(existingMessageChannel);
            mockCalendarChannelDataAccessService.findOne.mockResolvedValue(existingCalendarChannel);
            const inputWithConnectedAccountId = {
                ...baseInput,
                connectedAccountId: 'existing-account-id'
            };
            await service.processAccount(inputWithConnectedAccountId);
            expect(mockConnectedAccountDataAccessService.save).toHaveBeenCalledWith('workspace-id', {
                id: 'existing-account-id',
                handle: 'test@example.com',
                provider: _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV,
                connectionParameters: baseInput.connectionParameters,
                accountOwnerId: 'workspace-member-id'
            }, {});
            expect(mockCreateMessageChannelService.createMessageChannel).not.toHaveBeenCalled();
            expect(mockCreateCalendarChannelService.createCalendarChannel).not.toHaveBeenCalled();
        });
        it('should only create message channel when only IMAP is configured', async ()=>{
            const imapOnlyInput = {
                ...baseInput,
                connectionParameters: {
                    IMAP: {
                        host: 'imap.example.com',
                        port: 993,
                        secure: true,
                        password: 'password'
                    }
                }
            };
            mockConnectedAccountDataAccessService.findOne.mockResolvedValue(null);
            mockMessageChannelDataAccessService.findOne.mockResolvedValue(null);
            mockCalendarChannelDataAccessService.findOne.mockResolvedValue(null);
            await service.processAccount(imapOnlyInput);
            expect(mockCreateMessageChannelService.createMessageChannel).toHaveBeenCalled();
            expect(mockCreateCalendarChannelService.createCalendarChannel).not.toHaveBeenCalled();
        });
        it('should only create calendar channel when only CALDAV is configured', async ()=>{
            const caldavOnlyInput = {
                ...baseInput,
                connectionParameters: {
                    CALDAV: {
                        host: 'caldav.example.com',
                        port: 443,
                        secure: true,
                        username: 'test@example.com',
                        password: 'password'
                    }
                }
            };
            mockConnectedAccountDataAccessService.findOne.mockResolvedValue(null);
            mockMessageChannelDataAccessService.findOne.mockResolvedValue(null);
            mockCalendarChannelDataAccessService.findOne.mockResolvedValue(null);
            await service.processAccount(caldavOnlyInput);
            expect(mockCreateMessageChannelService.createMessageChannel).not.toHaveBeenCalled();
            expect(mockCreateCalendarChannelService.createCalendarChannel).toHaveBeenCalled();
        });
        it('should handle IMAP + SMTP configuration without CALDAV', async ()=>{
            const imapSmtpInput = {
                ...baseInput,
                connectionParameters: {
                    IMAP: {
                        host: 'imap.example.com',
                        port: 993,
                        secure: true,
                        password: 'password'
                    },
                    SMTP: {
                        host: 'smtp.example.com',
                        port: 587,
                        secure: true,
                        username: 'test@example.com',
                        password: 'password'
                    }
                }
            };
            mockConnectedAccountDataAccessService.findOne.mockResolvedValue(null);
            mockMessageChannelDataAccessService.findOne.mockResolvedValue(null);
            mockCalendarChannelDataAccessService.findOne.mockResolvedValue(null);
            await service.processAccount(imapSmtpInput);
            expect(mockCreateMessageChannelService.createMessageChannel).toHaveBeenCalled();
            expect(mockCreateCalendarChannelService.createCalendarChannel).not.toHaveBeenCalled();
        });
        it('should handle full IMAP + SMTP + CALDAV configuration', async ()=>{
            const fullConfigInput = {
                ...baseInput,
                connectionParameters: {
                    IMAP: {
                        host: 'imap.example.com',
                        port: 993,
                        secure: true,
                        password: 'password'
                    },
                    SMTP: {
                        host: 'smtp.example.com',
                        port: 587,
                        secure: true,
                        username: 'test@example.com',
                        password: 'password'
                    },
                    CALDAV: {
                        host: 'caldav.example.com',
                        port: 443,
                        secure: true,
                        username: 'test@example.com',
                        password: 'password'
                    }
                }
            };
            mockConnectedAccountDataAccessService.findOne.mockResolvedValue(null);
            mockMessageChannelDataAccessService.findOne.mockResolvedValue(null);
            mockCalendarChannelDataAccessService.findOne.mockResolvedValue(null);
            await service.processAccount(fullConfigInput);
            expect(mockCreateMessageChannelService.createMessageChannel).toHaveBeenCalled();
            expect(mockCreateCalendarChannelService.createCalendarChannel).toHaveBeenCalled();
        });
        it('should handle account found by handle when connectedAccountId is not provided', async ()=>{
            const existingAccount = {
                id: 'existing-account-id',
                handle: 'test@example.com',
                accountOwnerId: 'workspace-member-id',
                provider: _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV
            };
            mockConnectedAccountDataAccessService.findOne.mockResolvedValueOnce(existingAccount);
            mockMessageChannelDataAccessService.findOne.mockResolvedValue(null);
            mockCalendarChannelDataAccessService.findOne.mockResolvedValue(null);
            await service.processAccount(baseInput);
            expect(mockConnectedAccountDataAccessService.findOne).toHaveBeenCalledWith('workspace-id', {
                where: {
                    handle: 'test@example.com',
                    accountOwnerId: 'workspace-member-id'
                }
            });
            expect(mockConnectedAccountDataAccessService.save).toHaveBeenCalledWith('workspace-id', {
                id: 'existing-account-id',
                handle: 'test@example.com',
                provider: _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV,
                connectionParameters: baseInput.connectionParameters,
                accountOwnerId: 'workspace-member-id'
            }, {});
        });
        it('should not create channels when neither IMAP nor CALDAV is configured', async ()=>{
            const smtpOnlyInput = {
                ...baseInput,
                connectionParameters: {
                    SMTP: {
                        host: 'smtp.example.com',
                        port: 587,
                        secure: true,
                        username: 'test@example.com',
                        password: 'password'
                    }
                }
            };
            mockConnectedAccountDataAccessService.findOne.mockResolvedValue(null);
            mockMessageChannelDataAccessService.findOne.mockResolvedValue(null);
            mockCalendarChannelDataAccessService.findOne.mockResolvedValue(null);
            await service.processAccount(smtpOnlyInput);
            expect(mockCreateMessageChannelService.createMessageChannel).not.toHaveBeenCalled();
            expect(mockCreateCalendarChannelService.createCalendarChannel).not.toHaveBeenCalled();
        });
        it('should handle transaction correctly', async ()=>{
            mockConnectedAccountDataAccessService.findOne.mockResolvedValue(null);
            mockMessageChannelDataAccessService.findOne.mockResolvedValue(null);
            mockCalendarChannelDataAccessService.findOne.mockResolvedValue(null);
            await service.processAccount(baseInput);
            expect(mockWorkspaceDataSource.transaction).toHaveBeenCalledWith(expect.any(Function));
        });
    });
});

//# sourceMappingURL=imap-smtp-caldav-apis.service.spec.js.map