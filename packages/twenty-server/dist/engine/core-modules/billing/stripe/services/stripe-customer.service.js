/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StripeCustomerService", {
    enumerable: true,
    get: function() {
        return StripeCustomerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _billingcustomerentity = require("../../entities/billing-customer.entity");
const _stripesdkservice = require("../stripe-sdk/services/stripe-sdk.service");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
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
let StripeCustomerService = class StripeCustomerService {
    async updateCustomerMetadataWorkspaceId(stripeCustomerId, workspaceId) {
        await this.stripe.customers.update(stripeCustomerId, {
            metadata: {
                workspaceId: workspaceId
            }
        });
    }
    async hasPaymentMethod(stripeCustomerId) {
        const { data: paymentMethods } = await this.stripe.customers.listPaymentMethods(stripeCustomerId);
        return paymentMethods.length > 0;
    }
    async createStripeCustomer(userEmail, workspaceId, customerName) {
        const customer = await this.stripe.customers.create({
            name: customerName,
            email: userEmail,
            metadata: {
                workspaceId
            }
        });
        await this.billingCustomerRepository.save({
            stripeCustomerId: customer.id,
            workspaceId
        });
        return customer;
    }
    constructor(twentyConfigService, stripeSDKService, billingCustomerRepository){
        this.twentyConfigService = twentyConfigService;
        this.stripeSDKService = stripeSDKService;
        this.billingCustomerRepository = billingCustomerRepository;
        this.logger = new _common.Logger(StripeCustomerService.name);
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return;
        }
        this.stripe = this.stripeSDKService.getStripe(this.twentyConfigService.get('BILLING_STRIPE_API_KEY'));
    }
};
StripeCustomerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _typeorm.InjectRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _stripesdkservice.StripeSDKService === "undefined" ? Object : _stripesdkservice.StripeSDKService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], StripeCustomerService);

//# sourceMappingURL=stripe-customer.service.js.map