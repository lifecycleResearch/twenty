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
    get WORKFLOW_HANDLE_STALED_RUNS_CRON_PATTERN () {
        return WORKFLOW_HANDLE_STALED_RUNS_CRON_PATTERN;
    },
    get WorkflowHandleStaledRunsCronJob () {
        return WorkflowHandleStaledRunsCronJob;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
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
const _globalworkspaceormmanager = require("../../../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _workflowrunworkspaceentity = require("../../../../common/standard-objects/workflow-run.workspace-entity");
const _workflowhandlestaledrunsjob = require("../../jobs/workflow-handle-staled-runs.job");
const _getstaledrunsfindoptionsutil = require("../../utils/get-staled-runs-find-options.util");
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
const WORKFLOW_HANDLE_STALED_RUNS_CRON_PATTERN = '0 * * * *';
const WORKSPACE_BATCH_SIZE = 50;
let WorkflowHandleStaledRunsCronJob = class WorkflowHandleStaledRunsCronJob {
    async handle() {
        this.logger.log('Starting WorkflowHandleStaledRunsCronJob cron');
        const activeWorkspaces = await this.workspaceRepository.find({
            where: {
                activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE
            },
            select: [
                'id'
            ]
        });
        let enqueuedCount = 0;
        for(let workspaceIndex = 0; workspaceIndex < activeWorkspaces.length; workspaceIndex += WORKSPACE_BATCH_SIZE){
            const batch = activeWorkspaces.slice(workspaceIndex, workspaceIndex + WORKSPACE_BATCH_SIZE);
            const results = await Promise.allSettled(batch.map((workspace)=>this.checkAndEnqueue(workspace.id)));
            for (const [index, result] of results.entries()){
                if (result.status === 'fulfilled' && result.value) {
                    enqueuedCount++;
                }
                if (result.status === 'rejected') {
                    this.exceptionHandlerService.captureExceptions([
                        result.reason
                    ], {
                        workspace: {
                            id: batch[index].id
                        }
                    });
                }
            }
        }
        this.logger.log(`Completed WorkflowHandleStaledRunsCronJob cron, enqueued ${enqueuedCount} jobs`);
    }
    async checkAndEnqueue(workspaceId) {
        const hasStaledRuns = await this.hasStaledRuns(workspaceId);
        if (hasStaledRuns) {
            await this.messageQueueService.add(_workflowhandlestaledrunsjob.WorkflowHandleStaledRunsJob.name, {
                workspaceId
            });
            return true;
        }
        return false;
    }
    async hasStaledRuns(workspaceId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workflowRunRepository = await this.globalWorkspaceOrmManager.getRepository(workspaceId, _workflowrunworkspaceentity.WorkflowRunWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            return workflowRunRepository.exists({
                where: (0, _getstaledrunsfindoptionsutil.getStaledRunsFindOptions)()
            });
        }, authContext, {
            lite: true
        });
    }
    constructor(workspaceRepository, messageQueueService, globalWorkspaceOrmManager, exceptionHandlerService){
        this.workspaceRepository = workspaceRepository;
        this.messageQueueService = messageQueueService;
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.exceptionHandlerService = exceptionHandlerService;
        this.logger = new _common.Logger(WorkflowHandleStaledRunsCronJob.name);
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(WorkflowHandleStaledRunsCronJob.name),
    (0, _sentrycronmonitordecorator.SentryCronMonitor)(WorkflowHandleStaledRunsCronJob.name, WORKFLOW_HANDLE_STALED_RUNS_CRON_PATTERN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], WorkflowHandleStaledRunsCronJob.prototype, "handle", null);
WorkflowHandleStaledRunsCronJob = _ts_decorate([
    (0, _processordecorator.Processor)(_messagequeueconstants.MessageQueue.cronQueue),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.workflowQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService
    ])
], WorkflowHandleStaledRunsCronJob);

//# sourceMappingURL=workflow-handle-staled-runs.cron.job.js.map