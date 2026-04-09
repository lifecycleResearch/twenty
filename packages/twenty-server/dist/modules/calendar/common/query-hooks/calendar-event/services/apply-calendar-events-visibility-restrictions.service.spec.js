"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _constants = require("twenty-shared/constants");
const _connectedaccountdataaccessservice = require("../../../../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _calendarchannelworkspaceentity = require("../../../standard-objects/calendar-channel.workspace-entity");
const _applycalendareventsvisibilityrestrictionsservice = require("./apply-calendar-events-visibility-restrictions.service");
const createMockCalendarEvent = (id, title, description)=>({
        id,
        title,
        description,
        isCanceled: false,
        isFullDay: false,
        startsAt: '2024-03-20T10:00:00Z',
        endsAt: '2024-03-20T11:00:00Z',
        location: '',
        conferenceLink: {
            primaryLinkLabel: '',
            primaryLinkUrl: '',
            secondaryLinks: null
        },
        externalCreatedAt: '2024-03-20T09:00:00Z',
        externalUpdatedAt: '2024-03-20T09:00:00Z',
        deletedAt: null,
        createdAt: '2024-03-20T09:00:00Z',
        updatedAt: '2024-03-20T09:00:00Z',
        iCalUid: '',
        conferenceSolution: '',
        calendarChannelEventAssociations: [],
        calendarEventParticipants: []
    });
describe('ApplyCalendarEventsVisibilityRestrictionsService', ()=>{
    let service;
    const mockCalendarEventAssociationRepository = {
        find: jest.fn()
    };
    const mockWorkspaceMemberRepository = {
        findOneByOrFail: jest.fn()
    };
    const mockConnectedAccountDataAccessService = {
        find: jest.fn()
    };
    const mockGlobalWorkspaceOrmManager = {
        getRepository: jest.fn().mockImplementation((workspaceId, name)=>{
            if (name === 'calendarChannelEventAssociation') {
                return mockCalendarEventAssociationRepository;
            }
            if (name === 'workspaceMember') {
                return mockWorkspaceMemberRepository;
            }
        }),
        executeInWorkspaceContext: jest.fn().mockImplementation((fn, _authContext)=>fn())
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _applycalendareventsvisibilityrestrictionsservice.ApplyCalendarEventsVisibilityRestrictionsService,
                {
                    provide: _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
                    useValue: mockGlobalWorkspaceOrmManager
                },
                {
                    provide: _connectedaccountdataaccessservice.ConnectedAccountDataAccessService,
                    useValue: mockConnectedAccountDataAccessService
                }
            ]
        }).compile();
        service = module.get(_applycalendareventsvisibilityrestrictionsservice.ApplyCalendarEventsVisibilityRestrictionsService);
        // Clear all mocks before each test
        jest.clearAllMocks();
    });
    it('should return calendar event without obfuscated title and description if the visibility is SHARE_EVERYTHING', async ()=>{
        const calendarEvents = [
            createMockCalendarEvent('1', 'Test Event', 'Test Description')
        ];
        mockWorkspaceMemberRepository.findOneByOrFail.mockResolvedValue({
            id: 'workspace-member-id'
        });
        mockCalendarEventAssociationRepository.find.mockResolvedValue([
            {
                calendarEventId: '1',
                calendarChannel: {
                    id: '1',
                    visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING
                }
            }
        ]);
        const result = await service.applyCalendarEventsVisibilityRestrictions(calendarEvents, 'test-workspace-id', 'user-id');
        expect(result).toEqual(calendarEvents);
        expect(result.every((item)=>item.title !== _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED && item.description !== _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED)).toBe(true);
        expect(mockConnectedAccountDataAccessService.find).not.toHaveBeenCalled();
    });
    it('should return calendar event with obfuscated title and description if the visibility is METADATA', async ()=>{
        const calendarEvents = [
            createMockCalendarEvent('1', 'Test Event', 'Test Description')
        ];
        mockCalendarEventAssociationRepository.find.mockResolvedValue([
            {
                calendarEventId: '1',
                calendarChannel: {
                    id: '1',
                    visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA
                }
            }
        ]);
        mockWorkspaceMemberRepository.findOneByOrFail.mockResolvedValue({
            id: 'workspace-member-id'
        });
        mockConnectedAccountDataAccessService.find.mockResolvedValue([]);
        const result = await service.applyCalendarEventsVisibilityRestrictions(calendarEvents, 'test-workspace-id', 'user-id');
        expect(result).toEqual([
            {
                ...calendarEvents[0],
                title: _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED,
                description: _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED
            }
        ]);
    });
    it('should return calendar event without obfuscated title and description if the workspace member is the owner of the calendar event', async ()=>{
        const calendarEvents = [
            createMockCalendarEvent('1', 'Test Event', 'Test Description')
        ];
        mockCalendarEventAssociationRepository.find.mockResolvedValue([
            {
                calendarEventId: '1',
                calendarChannel: {
                    id: '1',
                    visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA
                }
            }
        ]);
        mockWorkspaceMemberRepository.findOneByOrFail.mockResolvedValue({
            id: 'workspace-member-account-owner-id'
        });
        mockConnectedAccountDataAccessService.find.mockResolvedValue([
            {
                id: '1'
            }
        ]);
        const result = await service.applyCalendarEventsVisibilityRestrictions(calendarEvents, 'test-workspace-id', 'user-id');
        expect(result).toEqual(calendarEvents);
        expect(result.every((item)=>item.title !== _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED && item.description !== _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED)).toBe(true);
    });
    it('should not return calendar event if visibility is not SHARE_EVERYTHING or METADATA and the workspace member is not the owner of the calendar event', async ()=>{
        const calendarEvents = [
            createMockCalendarEvent('1', 'Test Event', 'Test Description')
        ];
        mockCalendarEventAssociationRepository.find.mockResolvedValue([
            {
                calendarEventId: '1',
                calendarChannel: {
                    id: '1'
                }
            }
        ]);
        mockWorkspaceMemberRepository.findOneByOrFail.mockResolvedValue({
            id: 'workspace-member-not-account-owner-id'
        });
        mockConnectedAccountDataAccessService.find.mockResolvedValue([]);
        const result = await service.applyCalendarEventsVisibilityRestrictions(calendarEvents, 'test-workspace-id', 'user-id');
        expect(result).toEqual([]);
    });
    it('should return all calendar events with the right visibility', async ()=>{
        const calendarEvents = [
            createMockCalendarEvent('1', 'Event 1', 'Description 1'),
            createMockCalendarEvent('2', 'Event 2', 'Description 2'),
            createMockCalendarEvent('3', 'Event 3', 'Description 3')
        ];
        mockWorkspaceMemberRepository.findOneByOrFail.mockResolvedValue({
            id: 'workspace-member-id'
        });
        mockCalendarEventAssociationRepository.find.mockResolvedValue([
            {
                calendarEventId: '1',
                calendarChannel: {
                    id: '1',
                    visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING
                }
            },
            {
                calendarEventId: '2',
                calendarChannel: {
                    id: '2',
                    visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA
                }
            },
            {
                calendarEventId: '3',
                calendarChannel: {
                    id: '3',
                    visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA
                }
            }
        ]);
        mockConnectedAccountDataAccessService.find.mockResolvedValueOnce([]) // request for calendar event 3
        .mockResolvedValueOnce([
            {
                id: '1'
            }
        ]); // request for calendar event 2
        const result = await service.applyCalendarEventsVisibilityRestrictions(calendarEvents, 'test-workspace-id', 'user-id');
        expect(result).toEqual([
            calendarEvents[0],
            calendarEvents[1],
            {
                ...calendarEvents[2],
                title: _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED,
                description: _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED
            }
        ]);
    });
    it('should return all calendar events with the right visibility when userId is undefined (api key request)', async ()=>{
        const calendarEvents = [
            createMockCalendarEvent('1', 'Event 1', 'Description 1'),
            createMockCalendarEvent('2', 'Event 2', 'Description 2'),
            createMockCalendarEvent('3', 'Event 3', 'Description 3')
        ];
        mockWorkspaceMemberRepository.findOneByOrFail.mockResolvedValue({
            id: 'workspace-member-id'
        });
        mockCalendarEventAssociationRepository.find.mockResolvedValue([
            {
                calendarEventId: '1',
                calendarChannel: {
                    id: '1',
                    visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING
                }
            },
            {
                calendarEventId: '2',
                calendarChannel: {
                    id: '2',
                    visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA
                }
            },
            {
                calendarEventId: '3',
                calendarChannel: {
                    id: '3',
                    visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA
                }
            }
        ]);
        mockConnectedAccountDataAccessService.find.mockResolvedValueOnce([]) // request for calendar event 3
        .mockResolvedValueOnce([
            {
                id: '1'
            }
        ]); // request for calendar event 2
        const result = await service.applyCalendarEventsVisibilityRestrictions(calendarEvents, 'test-workspace-id', undefined);
        expect(result).toEqual([
            calendarEvents[0],
            calendarEvents[1],
            {
                ...calendarEvents[2],
                title: _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED,
                description: _constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED
            }
        ]);
    });
});

//# sourceMappingURL=apply-calendar-events-visibility-restrictions.service.spec.js.map