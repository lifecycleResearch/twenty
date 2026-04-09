/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingService", {
    enumerable: true,
    get: function() {
        return BillingService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _billingsubscriptionentity = require("../entities/billing-subscription.entity");
const _billingsubscriptionstatusenum = require("../enums/billing-subscription-status.enum");
const _billingproductservice = require("./billing-product.service");
const _billingsubscriptionservice = require("./billing-subscription.service");
const _getplankeyfromsubscriptionutil = require("../utils/get-plan-key-from-subscription.util");
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
let BillingService = class BillingService {
    isBillingEnabled() {
        return this.twentyConfigService.get('IS_BILLING_ENABLED');
    }
    async hasWorkspaceAnySubscription(workspaceId) {
        const isBillingEnabled = this.isBillingEnabled();
        if (!isBillingEnabled) {
            return true;
        }
        const subscription = await this.billingSubscriptionRepository.findOne({
            where: {
                workspaceId
            }
        });
        return (0, _utils.isDefined)(subscription);
    }
    async hasEntitlement(workspaceId, entitlementKey) {
        const isBillingEnabled = this.isBillingEnabled();
        if (!isBillingEnabled) {
            return true;
        }
        return this.billingSubscriptionService.getWorkspaceEntitlementByKey(workspaceId, entitlementKey);
    }
    async isSubscriptionIncompleteOnboardingStatus(workspaceId) {
        const hasAnySubscription = await this.hasWorkspaceAnySubscription(workspaceId);
        return !hasAnySubscription;
    }
    async canBillMeteredProduct(workspaceId, productKey) {
        const subscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId
        });
        const billableStatuses = [
            _billingsubscriptionstatusenum.SubscriptionStatus.Active,
            _billingsubscriptionstatusenum.SubscriptionStatus.Trialing
        ];
        if (!billableStatuses.includes(subscription.status)) {
            return false;
        }
        const planKey = (0, _getplankeyfromsubscriptionutil.getPlanKeyFromSubscription)(subscription);
        const products = await this.billingProductService.getProductsByPlan(planKey);
        const targetProduct = products.find(({ metadata })=>metadata.productKey === productKey);
        if (!targetProduct) {
            return false;
        }
        const subscriptionItem = subscription.billingSubscriptionItems.find((item)=>item.stripeProductId === targetProduct.stripeProductId);
        return subscriptionItem?.hasReachedCurrentPeriodCap === false;
    }
    constructor(twentyConfigService, billingSubscriptionService, billingProductService, billingSubscriptionRepository){
        this.twentyConfigService = twentyConfigService;
        this.billingSubscriptionService = billingSubscriptionService;
        this.billingProductService = billingProductService;
        this.billingSubscriptionRepository = billingSubscriptionRepository;
        this.logger = new _common.Logger(BillingService.name);
    }
};
BillingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _billingproductservice.BillingProductService === "undefined" ? Object : _billingproductservice.BillingProductService,
        typeof Repository === "undefined" ? Object : Repository
    ])
], BillingService);

//# sourceMappingURL=billing.service.js.map