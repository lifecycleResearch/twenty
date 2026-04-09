"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _messagechanneldataaccessservice = require("../../../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _messagechannelworkspaceentity = require("../../../common/standard-objects/message-channel.workspace-entity");
const _messagingrelaunchfailedmessagechanneljob = require("../messaging-relaunch-failed-message-channel.job");
describe('MessagingRelaunchFailedMessageChannelJob', ()=>{
    let job;
    let mockUpdate;
    let mockFindOne;
    const workspaceId = 'workspace-id';
    const messageChannelId = 'message-channel-id';
    beforeEach(async ()=>{
        mockUpdate = jest.fn();
        mockFindOne = jest.fn();
        const providers = [
            _messagingrelaunchfailedmessagechanneljob.MessagingRelaunchFailedMessageChannelJob,
            {
                provide: _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
                useValue: {
                    executeInWorkspaceContext: jest.fn().mockImplementation((callback)=>callback())
                }
            },
            {
                provide: _messagechanneldataaccessservice.MessageChannelDataAccessService,
                useValue: {
                    findOne: mockFindOne,
                    update: mockUpdate
                }
            }
        ];
        const module = await _testing.Test.createTestingModule({
            providers
        }).compile();
        job = await module.resolve(_messagingrelaunchfailedmessagechanneljob.MessagingRelaunchFailedMessageChannelJob);
    });
    it('should reset throttle state when relaunching a failed channel', async ()=>{
        mockFindOne.mockResolvedValue({
            id: messageChannelId,
            syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.FAILED,
            syncStatus: _messagechannelworkspaceentity.MessageChannelSyncStatus.FAILED_UNKNOWN,
            throttleFailureCount: 5,
            throttleRetryAfter: '2026-03-19T06:49:34.295Z',
            syncStageStartedAt: '2026-03-19T06:34:34.000Z'
        });
        await job.handle({
            workspaceId,
            messageChannelId
        });
        expect(mockUpdate).toHaveBeenCalledWith(workspaceId, {
            id: messageChannelId
        }, {
            syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
            syncStatus: _messagechannelworkspaceentity.MessageChannelSyncStatus.ACTIVE,
            throttleFailureCount: 0,
            throttleRetryAfter: null,
            syncStageStartedAt: null
        });
    });
});

//# sourceMappingURL=messaging-relaunch-failed-message-channel.job.spec.js.map