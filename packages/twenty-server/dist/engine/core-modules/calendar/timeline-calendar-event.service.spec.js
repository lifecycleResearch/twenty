"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _constants = require("twenty-shared/constants");
const _globalworkspaceormmanager = require("../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _calendarchannelworkspaceentity = require("../../../modules/calendar/common/standard-objects/calendar-channel.workspace-entity");
const _timelinecalendareventservice = require("./timeline-calendar-event.service");
describe('TimelineCalendarEventService', ()=>{
    let service;
    let mockCalendarEventRepository;
    const mockCalendarEvent = {
        id: '1',
        title: 'Test Event',
        description: 'Test Description',
        startsAt: '2024-01-01T00:00:00.000Z',
        endsAt: '2024-01-01T01:00:00.000Z',
        calendarEventParticipants: [],
        calendarChannelEventAssociations: []
    };
    beforeEach(async ()=>{
        mockCalendarEventRepository = {
            find: jest.fn(),
            findAndCount: jest.fn()
        };
        const mockGlobalWorkspaceOrmManager = {
            getRepository: jest.fn().mockResolvedValue(mockCalendarEventRepository),
            executeInWorkspaceContext: jest.fn().mockImplementation((fn, _authContext)=>fn())
        };
        const module = await _testing.Test.createTestingModule({
            providers: [
                _timelinecalendareventservice.TimelineCalendarEventService,
                {
                    provide: _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
                    useValue: mockGlobalWorkspaceOrmManager
                }
            ]
        }).compile();
        service = module.get(_timelinecalendareventservice.TimelineCalendarEventService);
    });
    it('should return non-obfuscated calendar events if visibility is SHARE_EVERYTHING', async ()=>{
        const currentWorkspaceMemberId = 'current-workspace-member-id';
        const personIds = [
            'person-1'
        ];
        mockCalendarEventRepository.find.mockResolvedValue([
            {
                id: '1',
                startsAt: new Date()
            }
        ]);
        mockCalendarEventRepository.findAndCount.mockResolvedValue([
            [
                {
                    ...mockCalendarEvent,
                    calendarChannelEventAssociations: [
                        {
                            calendarChannel: {
                                visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING,
                                connectedAccount: {
                                    accountOwnerId: 'other-workspace-member-id'
                                }
                            }
                        }
                    ]
                }
            ],
            1
        ]);
        const result = await service.getCalendarEventsFromPersonIds({
            currentWorkspaceMemberId,
            personIds,
            workspaceId: 'test-workspace-id',
            page: 1,
            pageSize: 10
        });
        expect(result.timelineCalendarEvents[0].title).toBe('Test Event');
        expect(result.timelineCalendarEvents[0].description).toBe('Test Description');
    });
    it('should return obfuscated calendar events if visibility is METADATA', async ()=>{
        const currentWorkspaceMemberId = 'current-workspace-member-id';
        const personIds = [
            'person-1'
        ];
        mockCalendarEventRepository.find.mockResolvedValue([
            {
                id: '1',
                startsAt: new Date()
            }
        ]);
        mockCalendarEventRepository.findAndCount.mockResolvedValue([
            [
                {
                    ...mockCalendarEvent,
                    calendarChannelEventAssociations: [
                        {
                            calendarChannel: {
                                visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA,
                                connectedAccount: {
                                    accountOwnerId: 'other-workspace-member-id'
                                }
                            }
                        }
                    ]
                }
            ],
            1
        ]);
        const result = await service.getCalendarEventsFromPersonIds({
            currentWorkspaceMemberId,
            personIds,
            workspaceId: 'test-workspace-id',
            page: 1,
            pageSize: 10
        });
        expect(result.timelineCalendarEvents[0].title).toBe(_constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED);
        expect(result.timelineCalendarEvents[0].description).toBe(_constants.FIELD_RESTRICTED_ADDITIONAL_PERMISSIONS_REQUIRED);
    });
    it('should return non-obfuscated calendar events if visibility is METADATA and user is calendar events owner', async ()=>{
        const currentWorkspaceMemberId = 'current-workspace-member-id';
        const personIds = [
            'person-1'
        ];
        mockCalendarEventRepository.find.mockResolvedValue([
            {
                id: '1',
                startsAt: new Date()
            }
        ]);
        mockCalendarEventRepository.findAndCount.mockResolvedValue([
            [
                {
                    ...mockCalendarEvent,
                    calendarChannelEventAssociations: [
                        {
                            calendarChannel: {
                                visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA,
                                connectedAccount: {
                                    accountOwnerId: 'current-workspace-member-id'
                                }
                            }
                        }
                    ]
                }
            ],
            1
        ]);
        const result = await service.getCalendarEventsFromPersonIds({
            currentWorkspaceMemberId,
            personIds,
            workspaceId: 'test-workspace-id',
            page: 1,
            pageSize: 10
        });
        expect(result.timelineCalendarEvents[0].title).toBe('Test Event');
        expect(result.timelineCalendarEvents[0].description).toBe('Test Description');
    });
});

//# sourceMappingURL=timeline-calendar-event.service.spec.js.map