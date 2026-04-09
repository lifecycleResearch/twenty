/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingCreditRolloverService", {
    enumerable: true,
    get: function() {
        return BillingCreditRolloverService;
    }
});
const _common = require("@nestjs/common");
const _stripebillingmetereventservice = require("../stripe/services/stripe-billing-meter-event.service");
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
let BillingCreditRolloverService = class BillingCreditRolloverService {
    async processRolloverOnPeriodTransition({ stripeCustomerId, subscriptionId, stripeMeterId, previousPeriodStart, previousPeriodEnd, newPeriodEnd, tierQuantity, unitPriceCents }) {
        // Void any existing rollover grants before creating a new one
        // This ensures only one rollover grant is active at a time
        await this.voidExistingRolloverGrants(stripeCustomerId);
        const usedCredits = await this.stripeBillingMeterEventService.sumMeterEvents(stripeMeterId, stripeCustomerId, previousPeriodStart, previousPeriodEnd);
        const unusedCredits = Math.max(0, tierQuantity - usedCredits);
        if (unusedCredits <= 0) {
            return;
        }
        const rolloverAmount = Math.min(unusedCredits, tierQuantity);
        await this.stripeCreditGrantService.createCreditGrant({
            customerId: stripeCustomerId,
            creditUnits: rolloverAmount,
            unitPriceCents,
            expiresAt: newPeriodEnd,
            metadata: {
                type: 'rollover',
                fromPeriodStart: previousPeriodStart.toISOString(),
                fromPeriodEnd: previousPeriodEnd.toISOString(),
                subscriptionId
            }
        });
    }
    async voidExistingRolloverGrants(stripeCustomerId) {
        const existingGrants = await this.stripeCreditGrantService.listCreditGrants(stripeCustomerId);
        const rolloverGrants = existingGrants.filter((grant)=>grant.metadata?.type === 'rollover' && !grant.voided_at);
        if (rolloverGrants.length === 0) {
            return;
        }
        for (const grant of rolloverGrants){
            await this.stripeCreditGrantService.voidCreditGrant(grant.id);
        }
    }
    constructor(stripeCreditGrantService, stripeBillingMeterEventService){
        this.stripeCreditGrantService = stripeCreditGrantService;
        this.stripeBillingMeterEventService = stripeBillingMeterEventService;
    }
};
BillingCreditRolloverService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _stripecreditgrantservice.StripeCreditGrantService === "undefined" ? Object : _stripecreditgrantservice.StripeCreditGrantService,
        typeof _stripebillingmetereventservice.StripeBillingMeterEventService === "undefined" ? Object : _stripebillingmetereventservice.StripeBillingMeterEventService
    ])
], BillingCreditRolloverService);

//# sourceMappingURL=billing-credit-rollover.service.js.map