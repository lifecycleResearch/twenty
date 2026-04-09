"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StripeBillingAlertService", {
    enumerable: true,
    get: function() {
        return StripeBillingAlertService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _stripebillingmetereventnameconstant = require("../constants/stripe-billing-meter-event-name.constant");
const _stripebillingmetereventservice = require("./stripe-billing-meter-event.service");
const _stripebillingmeterservice = require("./stripe-billing-meter.service");
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
let StripeBillingAlertService = class StripeBillingAlertService {
    async createUsageThresholdAlertForCustomerMeter(customerId, tierCap, creditBalance = 0, periodStart) {
        const meter = (await this.stripeBillingMeterService.getAllMeters()).find((meterItem)=>{
            return meterItem.event_name === _stripebillingmetereventnameconstant.STRIPE_BILLING_METER_EVENT_NAME;
        });
        (0, _utils.assertIsDefinedOrThrow)(meter);
        await this.archiveAlertsForCustomer(customerId, meter.id);
        // Use cumulative usage at period start to ensure consistent threshold
        // regardless of when the alert is created/recreated during the period
        const usageAtPeriodStart = periodStart ? await this.stripeBillingMeterEventService.getCumulativeUsageAtTime(meter.id, customerId, periodStart) : await this.stripeBillingMeterEventService.getTotalCumulativeUsage(meter.id, customerId);
        // Threshold = usage at period start + allowance for this period
        const dynamicThreshold = usageAtPeriodStart + tierCap + creditBalance;
        await this.stripe.billing.alerts.create({
            alert_type: 'usage_threshold',
            title: `Usage cap for customer ${customerId}`,
            usage_threshold: {
                gte: dynamicThreshold,
                meter: meter.id,
                recurrence: 'one_time',
                filters: [
                    {
                        type: 'customer',
                        customer: customerId
                    }
                ]
            }
        });
    }
    async archiveAlertsForCustomer(customerId, meterId) {
        const alerts = await this.stripe.billing.alerts.list({
            meter: meterId
        });
        const customerAlerts = alerts.data.filter((alert)=>alert.status === 'active' && alert.usage_threshold?.filters?.some((filter)=>filter.type === 'customer' && filter.customer === customerId));
        for (const alert of customerAlerts){
            await this.stripe.billing.alerts.archive(alert.id);
        }
    }
    constructor(twentyConfigService, stripeSDKService, stripeBillingMeterService, stripeBillingMeterEventService){
        this.twentyConfigService = twentyConfigService;
        this.stripeSDKService = stripeSDKService;
        this.stripeBillingMeterService = stripeBillingMeterService;
        this.stripeBillingMeterEventService = stripeBillingMeterEventService;
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return;
        }
        this.stripe = this.stripeSDKService.getStripe(this.twentyConfigService.get('BILLING_STRIPE_API_KEY'));
    }
};
StripeBillingAlertService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _stripesdkservice.StripeSDKService === "undefined" ? Object : _stripesdkservice.StripeSDKService,
        typeof _stripebillingmeterservice.StripeBillingMeterService === "undefined" ? Object : _stripebillingmeterservice.StripeBillingMeterService,
        typeof _stripebillingmetereventservice.StripeBillingMeterEventService === "undefined" ? Object : _stripebillingmetereventservice.StripeBillingMeterEventService
    ])
], StripeBillingAlertService);

//# sourceMappingURL=stripe-billing-alert.service.js.map