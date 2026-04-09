/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingPriceService", {
    enumerable: true,
    get: function() {
        return BillingPriceService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _billingexception = require("../billing.exception");
const _billingvalidate = require("../billing.validate");
const _billingpriceentity = require("../entities/billing-price.entity");
const _billingsubscriptionintervalenum = require("../enums/billing-subscription-interval.enum");
const _billingproductservice = require("./billing-product.service");
const _stripesubscriptionservice = require("../stripe/services/stripe-subscription.service");
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
let BillingPriceService = class BillingPriceService {
    async getBillingThresholdsByMeterPriceId(meterPriceId) {
        const price = await this.billingPriceRepository.findOneOrFail({
            where: {
                stripePriceId: meterPriceId
            },
            relations: [
                'billingProduct'
            ]
        });
        _billingvalidate.billingValidator.assertIsMeteredPrice(price);
        return this.stripeSubscriptionService.getBillingThresholds(price.tiers[0].flat_amount);
    }
    async findEquivalentMeteredPrice({ meteredPrice, targetInterval, targetPlanKey, hasSameInterval, hasSamePlanKey }) {
        if (hasSameInterval && hasSamePlanKey) {
            return meteredPrice;
        }
        const billingPricesPerPlanAndIntervalArray = await this.billingProductService.getProductPrices({
            interval: targetInterval,
            planKey: targetPlanKey
        });
        const targetMeteredPrice = await this.findMeteredMatchFloor(billingPricesPerPlanAndIntervalArray, meteredPrice, targetInterval !== meteredPrice.interval ? targetInterval : undefined);
        return targetMeteredPrice;
    }
    async findMeteredMatchFloor(catalog, reference, targetInterval) {
        const refCap = targetInterval ? this.scaleCap(reference.tiers[0].up_to, reference.interval, targetInterval) : reference.tiers[0].up_to;
        const candidates = this.filterMeteredCandidates(catalog, targetInterval);
        if (!candidates.length) {
            throw new _billingexception.BillingException('No metered candidates found for mapping', _billingexception.BillingExceptionCode.BILLING_PRICE_NOT_FOUND);
        }
        return candidates.filter((p)=>p.tiers[0].up_to <= refCap).pop() ?? candidates[0];
    }
    scaleCap(cap, from, to) {
        if (from === to) return cap;
        return from === _billingsubscriptionintervalenum.SubscriptionInterval.Month && to === _billingsubscriptionintervalenum.SubscriptionInterval.Year ? cap * 12 : cap / 12;
    }
    filterMeteredCandidates(catalog, interval) {
        const pool = interval ? catalog.filter((p)=>p.interval === interval) : catalog;
        return pool.filter((p)=>_billingvalidate.billingValidator.isMeteredPrice(p)).sort((a, b)=>a.tiers[0].up_to - b.tiers[0].up_to);
    }
    constructor(stripeSubscriptionService, billingPriceRepository, billingProductService){
        this.stripeSubscriptionService = stripeSubscriptionService;
        this.billingPriceRepository = billingPriceRepository;
        this.billingProductService = billingProductService;
        this.logger = new _common.Logger(BillingPriceService.name);
    }
};
BillingPriceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_billingpriceentity.BillingPriceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _stripesubscriptionservice.StripeSubscriptionService === "undefined" ? Object : _stripesubscriptionservice.StripeSubscriptionService,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _billingproductservice.BillingProductService === "undefined" ? Object : _billingproductservice.BillingProductService
    ])
], BillingPriceService);

//# sourceMappingURL=billing-price.service.js.map