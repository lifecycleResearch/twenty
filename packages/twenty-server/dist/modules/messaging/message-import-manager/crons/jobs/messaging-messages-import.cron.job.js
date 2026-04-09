"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get MESSAGING_MESSAGES_IMPORT_CRON_PATTERN () {
        return MESSAGING_MESSAGES_IMPORT_CRON_PATTERN;
    },
    get MessagingMessagesImportCronJob () {
        return MessagingMessagesImportCronJob;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _sentrycronmonitordecorator = require("../../../../../engine/core-modules/cron/sentry-cron-monitor.decorator");
const _exceptionhandlerservice = require("../../../../../engine/core-modules/exception-handler/exception-handler.service");
const _featureflagservice = require("../../../../../engine/core-modules/feature-flag/services/feature-flag.service");
const _messagequeuedecorator = require("../../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _processdecorator = require("../../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../../engine/core-modules/message-queue/services/message-queue.service");
const _workspaceentity = require("../../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceexception = require("../../../../../engine/metadata-modules/data-source/data-source.exception");
const _getworkspaceschemanameutil = require("../../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
const _messagechannelworkspaceentity = require("../../../common/standard-objects/message-channel.workspace-entity");
const _messagingmessagesimportjob = require("../../jobs/messaging-messages-import.job");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const MESSAGING_MESSAGES_IMPORT_CRON_PATTERN = '*/1 * * * *';
let MessagingMessagesImportCronJob = class MessagingMessagesImportCronJob {
    async handle() {
        const activeWorkspaces = await this.workspaceRepository.find({
            where: {
                activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE
            }
        });
        for (const activeWorkspace of activeWorkspaces){
            try {
                const now = new Date().toISOString();
                // TODO: remove workspace schema branch once IS_CONNECTED_ACCOUNT_MIGRATED feature flag is removed
                const isMigrated = await this.featureFlagService.isFeatureEnabled(_types.FeatureFlagKey.IS_CONNECTED_ACCOUNT_MIGRATED, activeWorkspace.id);
                const [messageChannels] = isMigrated ? await this.coreDataSource.query(`UPDATE core."messageChannel" SET "syncStage" = '${_messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGES_IMPORT_SCHEDULED}', "syncStageStartedAt" = COALESCE("syncStageStartedAt", '${now}')
               WHERE "workspaceId" = '${activeWorkspace.id}' AND "isSyncEnabled" = true AND "syncStage" = '${_messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGES_IMPORT_PENDING}' RETURNING *`) : await this.coreDataSource.query(`UPDATE ${(0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(activeWorkspace.id)}."messageChannel" SET "syncStage" = '${_messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGES_IMPORT_SCHEDULED}', "syncStageStartedAt" = COALESCE("syncStageStartedAt", '${now}')
               WHERE "isSyncEnabled" = true AND "syncStage" = '${_messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGES_IMPORT_PENDING}' RETURNING *`);
                for (const messageChannel of messageChannels){
                    await this.messageQueueService.add(_messagingmessagesimportjob.MessagingMessagesImportJob.name, {
                        workspaceId: activeWorkspace.id,
                        messageChannelId: messageChannel.id
                    });
                }
            } catch (error) {
                // We had issues with the workspace schema not being found, due
                // to users deleting their workspaces in the middle of the cron job
                // We only throw an error when the workspace is found & schema not found
                if (error.code === '42P01' && error.message.includes('messageChannel" does not exist')) {
                    const refetchedWorkspace = await this.workspaceRepository.findOneBy({
                        id: activeWorkspace.id
                    });
                    if ((0, _utils.isDefined)(refetchedWorkspace)) {
                        this.exceptionHandlerService.captureExceptions([
                            error
                        ], {
                            workspace: {
                                id: activeWorkspace.id
                            }
                        });
                        throw new _datasourceexception.DataSourceException('Workspace schema not found while the workspace is still active', _datasourceexception.DataSourceExceptionCode.DATA_SOURCE_NOT_FOUND);
                    }
                } else {
                    this.exceptionHandlerService.captureExceptions([
                        error
                    ], {
                        workspace: {
                            id: activeWorkspace.id
                        }
                    });
                }
            }
        }
    }
    constructor(workspaceRepository, messageQueueService, exceptionHandlerService, coreDataSource, featureFlagService){
        this.workspaceRepository = workspaceRepository;
        this.messageQueueService = messageQueueService;
        this.exceptionHandlerService = exceptionHandlerService;
        this.coreDataSource = coreDataSource;
        this.featureFlagService = featureFlagService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(MessagingMessagesImportCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(MessagingMessagesImportCronJob.name, MESSAGING_MESSAGES_IMPORT_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], MessagingMessagesImportCronJob.prototype, "handle", null);
MessagingMessagesImportCronJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.messagingQueue)),
    _ts_param(3, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService
    ])
], MessagingMessagesImportCronJob);

//# sourceMappingURL=messaging-messages-import.cron.job.js.map