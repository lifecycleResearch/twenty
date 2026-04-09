/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingRestApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return BillingRestApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _stripe = /*#__PURE__*/ _interop_require_default(require("stripe"));
const _billingexception = require("../billing.exception");
const _httpexceptionhandlerservice = require("../../exception-handler/http-exception-handler.service");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BillingRestApiExceptionFilter = class BillingRestApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof _stripe.default.errors.StripeError) {
            return this.httpExceptionHandlerService.handleError({
                code: _billingexception.BillingExceptionCode.BILLING_STRIPE_ERROR,
                message: exception.message,
                name: 'StripeError'
            }, response, 400);
        }
        switch(exception.code){
            case _billingexception.BillingExceptionCode.BILLING_CUSTOMER_NOT_FOUND:
            case _billingexception.BillingExceptionCode.BILLING_ACTIVE_SUBSCRIPTION_NOT_FOUND:
            case _billingexception.BillingExceptionCode.BILLING_PRODUCT_NOT_FOUND:
            case _billingexception.BillingExceptionCode.BILLING_PLAN_NOT_FOUND:
            case _billingexception.BillingExceptionCode.BILLING_METER_NOT_FOUND:
            case _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_ITEM_NOT_FOUND:
            case _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_FOUND:
                return this.httpExceptionHandlerService.handleError(exception, response, 404);
            case _billingexception.BillingExceptionCode.BILLING_METER_EVENT_FAILED:
            case _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_NOT_IN_TRIAL_PERIOD:
            case _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_INTERVAL_NOT_SWITCHABLE:
            case _billingexception.BillingExceptionCode.BILLING_SUBSCRIPTION_PLAN_NOT_SWITCHABLE:
            case _billingexception.BillingExceptionCode.BILLING_MISSING_REQUEST_BODY:
                return this.httpExceptionHandlerService.handleError(exception, response, 400);
            case _billingexception.BillingExceptionCode.BILLING_CREDITS_EXHAUSTED:
                return this.httpExceptionHandlerService.handleError(exception, response, 402);
            case _billingexception.BillingExceptionCode.BILLING_CUSTOMER_EVENT_WORKSPACE_NOT_FOUND:
            default:
                return this.httpExceptionHandlerService.handleError(exception, response, 500);
        }
    }
    constructor(httpExceptionHandlerService){
        this.httpExceptionHandlerService = httpExceptionHandlerService;
    }
};
BillingRestApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_billingexception.BillingException, _stripe.default.errors.StripeError),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _httpexceptionhandlerservice.HttpExceptionHandlerService === "undefined" ? Object : _httpexceptionhandlerservice.HttpExceptionHandlerService
    ])
], BillingRestApiExceptionFilter);

//# sourceMappingURL=billing-api-exception.filter.js.map