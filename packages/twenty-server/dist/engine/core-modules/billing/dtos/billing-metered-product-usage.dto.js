"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingMeteredProductUsageDTO", {
    enumerable: true,
    get: function() {
        return BillingMeteredProductUsageDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _billingproductkeyenum = require("../enums/billing-product-key.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BillingMeteredProductUsageDTO = class BillingMeteredProductUsageDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_billingproductkeyenum.BillingProductKey),
    _ts_metadata("design:type", typeof _billingproductkeyenum.BillingProductKey === "undefined" ? Object : _billingproductkeyenum.BillingProductKey)
], BillingMeteredProductUsageDTO.prototype, "productKey", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BillingMeteredProductUsageDTO.prototype, "periodStart", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Date),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], BillingMeteredProductUsageDTO.prototype, "periodEnd", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], BillingMeteredProductUsageDTO.prototype, "usedCredits", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], BillingMeteredProductUsageDTO.prototype, "grantedCredits", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], BillingMeteredProductUsageDTO.prototype, "rolloverCredits", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], BillingMeteredProductUsageDTO.prototype, "totalGrantedCredits", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Float),
    _ts_metadata("design:type", Number)
], BillingMeteredProductUsageDTO.prototype, "unitPriceCents", void 0);
BillingMeteredProductUsageDTO = _ts_decorate([
    (0, _graphql.ObjectType)('BillingMeteredProductUsage')
], BillingMeteredProductUsageDTO);

//# sourceMappingURL=billing-metered-product-usage.dto.js.map