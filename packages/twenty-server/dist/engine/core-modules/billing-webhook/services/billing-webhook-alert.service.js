/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingWebhookAlertService", {
    enumerable: true,
    get: function() {
        return BillingWebhookAlertService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _billingexception = require("../../billing/billing.exception");
const _billingproductentity = require("../../billing/entities/billing-product.entity");
const _billingsubscriptionitementity = require("../../billing/entities/billing-subscription-item.entity");
const _billingsubscriptionservice = require("../../billing/services/billing-subscription.service");
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
let BillingWebhookAlertService = class BillingWebhookAlertService {
    async processStripeEvent(data) {
        const { customer: stripeCustomerId, alert } = data.object;
        const stripeMeterId = alert.usage_threshold?.meter;
        (0, _utils.assertIsDefinedOrThrow)(stripeMeterId);
        const subscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            stripeCustomerId
        });
        const product = await this.billingProductRepository.findOne({
            where: {
                billingPrices: {
                    stripeMeterId: typeof stripeMeterId === 'string' ? stripeMeterId : stripeMeterId.id
                }
            }
        });
        if (!product) {
            throw new _billingexception.BillingException(`Product associated to meter ${stripeMeterId} not found`, _billingexception.BillingExceptionCode.BILLING_PRODUCT_NOT_FOUND);
        }
        await this.billingSubscriptionItemRepository.update({
            billingSubscriptionId: subscription.id,
            stripeProductId: product.stripeProductId
        }, {
            hasReachedCurrentPeriodCap: true
        });
    }
    constructor(billingSubscriptionService, billingProductRepository, billingSubscriptionItemRepository){
        this.billingSubscriptionService = billingSubscriptionService;
        this.billingProductRepository = billingProductRepository;
        this.billingSubscriptionItemRepository = billingSubscriptionItemRepository;
        this.logger = new _common.Logger(BillingWebhookAlertService.name);
    }
};
BillingWebhookAlertService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_billingproductentity.BillingProductEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_billingsubscriptionitementity.BillingSubscriptionItemEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], BillingWebhookAlertService);

//# sourceMappingURL=billing-webhook-alert.service.js.map