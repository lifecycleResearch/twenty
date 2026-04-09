/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingWebhookSubscriptionService", {
    enumerable: true,
    get: function() {
        return BillingWebhookSubscriptionService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _getdeletedstripesubscriptionitemidsfromstripesubscriptioneventutil = require("../utils/get-deleted-stripe-subscription-item-ids-from-stripe-subscription-event.util");
const _transformstripesubscriptioneventtodatabasecustomerutil = require("../utils/transform-stripe-subscription-event-to-database-customer.util");
const _transformstripesubscriptioneventtodatabasesubscriptionitemutil = require("../utils/transform-stripe-subscription-event-to-database-subscription-item.util");
const _transformstripesubscriptioneventtodatabasesubscriptionutil = require("../utils/transform-stripe-subscription-event-to-database-subscription.util");
const _billingexception = require("../../billing/billing.exception");
const _billingcustomerentity = require("../../billing/entities/billing-customer.entity");
const _billingsubscriptionitementity = require("../../billing/entities/billing-subscription-item.entity");
const _billingsubscriptionentity = require("../../billing/entities/billing-subscription.entity");
const _billingsubscriptionstatusenum = require("../../billing/enums/billing-subscription-status.enum");
const _billingwebhookeventsenum = require("../../billing/enums/billing-webhook-events.enum");
const _billingsubscriptionservice = require("../../billing/services/billing-subscription.service");
const _stripebillingalertservice = require("../../billing/stripe/services/stripe-billing-alert.service");
const _stripecustomerservice = require("../../billing/stripe/services/stripe-customer.service");
const _stripesubscriptionscheduleservice = require("../../billing/stripe/services/stripe-subscription-schedule.service");
const _messagequeuedecorator = require("../../message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _messagequeueservice = require("../../message-queue/services/message-queue.service");
const _workspaceservice = require("../../workspace/services/workspace.service");
const _workspaceentity = require("../../workspace/workspace.entity");
const _cleanworkspacedeletionwarninguservarsjob = require("../../../workspace-manager/workspace-cleaner/jobs/clean-workspace-deletion-warning-user-vars.job");
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
let BillingWebhookSubscriptionService = class BillingWebhookSubscriptionService {
    async processStripeEvent(workspaceId, event) {
        const { data, type } = event;
        const workspace = await this.workspaceRepository.findOne({
            where: {
                id: workspaceId
            },
            withDeleted: true
        });
        if (!workspace) {
            throw new _billingexception.BillingException(`Workspace not found for subscription event ${event.id} / workspaceId: ${workspaceId}`, _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_EVENT_WORKSPACE_NOT_FOUND, {
                userFriendlyMessage: /*i18n*/ {
                    id: "bK8AyJ",
                    message: "Workspace {workspaceId} is not found.",
                    values: {
                        workspaceId: workspaceId
                    }
                }
            });
        }
        if ((0, _utils.isDefined)(workspace.deletedAt) && type !== _billingwebhookeventsenum.BillingWebhookEvent.CUSTOMER_SUBSCRIPTION_DELETED) {
            throw new _billingexception.BillingException(`Workspace not found for subscription event ${event.id} / workspaceId: ${workspaceId}`, _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_EVENT_WORKSPACE_NOT_FOUND, {
                userFriendlyMessage: /*i18n*/ {
                    id: "bK8AyJ",
                    message: "Workspace {workspaceId} is not found.",
                    values: {
                        workspaceId: workspaceId
                    }
                }
            });
        }
        await this.billingCustomerRepository.upsert((0, _transformstripesubscriptioneventtodatabasecustomerutil.transformStripeSubscriptionEventToDatabaseCustomer)(workspaceId, data), {
            conflictPaths: [
                'workspaceId'
            ],
            skipUpdateIfNoValuesChanged: true
        });
        await this.billingSubscriptionRepository.upsert((0, _transformstripesubscriptioneventtodatabasesubscriptionutil.transformStripeSubscriptionEventToDatabaseSubscription)(workspaceId, await this.stripeSubscriptionScheduleService.getSubscriptionWithSchedule(data.object.id)), {
            conflictPaths: [
                'stripeSubscriptionId'
            ],
            skipUpdateIfNoValuesChanged: true
        });
        const billingSubscriptions = await this.billingSubscriptionRepository.find({
            where: {
                workspaceId
            }
        });
        const updatedBillingSubscription = billingSubscriptions.find((subscription)=>subscription.stripeSubscriptionId === data.object.id);
        if (!updatedBillingSubscription) {
            throw new _billingexception.BillingException('Billing subscription not found after upsert', _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_FOUND);
        }
        await this.updateBillingSubscriptionItems(updatedBillingSubscription.id, event);
        const shouldSuspend = this.shouldSuspendWorkspace(data);
        if (shouldSuspend) {
            if (workspace.activationStatus === _workspace.WorkspaceActivationStatus.ACTIVE) {
                await this.workspaceRepository.update(workspaceId, {
                    activationStatus: _workspace.WorkspaceActivationStatus.SUSPENDED,
                    suspendedAt: new Date()
                });
            } else if (workspace.activationStatus === _workspace.WorkspaceActivationStatus.PENDING_CREATION) {
                await this.workspaceService.deleteWorkspace(workspace.id);
            }
        } else if (workspace.activationStatus === _workspace.WorkspaceActivationStatus.SUSPENDED) {
            await this.workspaceRepository.update(workspaceId, {
                activationStatus: _workspace.WorkspaceActivationStatus.ACTIVE,
                suspendedAt: null
            });
            await this.messageQueueService.add(_cleanworkspacedeletionwarninguservarsjob.CleanWorkspaceDeletionWarningUserVarsJob.name, {
                workspaceId
            });
        }
        await this.stripeCustomerService.updateCustomerMetadataWorkspaceId(String(data.object.customer), workspaceId);
        if (event.type === _billingwebhookeventsenum.BillingWebhookEvent.CUSTOMER_SUBSCRIPTION_CREATED) {
            await this.billingSubscriptionService.setBillingThresholdsAndTrialPeriodWorkflowCredits(updatedBillingSubscription.id);
            const gte = this.billingSubscriptionService.getTrialPeriodFreeWorkflowCredits(updatedBillingSubscription);
            await this.stripeBillingAlertService.createUsageThresholdAlertForCustomerMeter(updatedBillingSubscription.stripeCustomerId, gte);
        }
        return {
            stripeSubscriptionId: data.object.id,
            stripeCustomerId: data.object.customer
        };
    }
    shouldSuspendWorkspace(data) {
        const status = data.object.status;
        const suspendedStatuses = [
            _billingsubscriptionstatusenum.SubscriptionStatus.Canceled,
            _billingsubscriptionstatusenum.SubscriptionStatus.Unpaid,
            _billingsubscriptionstatusenum.SubscriptionStatus.Paused
        ];
        if (suspendedStatuses.includes(status)) {
            return true;
        }
        const timeSinceTrialEnd = Date.now() / 1000 - (data.object.trial_end || 0);
        const hasTrialJustEnded = timeSinceTrialEnd > 0 && timeSinceTrialEnd < 60 * 60 * 24;
        return hasTrialJustEnded && status === _billingsubscriptionstatusenum.SubscriptionStatus.PastDue;
    }
    async updateBillingSubscriptionItems(subscriptionId, event) {
        const deletedSubscriptionItemIds = (0, _getdeletedstripesubscriptionitemidsfromstripesubscriptioneventutil.getDeletedStripeSubscriptionItemIdsFromStripeSubscriptionEvent)(event);
        if (deletedSubscriptionItemIds.length > 0) {
            await this.billingSubscriptionItemRepository.delete({
                billingSubscriptionId: subscriptionId,
                stripeSubscriptionItemId: (0, _typeorm1.In)(deletedSubscriptionItemIds)
            });
        }
        await this.billingSubscriptionItemRepository.upsert((0, _transformstripesubscriptioneventtodatabasesubscriptionitemutil.transformStripeSubscriptionEventToDatabaseSubscriptionItem)(subscriptionId, event.data), {
            conflictPaths: [
                'stripeSubscriptionItemId'
            ],
            skipUpdateIfNoValuesChanged: true
        });
    }
    constructor(stripeCustomerService, messageQueueService, billingSubscriptionRepository, billingSubscriptionItemRepository, workspaceRepository, billingCustomerRepository, billingSubscriptionService, workspaceService, stripeSubscriptionScheduleService, stripeBillingAlertService){
        this.stripeCustomerService = stripeCustomerService;
        this.messageQueueService = messageQueueService;
        this.billingSubscriptionRepository = billingSubscriptionRepository;
        this.billingSubscriptionItemRepository = billingSubscriptionItemRepository;
        this.workspaceRepository = workspaceRepository;
        this.billingCustomerRepository = billingCustomerRepository;
        this.billingSubscriptionService = billingSubscriptionService;
        this.workspaceService = workspaceService;
        this.stripeSubscriptionScheduleService = stripeSubscriptionScheduleService;
        this.stripeBillingAlertService = stripeBillingAlertService;
        this.logger = new _common.Logger(BillingWebhookSubscriptionService.name);
    }
};
BillingWebhookSubscriptionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.workspaceQueue)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_billingsubscriptionitementity.BillingSubscriptionItemEntity)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(5, (0, _typeorm.InjectRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _stripecustomerservice.StripeCustomerService === "undefined" ? Object : _stripecustomerservice.StripeCustomerService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _workspaceservice.WorkspaceService === "undefined" ? Object : _workspaceservice.WorkspaceService,
        typeof _stripesubscriptionscheduleservice.StripeSubscriptionScheduleService === "undefined" ? Object : _stripesubscriptionscheduleservice.StripeSubscriptionScheduleService,
        typeof _stripebillingalertservice.StripeBillingAlertService === "undefined" ? Object : _stripebillingalertservice.StripeBillingAlertService
    ])
], BillingWebhookSubscriptionService);

//# sourceMappingURL=billing-webhook-subscription.service.js.map