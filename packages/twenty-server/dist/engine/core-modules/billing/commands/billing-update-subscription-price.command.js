/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingUpdateSubscriptionPriceCommand", {
    enumerable: true,
    get: function() {
        return BillingUpdateSubscriptionPriceCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../../../database/commands/command-runners/active-or-suspended-workspaces-migration.command-runner");
const _billingsubscriptionentity = require("../entities/billing-subscription.entity");
const _billingsubscriptionservice = require("../services/billing-subscription.service");
const _stripesubscriptionitemservice = require("../stripe/services/stripe-subscription-item.service");
const _workspaceentity = require("../../workspace/workspace.entity");
const _datasourceservice = require("../../../metadata-modules/data-source/data-source.service");
const _globalworkspaceormmanager = require("../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
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
let BillingUpdateSubscriptionPriceCommand = class BillingUpdateSubscriptionPriceCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    parseStripePriceIdToMigrate(val) {
        this.stripePriceIdToUpdate = val;
        return val;
    }
    parseNewStripePriceId(val) {
        this.newStripePriceId = val;
        return val;
    }
    parseClearUsage() {
        this.clearUsage = true;
    }
    async runOnWorkspace({ workspaceId, options }) {
        const subscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId
        });
        const subscriptionItemToUpdate = subscription.billingSubscriptionItems.find((item)=>item.stripePriceId === this.stripePriceIdToUpdate);
        if (!(0, _utils.isDefined)(subscriptionItemToUpdate)) {
            this.logger.log(`No price to update for workspace ${workspaceId}`);
            return;
        }
        if (!options.dryRun) {
            await this.stripeSubscriptionItemService.deleteSubscriptionItem(subscriptionItemToUpdate.stripeSubscriptionItemId, this.clearUsage);
            await this.stripeSubscriptionItemService.createSubscriptionItem(subscription.stripeSubscriptionId, this.newStripePriceId, (0, _utils.isDefined)(subscriptionItemToUpdate.quantity) ? subscriptionItemToUpdate.quantity : undefined);
        }
        this.logger.log(`Update subscription replacing price ${subscriptionItemToUpdate.stripePriceId} by ${this.newStripePriceId} with clear usage ${this.clearUsage} - workspace ${workspaceId}`);
    }
    constructor(workspaceRepository, globalWorkspaceOrmManager, billingSubscriptionRepository, billingSubscriptionService, stripeSubscriptionItemService, dataSourceService){
        super(workspaceRepository, globalWorkspaceOrmManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.globalWorkspaceOrmManager = globalWorkspaceOrmManager, this.billingSubscriptionRepository = billingSubscriptionRepository, this.billingSubscriptionService = billingSubscriptionService, this.stripeSubscriptionItemService = stripeSubscriptionItemService, this.dataSourceService = dataSourceService, this.clearUsage = false;
    }
};
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--price-to-update-id [stripe_price_id]',
        description: 'Stripe price id to update',
        required: true
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", String)
], BillingUpdateSubscriptionPriceCommand.prototype, "parseStripePriceIdToMigrate", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--new-price-id [stripe_price_id]',
        description: 'New Stripe price id',
        required: true
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", String)
], BillingUpdateSubscriptionPriceCommand.prototype, "parseNewStripePriceId", null);
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--clear-usage',
        description: 'Clear usage on subscription item',
        required: false
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], BillingUpdateSubscriptionPriceCommand.prototype, "parseClearUsage", null);
BillingUpdateSubscriptionPriceCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'billing:update-subscription-price',
        description: 'Update subscription price'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _stripesubscriptionitemservice.StripeSubscriptionItemService === "undefined" ? Object : _stripesubscriptionitemservice.StripeSubscriptionItemService,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService
    ])
], BillingUpdateSubscriptionPriceCommand);

//# sourceMappingURL=billing-update-subscription-price.command.js.map