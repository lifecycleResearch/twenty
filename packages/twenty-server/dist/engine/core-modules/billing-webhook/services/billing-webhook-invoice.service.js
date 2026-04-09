"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingWebhookInvoiceService", {
    enumerable: true,
    get: function() {
        return BillingWebhookInvoiceService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _datefns = require("date-fns");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _getsubscriptionidfrominvoiceutil = require("../utils/get-subscription-id-from-invoice.util");
const _billingexception = require("../../billing/billing.exception");
const _billingcustomerentity = require("../../billing/entities/billing-customer.entity");
const _billingsubscriptionitementity = require("../../billing/entities/billing-subscription-item.entity");
const _billingsubscriptionintervalenum = require("../../billing/enums/billing-subscription-interval.enum");
const _billingwebhookeventsenum = require("../../billing/enums/billing-webhook-events.enum");
const _billingcreditrolloverservice = require("../../billing/services/billing-credit-rollover.service");
const _billingsubscriptionservice = require("../../billing/services/billing-subscription.service");
const _meteredcreditservice = require("../../billing/services/metered-credit.service");
const _stripeinvoiceservice = require("../../billing/stripe/services/stripe-invoice.service");
const _workspaceentity = require("../../workspace/workspace.entity");
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
const SUBSCRIPTION_CYCLE_BILLING_REASON = 'subscription_cycle';
let BillingWebhookInvoiceService = class BillingWebhookInvoiceService {
    async processStripeEvent(event) {
        if (event.type === _billingwebhookeventsenum.BillingWebhookEvent.INVOICE_PAID) {
            return this.processInvoicePaid(event.data);
        }
        if (event.type === _billingwebhookeventsenum.BillingWebhookEvent.INVOICE_FINALIZED) {
            return this.processInvoiceFinalized(event.data);
        }
    }
    async processInvoiceFinalized(data) {
        const { billing_reason: billingReason, customer, period_start: periodStart, period_end: periodEnd } = data.object;
        const stripeSubscriptionId = (0, _getsubscriptionidfrominvoiceutil.getSubscriptionIdFromInvoice)(data.object);
        const stripeCustomerId = customer;
        if (!(0, _utils.isDefined)(stripeSubscriptionId) || billingReason !== SUBSCRIPTION_CYCLE_BILLING_REASON) {
            return;
        }
        await this.billingSubscriptionItemRepository.update({
            stripeSubscriptionId
        }, {
            hasReachedCurrentPeriodCap: false
        });
        if (!(0, _utils.isDefined)(stripeCustomerId) || !periodEnd) {
            return;
        }
        const subscription = await this.billingSubscriptionService.getCurrentBillingSubscription({
            stripeCustomerId
        });
        if (!(0, _utils.isDefined)(subscription)) {
            return;
        }
        if (periodStart) {
            await this.processRollover(subscription, new Date(periodStart * 1000), new Date(periodEnd * 1000));
        }
        // Pass the new period start (which is the invoiced period's end) for alert threshold calculation
        await this.meteredCreditService.recreateBillingAlertForSubscription(subscription, new Date(periodEnd * 1000));
    }
    async processRollover(subscription, invoicedPeriodStart, invoicedPeriodEnd) {
        const rolloverParams = await this.meteredCreditService.getMeteredRolloverParameters(subscription.id);
        if (!(0, _utils.isDefined)(rolloverParams)) {
            return;
        }
        // The invoice covers the period that just ended (invoicedPeriodStart to invoicedPeriodEnd)
        // We need to calculate unused credits from this period and roll them over
        // Credits should expire at the end of the NEXT period
        const nextPeriodEnd = this.calculateNextPeriodEnd(invoicedPeriodEnd, subscription.interval);
        await this.billingCreditRolloverService.processRolloverOnPeriodTransition({
            stripeCustomerId: subscription.stripeCustomerId,
            subscriptionId: subscription.id,
            stripeMeterId: rolloverParams.stripeMeterId,
            previousPeriodStart: invoicedPeriodStart,
            previousPeriodEnd: invoicedPeriodEnd,
            newPeriodEnd: nextPeriodEnd,
            tierQuantity: rolloverParams.tierQuantity,
            unitPriceCents: rolloverParams.unitPriceCents
        });
    }
    async processInvoicePaid(data) {
        const stripeSubscriptionId = (0, _getsubscriptionidfrominvoiceutil.getSubscriptionIdFromInvoice)(data.object);
        const stripeCustomerId = data.object.customer;
        const paidInvoicePeriodEnd = data.object.period_end;
        if (!(0, _utils.isDefined)(stripeSubscriptionId) || !(0, _utils.isDefined)(stripeCustomerId) || !(0, _utils.isDefined)(paidInvoicePeriodEnd)) {
            throw new _billingexception.BillingException('Invalid invoice paid event data', _billingexception.BillingExceptionCode.BILLING_STRIPE_ERROR);
        }
        // Paying a past-due invoice won't reactivate the subscription if Stripe
        // already generated a draft for the next period. Finalize it so Stripe
        // can collect payment and resume the subscription.
        await this.finalizePastDueDraftInvoicesAfterPaidInvoice(stripeSubscriptionId, paidInvoicePeriodEnd);
        await this.delaySuspendedWorkspaceCleanup(stripeCustomerId);
        return {
            stripeSubscriptionId
        };
    }
    async finalizePastDueDraftInvoicesAfterPaidInvoice(stripeSubscriptionId, paidInvoicePeriodEnd) {
        const draftInvoices = await this.stripeInvoiceService.listDraftInvoices(stripeSubscriptionId);
        const nowInSeconds = Date.now() / 1000;
        const pastDueDraftInvoices = draftInvoices.filter((invoice)=>(0, _utils.isDefined)(invoice.period_end) && invoice.period_end > paidInvoicePeriodEnd && invoice.period_end < nowInSeconds);
        for (const invoice of pastDueDraftInvoices){
            try {
                await this.stripeInvoiceService.finalizeInvoice(invoice.id);
            } catch (error) {
                throw new _billingexception.BillingException(`Failed to finalize draft invoice ${invoice.id}: ${error.message}`, _billingexception.BillingExceptionCode.BILLING_STRIPE_ERROR);
            }
        }
    }
    async delaySuspendedWorkspaceCleanup(stripeCustomerId) {
        const billingCustomer = await this.billingCustomerRepository.findOne({
            where: {
                stripeCustomerId
            }
        });
        if (!(0, _utils.isDefined)(billingCustomer)) {
            return;
        }
        const workspace = await this.workspaceRepository.findOne({
            where: {
                id: billingCustomer.workspaceId,
                activationStatus: _workspace.WorkspaceActivationStatus.SUSPENDED
            }
        });
        if (!(0, _utils.isDefined)(workspace)) {
            return;
        }
        await this.workspaceRepository.update(workspace.id, {
            suspendedAt: new Date()
        });
    }
    calculateNextPeriodEnd(periodEnd, interval) {
        if (interval === _billingsubscriptionintervalenum.SubscriptionInterval.Year) {
            return (0, _datefns.addYears)(periodEnd, 1);
        }
        return (0, _datefns.addMonths)(periodEnd, 1);
    }
    constructor(billingSubscriptionItemRepository, billingCustomerRepository, workspaceRepository, billingSubscriptionService, billingCreditRolloverService, meteredCreditService, stripeInvoiceService){
        this.billingSubscriptionItemRepository = billingSubscriptionItemRepository;
        this.billingCustomerRepository = billingCustomerRepository;
        this.workspaceRepository = workspaceRepository;
        this.billingSubscriptionService = billingSubscriptionService;
        this.billingCreditRolloverService = billingCreditRolloverService;
        this.meteredCreditService = meteredCreditService;
        this.stripeInvoiceService = stripeInvoiceService;
        this.logger = new _common.Logger(BillingWebhookInvoiceService.name);
    }
};
BillingWebhookInvoiceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_billingsubscriptionitementity.BillingSubscriptionItemEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _billingcreditrolloverservice.BillingCreditRolloverService === "undefined" ? Object : _billingcreditrolloverservice.BillingCreditRolloverService,
        typeof _meteredcreditservice.MeteredCreditService === "undefined" ? Object : _meteredcreditservice.MeteredCreditService,
        typeof _stripeinvoiceservice.StripeInvoiceService === "undefined" ? Object : _stripeinvoiceservice.StripeInvoiceService
    ])
], BillingWebhookInvoiceService);

//# sourceMappingURL=billing-webhook-invoice.service.js.map