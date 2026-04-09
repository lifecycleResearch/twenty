/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingWebhookCreditGrantService", {
    enumerable: true,
    get: function() {
        return BillingWebhookCreditGrantService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _billingsubscriptionservice = require("../../billing/services/billing-subscription.service");
const _meteredcreditservice = require("../../billing/services/metered-credit.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BillingWebhookCreditGrantService = class BillingWebhookCreditGrantService {
    async processStripeEvent(stripeCustomerId) {
        const subscription = await this.billingSubscriptionService.getCurrentBillingSubscription({
            stripeCustomerId
        });
        if (!(0, _utils.isDefined)(subscription)) {
            return;
        }
        await this.meteredCreditService.recreateBillingAlertForSubscription(subscription);
    }
    constructor(meteredCreditService, billingSubscriptionService){
        this.meteredCreditService = meteredCreditService;
        this.billingSubscriptionService = billingSubscriptionService;
    }
};
BillingWebhookCreditGrantService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _meteredcreditservice.MeteredCreditService === "undefined" ? Object : _meteredcreditservice.MeteredCreditService,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService
    ])
], BillingWebhookCreditGrantService);

//# sourceMappingURL=billing-webhook-credit-grant.service.js.map