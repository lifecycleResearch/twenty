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
    get WORKFLOW_CRON_TRIGGER_CRON_PATTERN () {
        return WORKFLOW_CRON_TRIGGER_CRON_PATTERN;
    },
    get WorkflowCronTriggerCronJob () {
        return WorkflowCronTriggerCronJob;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _sentrycronmonitordecorator = require("../../../../../../engine/core-modules/cron/sentry-cron-monitor.decorator");
const _exceptionhandlerservice = require("../../../../../../engine/core-modules/exception-handler/exception-handler.service");
const _messagequeuedecorator = require("../../../../../../engine/core-modules/message-queue/decorators/message-queue.decorator");
const _processdecorator = require("../../../../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../../../../engine/core-modules/message-queue/message-queue.constants");
const _messagequeueservice = require("../../../../../../engine/core-modules/message-queue/services/message-queue.service");
const _workspaceentity = require("../../../../../../engine/core-modules/workspace/workspace.entity");
const _getworkspaceschemanameutil = require("../../../../../../engine/workspace-datasource/utils/get-workspace-schema-name.util");
const _workflowautomatedtriggerworkspaceentity = require("../../../../common/standard-objects/workflow-automated-trigger.workspace-entity");
const _workflowtriggerjob = require("../../../jobs/workflow-trigger.job");
const _shouldrunnowutils = require("../../../../../../utils/should-run-now.utils");
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
const WORKFLOW_CRON_TRIGGER_CRON_PATTERN = '* * * * *';
let WorkflowCronTriggerCronJob = class WorkflowCronTriggerCronJob {
    async handle() {
        this.logger.log('WorkflowCronTriggerCronJob started');
        const activeWorkspaces = await this.workspaceRepository.find({
            where: {
                activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE
            }
        });
        this.logger.log(`Found ${activeWorkspaces.length} active workspaces`);
        const now = new Date();
        for (const activeWorkspace of activeWorkspaces){
            try {
                const schemaName = (0, _getworkspaceschemanameutil.getWorkspaceSchemaName)(activeWorkspace.id);
                const workflowAutomatedCronTriggers = await this.coreDataSource.query(`SELECT * FROM ${schemaName}."workflowAutomatedTrigger" WHERE type = '${_workflowautomatedtriggerworkspaceentity.AutomatedTriggerType.CRON}'`);
                this.logger.log(`Workspace ${activeWorkspace.id}: found ${workflowAutomatedCronTriggers.length} cron triggers`);
                for (const workflowAutomatedCronTrigger of workflowAutomatedCronTriggers){
                    const settings = workflowAutomatedCronTrigger.settings;
                    this.logger.log(`Trigger ${workflowAutomatedCronTrigger.id} for workflow ${workflowAutomatedCronTrigger.workflowId}: pattern=${settings.pattern}`);
                    if (!(0, _utils.isDefined)(settings.pattern)) {
                        this.logger.warn(`Trigger ${workflowAutomatedCronTrigger.id}: skipping - pattern not defined`);
                        continue;
                    }
                    const shouldRun = (0, _shouldrunnowutils.shouldRunNow)(settings.pattern, now);
                    this.logger.log(`Trigger ${workflowAutomatedCronTrigger.id}: shouldRunNow(${settings.pattern}, ${now.toISOString()}) = ${shouldRun}`);
                    if (!shouldRun) {
                        continue;
                    }
                    this.logger.log(`Trigger ${workflowAutomatedCronTrigger.id}: enqueuing WorkflowTriggerJob for workflow ${workflowAutomatedCronTrigger.workflowId}`);
                    await this.messageQueueService.add(_workflowtriggerjob.WorkflowTriggerJob.name, {
                        workspaceId: activeWorkspace.id,
                        workflowId: workflowAutomatedCronTrigger.workflowId,
                        payload: {}
                    }, {
                        retryLimit: 3
                    });
                }
            } catch (error) {
                this.logger.error(`Error processing workspace ${activeWorkspace.id}: ${error}`);
                this.exceptionHandlerService.captureExceptions([
                    error
                ], {
                    workspace: {
                        id: activeWorkspace.id
                    }
                });
            }
        }
        this.logger.log('WorkflowCronTriggerCronJob completed');
    }
    constructor(coreDataSource, workspaceRepository, messageQueueService, exceptionHandlerService){
        this.coreDataSource = coreDataSource;
        this.workspaceRepository = workspaceRepository;
        this.messageQueueService = messageQueueService;
        this.exceptionHandlerService = exceptionHandlerService;
        this.logger = new _common.Logger(WorkflowCronTriggerCronJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(WorkflowCronTriggerCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(WorkflowCronTriggerCronJob.name, WORKFLOW_CRON_TRIGGER_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], WorkflowCronTriggerCronJob.prototype, "handle", null);
WorkflowCronTriggerCronJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_param(0, (0, _typeorm.InjectDataSource)()),
    _ts_param(1, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(2, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.workflowQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService
    ])
], WorkflowCronTriggerCronJob);

//# sourceMappingURL=workflow-cron-trigger-cron.job.js.map