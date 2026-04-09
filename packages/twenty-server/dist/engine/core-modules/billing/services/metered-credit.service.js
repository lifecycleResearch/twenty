/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MeteredCreditService", {
    enumerable: true,
    get: function() {
        return MeteredCreditService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _billingvalidate = require("../billing.validate");
const _billingpriceentity = require("../entities/billing-price.entity");
const _billingsubscriptionentity = require("../entities/billing-subscription.entity");
const _billingproductkeyenum = require("../enums/billing-product-key.enum");
const _billingsubscriptionitemservice = require("./billing-subscription-item.service");
const _stripebillingalertservice = require("../stripe/services/stripe-billing-alert.service");
const _stripecreditgrantservice = require("../stripe/services/stripe-credit-grant.service");
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
let MeteredCreditService = class MeteredCreditService {
    /**
   * Get metered pricing info for a subscription by looking up the metered subscription item
   * and extracting tier cap and unit price from the associated price.
   */ async getMeteredPricingInfo(subscriptionId) {
        const subscription = await this.billingSubscriptionRepository.findOne({
            where: {
                id: subscriptionId
            },
            relations: [
                'billingSubscriptionItems',
                'billingSubscriptionItems.billingProduct',
                'billingSubscriptionItems.billingProduct.billingPrices'
            ]
        });
        if (!(0, _utils.isDefined)(subscription)) {
            return null;
        }
        const meteredItem = subscription.billingSubscriptionItems.find((item)=>item.billingProduct.metadata.productKey === _billingproductkeyenum.BillingProductKey.WORKFLOW_NODE_EXECUTION);
        if (!(0, _utils.isDefined)(meteredItem)) {
            return null;
        }
        const matchingPrice = meteredItem.billingProduct.billingPrices.find((price)=>price.stripePriceId === meteredItem.stripePriceId);
        if (!(0, _utils.isDefined)(matchingPrice)) {
            return null;
        }
        if (!_billingvalidate.billingValidator.isMeteredTiersSchema(matchingPrice.tiers)) {
            return null;
        }
        return {
            tierCap: matchingPrice.tiers[0].up_to,
            unitPriceCents: Number(matchingPrice.tiers[1].unit_amount_decimal),
            stripeMeterId: matchingPrice.stripeMeterId ?? undefined
        };
    }
    /**
   * Get metered pricing info directly from a price ID.
   */ async getMeteredPricingInfoFromPriceId(priceId) {
        const price = await this.billingPriceRepository.findOneOrFail({
            where: {
                stripePriceId: priceId
            }
        });
        _billingvalidate.billingValidator.assertIsMeteredTiersSchemaOrThrow(price.tiers);
        return {
            tierCap: price.tiers[0].up_to,
            unitPriceCents: Number(price.tiers[1].unit_amount_decimal),
            stripeMeterId: price.stripeMeterId ?? undefined
        };
    }
    /**
   * Get metered rollover parameters for a subscription.
   * Returns null if no metered item is found.
   */ async getMeteredRolloverParameters(subscriptionId) {
        const meteredDetails = await this.billingSubscriptionItemService.getMeteredSubscriptionItemDetails(subscriptionId);
        const meteredItem = meteredDetails.find((item)=>item.productKey === _billingproductkeyenum.BillingProductKey.WORKFLOW_NODE_EXECUTION);
        if (!meteredItem) {
            return null;
        }
        return {
            stripeMeterId: meteredItem.stripeMeterId,
            tierQuantity: meteredItem.tierQuantity,
            unitPriceCents: meteredItem.unitPriceCents
        };
    }
    /**
   * Recreate billing alert for a subscription. This archives existing alerts and creates
   * a new one with the correct threshold based on current pricing and credit balance.
   */ async recreateBillingAlertForSubscription(subscription, periodStart) {
        const meteredPricingInfo = await this.getMeteredPricingInfo(subscription.id);
        if (!(0, _utils.isDefined)(meteredPricingInfo)) {
            this.logger.warn(`Cannot create billing alert: metered pricing info not found for subscription ${subscription.id}`);
            return;
        }
        const creditBalance = await this.stripeCreditGrantService.getCustomerCreditBalance(subscription.stripeCustomerId, meteredPricingInfo.unitPriceCents);
        // Use the subscription's current period start if not provided
        const effectivePeriodStart = periodStart ?? subscription.currentPeriodStart;
        await this.stripeBillingAlertService.createUsageThresholdAlertForCustomerMeter(subscription.stripeCustomerId, meteredPricingInfo.tierCap, creditBalance, effectivePeriodStart);
    }
    /**
   * Get credit balance for a customer in credit units (not monetary).
   */ async getCreditBalance(stripeCustomerId, unitPriceCents) {
        return this.stripeCreditGrantService.getCustomerCreditBalance(stripeCustomerId, unitPriceCents);
    }
    constructor(billingSubscriptionRepository, billingPriceRepository, billingSubscriptionItemService, stripeBillingAlertService, stripeCreditGrantService){
        this.billingSubscriptionRepository = billingSubscriptionRepository;
        this.billingPriceRepository = billingPriceRepository;
        this.billingSubscriptionItemService = billingSubscriptionItemService;
        this.stripeBillingAlertService = stripeBillingAlertService;
        this.stripeCreditGrantService = stripeCreditGrantService;
        this.logger = new _common.Logger(MeteredCreditService.name);
    }
};
MeteredCreditService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_param(1, (0, _typeorm.InjectRepository)(_billingpriceentity.BillingPriceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _billingsubscriptionitemservice.BillingSubscriptionItemService === "undefined" ? Object : _billingsubscriptionitemservice.BillingSubscriptionItemService,
        typeof _stripebillingalertservice.StripeBillingAlertService === "undefined" ? Object : _stripebillingalertservice.StripeBillingAlertService,
        typeof _stripecreditgrantservice.StripeCreditGrantService === "undefined" ? Object : _stripecreditgrantservice.StripeCreditGrantService
    ])
], MeteredCreditService);

//# sourceMappingURL=metered-credit.service.js.map