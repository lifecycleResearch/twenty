/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingSyncCustomerDataCommand", {
    enumerable: true,
    get: function() {
        return BillingSyncCustomerDataCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _chalk = /*#__PURE__*/ _interop_require_default(require("chalk"));
const _nestcommander = require("nest-commander");
const _typeorm1 = require("typeorm");
const _activeorsuspendedworkspacesmigrationcommandrunner = require("../../../../database/commands/command-runners/active-or-suspended-workspaces-migration.command-runner");
const _billingcustomerentity = require("../entities/billing-customer.entity");
const _stripesubscriptionservice = require("../stripe/services/stripe-subscription.service");
const _workspaceentity = require("../../workspace/workspace.entity");
const _datasourceservice = require("../../../metadata-modules/data-source/data-source.service");
const _globalworkspaceormmanager = require("../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
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
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let BillingSyncCustomerDataCommand = class BillingSyncCustomerDataCommand extends _activeorsuspendedworkspacesmigrationcommandrunner.ActiveOrSuspendedWorkspacesMigrationCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const billingCustomer = await this.billingCustomerRepository.findOne({
            where: {
                workspaceId
            }
        });
        if (!options.dryRun && !billingCustomer) {
            const stripeCustomerId = await this.stripeSubscriptionService.getStripeCustomerIdFromWorkspaceId(workspaceId);
            if (typeof stripeCustomerId === 'string') {
                await this.billingCustomerRepository.upsert({
                    stripeCustomerId,
                    workspaceId
                }, {
                    conflictPaths: [
                        'workspaceId'
                    ]
                });
            }
        }
        if (options.verbose) {
            this.logger.log(_chalk.default.yellow(`Added ${workspaceId} to billingCustomer table`));
        }
    }
    constructor(workspaceRepository, stripeSubscriptionService, billingCustomerRepository, globalWorkspaceOrmManager, dataSourceService){
        super(workspaceRepository, globalWorkspaceOrmManager, dataSourceService), this.workspaceRepository = workspaceRepository, this.stripeSubscriptionService = stripeSubscriptionService, this.billingCustomerRepository = billingCustomerRepository, this.globalWorkspaceOrmManager = globalWorkspaceOrmManager, this.dataSourceService = dataSourceService;
    }
};
BillingSyncCustomerDataCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'billing:sync-customer-data',
        description: 'Sync customer data from Stripe for all active workspaces'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_billingcustomerentity.BillingCustomerEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _stripesubscriptionservice.StripeSubscriptionService === "undefined" ? Object : _stripesubscriptionservice.StripeSubscriptionService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService
    ])
], BillingSyncCustomerDataCommand);

//# sourceMappingURL=billing-sync-customer-data.command.js.map