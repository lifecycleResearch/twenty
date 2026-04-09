/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingUsageEventListener", {
    enumerable: true,
    get: function() {
        return BillingUsageEventListener;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _oncustombatcheventdecorator = require("../../../api/graphql/graphql-query-runner/decorators/on-custom-batch-event.decorator");
const _usagerecordedconstant = require("../../usage/constants/usage-recorded.constant");
const _billingusageservice = require("../services/billing-usage.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _customworkspacebatcheventtype = require("../../../workspace-event-emitter/types/custom-workspace-batch-event.type");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BillingUsageEventListener = class BillingUsageEventListener {
    async handleUsageRecordedEvent(payload) {
        if (!(0, _utils.isDefined)(payload.workspaceId)) {
            return;
        }
        if (!this.twentyConfigService.get('IS_BILLING_ENABLED')) {
            return;
        }
        const canFeatureBeUsed = await this.billingUsageService.canFeatureBeUsed(payload.workspaceId);
        if (!canFeatureBeUsed) {
            return;
        }
        await this.billingUsageService.billUsage({
            workspaceId: payload.workspaceId,
            usageEvents: payload.events
        });
    }
    constructor(billingUsageService, twentyConfigService){
        this.billingUsageService = billingUsageService;
        this.twentyConfigService = twentyConfigService;
    }
};
_ts_decorate([
    (0, _oncustombatcheventdecorator.OnCustomBatchEvent)(_usagerecordedconstant.USAGE_RECORDED),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _customworkspacebatcheventtype.CustomWorkspaceEventBatch === "undefined" ? Object : _customworkspacebatcheventtype.CustomWorkspaceEventBatch
    ]),
    _ts_metadata("design:returntype", Promise)
], BillingUsageEventListener.prototype, "handleUsageRecordedEvent", null);
BillingUsageEventListener = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingusageservice.BillingUsageService === "undefined" ? Object : _billingusageservice.BillingUsageService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], BillingUsageEventListener);

//# sourceMappingURL=billing-usage-event.listener.js.map