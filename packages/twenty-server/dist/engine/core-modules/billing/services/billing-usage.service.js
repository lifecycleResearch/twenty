/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingUsageService", {
    enumerable: true,
    get: function() {
        return BillingUsageService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _billingexception = require("../billing.exception");
const _billingcustomerentity = require("../entities/billing-customer.entity");
const _billingsubscriptionstatusenum = require("../enums/billing-subscription-status.enum");
const _billingsubscriptionitemservice = require("./billing-subscription-item.service");
const _billingsubscriptionservice = require("./billing-subscription.service");
const _stripebillingmetereventservice = require("../stripe/services/stripe-billing-meter-event.service");
const _stripecreditgrantservice = require("../stripe/services/stripe-credit-grant.service");
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
let BillingUsageService = class BillingUsageService {
    async canFeatureBeUsed(workspaceId) {
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return true;
        }
        const billingSubscription = await this.billingSubscriptionService.getCurrentBillingSubscription({
            workspaceId
        });
        return !!billingSubscription;
    }
    async billUsage({ workspaceId, usageEvents }) {
        const workspaceStripeCustomer = await this.billingCustomerRepository.findOne({
            where: {
                workspaceId
            }
        });
        if (!workspaceStripeCustomer) {
            throw new _billingexception.BillingException('Stripe customer not found', _billingexception.BillingExceptionCode.BILLING_CUSTOMER_NOT_FOUND);
        }
        try {
            await Promise.all(usageEvents.map((usageEvent)=>this.stripeBillingMeterEventService.sendBillingMeterEvent({
                    usageEvent,
                    stripeCustomerId: workspaceStripeCustomer.stripeCustomerId
                })));
        } catch (error) {
            throw new _billingexception.BillingException(`Failed to send billing meter events to Stripe: ${error}`, _billingexception.BillingExceptionCode.BILLING_METER_EVENT_FAILED);
        }
    }
    async getMeteredProductsUsage(workspace) {
        const subscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId: workspace.id
        });
        const meteredSubscriptionItemDetails = await this.billingSubscriptionItemService.getMeteredSubscriptionItemDetails(subscription.id);
        const { periodStart, periodEnd } = this.getSubscriptionPeriod(subscription);
        return Promise.all(meteredSubscriptionItemDetails.map((item)=>this.buildMeteredProductUsage(subscription, item, periodStart, periodEnd)));
    }
    getSubscriptionPeriod(subscription) {
        const isTrialing = subscription.status === _billingsubscriptionstatusenum.SubscriptionStatus.Trialing && (0, _utils.isDefined)(subscription.trialStart) && (0, _utils.isDefined)(subscription.trialEnd);
        if (isTrialing) {
            return {
                periodStart: subscription.trialStart,
                periodEnd: subscription.trialEnd
            };
        }
        return {
            periodStart: subscription.currentPeriodStart,
            periodEnd: subscription.currentPeriodEnd
        };
    }
    async buildMeteredProductUsage(subscription, item, periodStart, periodEnd) {
        const meterEventsSum = await this.stripeBillingMeterEventService.sumMeterEvents(item.stripeMeterId, subscription.stripeCustomerId, periodStart, periodEnd);
        const grantedCredits = subscription.status === _billingsubscriptionstatusenum.SubscriptionStatus.Trialing ? item.freeTrialQuantity : item.tierQuantity;
        const rolloverCredits = await this.stripeCreditGrantService.getCustomerCreditBalance(subscription.stripeCustomerId, item.unitPriceCents);
        return {
            productKey: item.productKey,
            periodStart,
            periodEnd,
            usedCredits: meterEventsSum,
            grantedCredits,
            rolloverCredits,
            totalGrantedCredits: grantedCredits + rolloverCredits,
            unitPriceCents: item.unitPriceCents
        };
    }
    constructor(billingCustomerRepository, billingSubscriptionService, stripeBillingMeterEventService, twentyConfigService, billingSubscriptionItemService, stripeCreditGrantService){
        this.billingCustomerRepository = billingCustomerRepository;
        this.billingSubscriptionService = billingSubscriptionService;
        this.stripeBillingMeterEventService = stripeBillingMeterEventService;
        this.twentyConfigService = twentyConfigService;
        this.billingSubscriptionItemService = billingSubscriptionItemService;
        this.stripeCreditGrantService = stripeCreditGrantService;
        this.logger = new _common.Logger(BillingUsageService.name);
    }
};
BillingUsageService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _stripebillingmetereventservice.StripeBillingMeterEventService === "undefined" ? Object : _stripebillingmetereventservice.StripeBillingMeterEventService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _billingsubscriptionitemservice.BillingSubscriptionItemService === "undefined" ? Object : _billingsubscriptionitemservice.BillingSubscriptionItemService,
        typeof _stripecreditgrantservice.StripeCreditGrantService === "undefined" ? Object : _stripecreditgrantservice.StripeCreditGrantService
    ])
], BillingUsageService);

//# sourceMappingURL=billing-usage.service.js.map