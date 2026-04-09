/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingSubscriptionService", {
    enumerable: true,
    get: function() {
        return BillingSubscriptionService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _datefns = require("date-fns");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _transformstripesubscriptioneventtodatabasecustomerutil = require("../../billing-webhook/utils/transform-stripe-subscription-event-to-database-customer.util");
const _transformstripesubscriptioneventtodatabasesubscriptionitemutil = require("../../billing-webhook/utils/transform-stripe-subscription-event-to-database-subscription-item.util");
const _transformstripesubscriptioneventtodatabasesubscriptionutil = require("../../billing-webhook/utils/transform-stripe-subscription-event-to-database-subscription.util");
const _billingexception = require("../billing.exception");
const _billingcustomerentity = require("../entities/billing-customer.entity");
const _billingentitlemententity = require("../entities/billing-entitlement.entity");
const _billingsubscriptionitementity = require("../entities/billing-subscription-item.entity");
const _billingsubscriptionentity = require("../entities/billing-subscription.entity");
const _billingentitlementkeyenum = require("../enums/billing-entitlement-key.enum");
const _billingproductkeyenum = require("../enums/billing-product-key.enum");
const _billingsubscriptionstatusenum = require("../enums/billing-subscription-status.enum");
const _billingplanservice = require("./billing-plan.service");
const _billingpriceservice = require("./billing-price.service");
const _meteredcreditservice = require("./metered-credit.service");
const _stripecustomerservice = require("../stripe/services/stripe-customer.service");
const _stripesubscriptionscheduleservice = require("../stripe/services/stripe-subscription-schedule.service");
const _stripesubscriptionservice = require("../stripe/services/stripe-subscription.service");
const _getplankeyfromsubscriptionutil = require("../utils/get-plan-key-from-subscription.util");
const _enterpriseplanservice = require("../../enterprise/services/enterprise-plan.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
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
let BillingSubscriptionService = class BillingSubscriptionService {
    async getBillingSubscriptions(workspaceId) {
        return await this.billingSubscriptionRepository.find({
            where: {
                workspaceId
            }
        });
    }
    async getCurrentBillingSubscription(criteria) {
        const notCanceledSubscriptions = await this.billingSubscriptionRepository.find({
            where: {
                ...criteria,
                status: (0, _typeorm1.Not)(_billingsubscriptionstatusenum.SubscriptionStatus.Canceled)
            },
            relations: [
                'billingSubscriptionItems',
                'billingSubscriptionItems.billingProduct'
            ]
        });
        if (notCanceledSubscriptions.length > 1) {
            throw new _billingexception.BillingException(`More than one not canceled subscription for workspace ${criteria.workspaceId}`, _billingexception.BillingExceptionCode.BILLING_TOO_MUCH_SUBSCRIPTIONS_FOUND);
        }
        return notCanceledSubscriptions[0];
    }
    async getCurrentBillingSubscriptionOrThrow(criteria) {
        const notCanceledSubscription = await this.getCurrentBillingSubscription(criteria);
        (0, _utils.assertIsDefinedOrThrow)(notCanceledSubscription, new _billingexception.BillingException(`No active subscription found for workspace ${criteria.workspaceId}`, _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_FOUND));
        return notCanceledSubscription;
    }
    async getBaseProductCurrentBillingSubscriptionItemOrThrow(workspaceId) {
        const billingSubscription = await this.getCurrentBillingSubscriptionOrThrow({
            workspaceId
        });
        const planKey = (0, _getplankeyfromsubscriptionutil.getPlanKeyFromSubscription)(billingSubscription);
        const baseProduct = await this.billingPlanService.getPlanBaseProduct(planKey);
        if (!baseProduct) {
            throw new _billingexception.BillingException('Base product not found', _billingexception.BillingExceptionCode.BILLING_PRODUCT_NOT_FOUND);
        }
        const stripeProductId = baseProduct.stripeProductId;
        const billingSubscriptionItem = billingSubscription.billingSubscriptionItems.find((item)=>item.stripeProductId === stripeProductId);
        if (!billingSubscriptionItem) {
            throw new _billingexception.BillingException(`Cannot find billingSubscriptionItem for product ${stripeProductId} for workspace ${workspaceId}`, _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_ITEM_NOT_FOUND);
        }
        return billingSubscriptionItem;
    }
    async deleteSubscriptions(workspaceId) {
        const subscriptionToCancel = await this.getCurrentBillingSubscription({
            workspaceId
        });
        if ((0, _utils.isDefined)(subscriptionToCancel)) {
            await this.stripeSubscriptionService.cancelSubscription(subscriptionToCancel.stripeSubscriptionId);
        }
        await this.billingSubscriptionRepository.delete({
            workspaceId
        });
    }
    async handleUnpaidInvoices(data) {
        const billingSubscription = await this.getCurrentBillingSubscriptionOrThrow({
            stripeCustomerId: data.object.customer
        });
        if (billingSubscription.status === _billingsubscriptionstatusenum.SubscriptionStatus.Unpaid) {
            await this.stripeSubscriptionService.collectLastInvoice(billingSubscription.stripeSubscriptionId);
        }
        return {
            handleUnpaidInvoiceStripeSubscriptionId: billingSubscription.stripeSubscriptionId
        };
    }
    async getWorkspaceEntitlements(workspaceId) {
        const isBillingEnabled = this.twentyConfigService.get('IS_BILLING_ENABLED');
        const hasValidEnterprisePlan = this.enterprisePlanService.isValid();
        const entitlements = isBillingEnabled ? await this.billingEntitlementRepository.find({
            where: {
                workspaceId
            }
        }) : [];
        const entitlementsByKey = entitlements.reduce((acc, entitlement)=>{
            acc[entitlement.key] = entitlement;
            return acc;
        }, {});
        return Object.values(_billingentitlementkeyenum.BillingEntitlementKey).map((key)=>({
                key,
                value: hasValidEnterprisePlan && (!isBillingEnabled || (entitlementsByKey[key]?.value ?? false))
            }));
    }
    async getWorkspaceEntitlementByKey(workspaceId, key) {
        const entitlement = await this.billingEntitlementRepository.findOneBy({
            workspaceId,
            key,
            value: true
        });
        return entitlement?.value ?? false;
    }
    async endTrialPeriod(workspace) {
        const billingSubscription = await this.getCurrentBillingSubscriptionOrThrow({
            workspaceId: workspace.id
        });
        if (billingSubscription.status !== _billingsubscriptionstatusenum.SubscriptionStatus.Trialing) {
            throw new _billingexception.BillingException('Billing subscription is not in trial period', _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_IN_TRIAL_PERIOD);
        }
        const hasPaymentMethod = await this.stripeCustomerService.hasPaymentMethod(billingSubscription.stripeCustomerId);
        if (!hasPaymentMethod) {
            return {
                hasPaymentMethod: false,
                status: undefined,
                stripeCustomerId: billingSubscription.stripeCustomerId
            };
        }
        const updatedSubscription = await this.stripeSubscriptionService.updateSubscription(billingSubscription.stripeSubscriptionId, {
            trial_end: 'now'
        });
        await this.billingSubscriptionItemRepository.update({
            stripeSubscriptionId: updatedSubscription.id
        }, {
            hasReachedCurrentPeriodCap: false
        });
        await this.meteredCreditService.recreateBillingAlertForSubscription(billingSubscription);
        return {
            status: (0, _transformstripesubscriptioneventtodatabasesubscriptionutil.getSubscriptionStatus)(updatedSubscription.status),
            hasPaymentMethod: true
        };
    }
    async setBillingThresholdsAndTrialPeriodWorkflowCredits(billingSubscriptionId) {
        const billingSubscription = await this.billingSubscriptionRepository.findOneOrFail({
            where: {
                id: billingSubscriptionId
            },
            relations: [
                'billingSubscriptionItems',
                'billingSubscriptionItems.billingProduct'
            ]
        });
        const { stripePriceId: meterStripePriceId } = (0, _utils.findOrThrow)(billingSubscription.billingSubscriptionItems, (billingSubscriptionItem)=>billingSubscriptionItem.billingProduct.metadata.productKey === _billingproductkeyenum.BillingProductKey.WORKFLOW_NODE_EXECUTION);
        await this.stripeSubscriptionService.updateSubscription(billingSubscription.stripeSubscriptionId, {
            billing_thresholds: await this.billingPriceService.getBillingThresholdsByMeterPriceId(meterStripePriceId)
        });
    }
    async syncSubscriptionToDatabase(workspaceId, stripeSubscriptionId) {
        const subscription = await this.stripeSubscriptionScheduleService.getSubscriptionWithSchedule(stripeSubscriptionId);
        await this.billingCustomerRepository.upsert((0, _transformstripesubscriptioneventtodatabasecustomerutil.transformStripeSubscriptionEventToDatabaseCustomer)(workspaceId, {
            object: subscription
        }), {
            conflictPaths: [
                'workspaceId'
            ],
            skipUpdateIfNoValuesChanged: true
        });
        await this.billingSubscriptionRepository.upsert((0, _transformstripesubscriptioneventtodatabasesubscriptionutil.transformStripeSubscriptionEventToDatabaseSubscription)(workspaceId, subscription), {
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
        const currentBillingSubscription = billingSubscriptions.find((sub)=>sub.stripeSubscriptionId === subscription.id);
        if (!currentBillingSubscription) {
            throw new _billingexception.BillingException('Billing subscription not found after creation', _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_FOUND);
        }
        const billingSubscriptionItems = (0, _transformstripesubscriptioneventtodatabasesubscriptionitemutil.transformStripeSubscriptionEventToDatabaseSubscriptionItem)(currentBillingSubscription.id, {
            object: subscription
        });
        const meterBillingSubscriptionItem = (0, _utils.findOrThrow)(billingSubscriptionItems, (item)=>!(0, _utils.isDefined)(item.quantity));
        const existingBillingSubscriptionItem = await this.billingSubscriptionItemRepository.findOne({
            where: {
                billingSubscriptionId: currentBillingSubscription.id,
                stripeProductId: meterBillingSubscriptionItem.stripeProductId
            }
        });
        if (existingBillingSubscriptionItem?.stripeSubscriptionItemId !== meterBillingSubscriptionItem.stripeSubscriptionItemId) {
            await this.billingSubscriptionItemRepository.delete({
                billingSubscriptionId: currentBillingSubscription.id,
                stripeProductId: meterBillingSubscriptionItem.stripeProductId
            });
        }
        await this.billingSubscriptionItemRepository.upsert(billingSubscriptionItems, {
            conflictPaths: [
                'stripeSubscriptionItemId'
            ],
            skipUpdateIfNoValuesChanged: true
        });
        this.logger.log(`Subscription synced to database: ${subscription.id} for workspace: ${workspaceId}`);
        return currentBillingSubscription;
    }
    getTrialPeriodFreeWorkflowCredits(billingSubscription) {
        const trialDuration = (0, _utils.isDefined)(billingSubscription.trialEnd) && (0, _utils.isDefined)(billingSubscription.trialStart) ? (0, _datefns.differenceInDays)(billingSubscription.trialEnd, billingSubscription.trialStart) : 0;
        const trialWithCreditCardDuration = this.twentyConfigService.get('BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS');
        return Number(this.twentyConfigService.get(trialDuration === trialWithCreditCardDuration ? 'BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITH_CREDIT_CARD' : 'BILLING_FREE_WORKFLOW_CREDITS_FOR_TRIAL_PERIOD_WITHOUT_CREDIT_CARD'));
    }
    constructor(stripeSubscriptionService, billingPriceService, billingPlanService, billingEntitlementRepository, billingSubscriptionRepository, stripeCustomerService, twentyConfigService, billingSubscriptionItemRepository, stripeSubscriptionScheduleService, billingCustomerRepository, meteredCreditService, enterprisePlanService){
        this.stripeSubscriptionService = stripeSubscriptionService;
        this.billingPriceService = billingPriceService;
        this.billingPlanService = billingPlanService;
        this.billingEntitlementRepository = billingEntitlementRepository;
        this.billingSubscriptionRepository = billingSubscriptionRepository;
        this.stripeCustomerService = stripeCustomerService;
        this.twentyConfigService = twentyConfigService;
        this.billingSubscriptionItemRepository = billingSubscriptionItemRepository;
        this.stripeSubscriptionScheduleService = stripeSubscriptionScheduleService;
        this.billingCustomerRepository = billingCustomerRepository;
        this.meteredCreditService = meteredCreditService;
        this.enterprisePlanService = enterprisePlanService;
        this.logger = new _common.Logger(BillingSubscriptionService.name);
    }
};
BillingSubscriptionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_billingentitlemententity.BillingEntitlementEntity)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_param(7, (0, _typeorm.InjectRepository)(_billingsubscriptionitementity.BillingSubscriptionItemEntity)),
    _ts_param(9, (0, _typeorm.InjectRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _stripesubscriptionservice.StripeSubscriptionService === "undefined" ? Object : _stripesubscriptionservice.StripeSubscriptionService,
        typeof _billingpriceservice.BillingPriceService === "undefined" ? Object : _billingpriceservice.BillingPriceService,
        typeof _billingplanservice.BillingPlanService === "undefined" ? Object : _billingplanservice.BillingPlanService,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _stripecustomerservice.StripeCustomerService === "undefined" ? Object : _stripecustomerservice.StripeCustomerService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _stripesubscriptionscheduleservice.StripeSubscriptionScheduleService === "undefined" ? Object : _stripesubscriptionscheduleservice.StripeSubscriptionScheduleService,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _meteredcreditservice.MeteredCreditService === "undefined" ? Object : _meteredcreditservice.MeteredCreditService,
        typeof _enterpriseplanservice.EnterprisePlanService === "undefined" ? Object : _enterpriseplanservice.EnterprisePlanService
    ])
], BillingSubscriptionService);

//# sourceMappingURL=billing-subscription.service.js.map