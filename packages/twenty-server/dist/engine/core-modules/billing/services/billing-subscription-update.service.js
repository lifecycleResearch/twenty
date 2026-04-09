/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingSubscriptionUpdateService", {
    enumerable: true,
    get: function() {
        return BillingSubscriptionUpdateService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _billingvalidate = require("../billing.validate");
const _billingpriceentity = require("../entities/billing-price.entity");
const _billingsubscriptionitementity = require("../entities/billing-subscription-item.entity");
const _billingsubscriptionentity = require("../entities/billing-subscription.entity");
const _billingplankeyenum = require("../enums/billing-plan-key.enum");
const _billingproductkeyenum = require("../enums/billing-product-key.enum");
const _billingsubscriptionintervalenum = require("../enums/billing-subscription-interval.enum");
const _billingpriceservice = require("./billing-price.service");
const _billingproductservice = require("./billing-product.service");
const _billingsubscriptionphaseservice = require("./billing-subscription-phase.service");
const _billingsubscriptionservice = require("./billing-subscription.service");
const _meteredcreditservice = require("./metered-credit.service");
const _stripebillingalertservice = require("../stripe/services/stripe-billing-alert.service");
const _stripesubscriptionscheduleservice = require("../stripe/services/stripe-subscription-schedule.service");
const _stripesubscriptionservice = require("../stripe/services/stripe-subscription.service");
const _billingsubscriptionupdatetype = require("../types/billing-subscription-update.type");
const _computesubscriptionupdateoptionsutil = require("../utils/compute-subscription-update-options.util");
const _getlicensedbillingsubscriptionitemorthrowutil = require("../utils/get-licensed-billing-subscription-item-or-throw.util");
const _getmeteredbillingsubscriptionitemorthrowutil = require("../utils/get-metered-billing-subscription-item-or-throw.util");
const _getsubscriptionpricesfromschedulephaseutil = require("../utils/get-subscription-prices-from-schedule-phase.util");
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
let BillingSubscriptionUpdateService = class BillingSubscriptionUpdateService {
    async changeMeteredPrice(workspaceId, meteredPriceId) {
        const billingSubscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId
        });
        const subscriptionUpdate = {
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.METERED_PRICE,
            newMeteredPriceId: meteredPriceId
        };
        await this.updateSubscription(billingSubscription.id, subscriptionUpdate);
    }
    async cancelSwitchMeteredPrice(workspace) {
        const billingSubscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId: workspace.id
        });
        const currentMeteredPrice = (0, _getmeteredbillingsubscriptionitemorthrowutil.getCurrentMeteredBillingSubscriptionItemOrThrow)(billingSubscription);
        await this.updateSubscription(billingSubscription.id, {
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.METERED_PRICE,
            newMeteredPriceId: currentMeteredPrice.stripePriceId
        });
    }
    async cancelSwitchPlan(workspaceId) {
        const billingSubscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId
        });
        const currentPlan = (0, _getlicensedbillingsubscriptionitemorthrowutil.getCurrentLicensedBillingSubscriptionItemOrThrow)(billingSubscription).billingProduct?.metadata.planKey;
        await this.updateSubscription(billingSubscription.id, {
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.PLAN,
            newPlan: currentPlan
        });
    }
    async cancelSwitchInterval(workspaceId) {
        const billingSubscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId
        });
        const currentInterval = billingSubscription.interval;
        await this.updateSubscription(billingSubscription.id, {
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.INTERVAL,
            newInterval: currentInterval
        });
    }
    async changeInterval(workspaceId) {
        const billingSubscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId
        });
        const currentInterval = billingSubscription.interval;
        await this.updateSubscription(billingSubscription.id, {
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.INTERVAL,
            newInterval: currentInterval === _billingsubscriptionintervalenum.SubscriptionInterval.Month ? _billingsubscriptionintervalenum.SubscriptionInterval.Year : _billingsubscriptionintervalenum.SubscriptionInterval.Month
        });
    }
    async changePlan(workspaceId) {
        const billingSubscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId
        });
        const currentPlan = (0, _getlicensedbillingsubscriptionitemorthrowutil.getCurrentLicensedBillingSubscriptionItemOrThrow)(billingSubscription).billingProduct?.metadata.planKey;
        await this.updateSubscription(billingSubscription.id, {
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.PLAN,
            newPlan: currentPlan === _billingplankeyenum.BillingPlanKey.ENTERPRISE ? _billingplankeyenum.BillingPlanKey.PRO : _billingplankeyenum.BillingPlanKey.ENTERPRISE
        });
    }
    async changeSeats(workspaceId, newSeats) {
        const billingSubscription = await this.billingSubscriptionService.getCurrentBillingSubscriptionOrThrow({
            workspaceId
        });
        await this.updateSubscription(billingSubscription.id, {
            type: _billingsubscriptionupdatetype.SubscriptionUpdateType.SEATS,
            newSeats
        });
    }
    async updateSubscription(subscriptionId, subscriptionUpdate) {
        const subscription = await this.billingSubscriptionRepository.findOneOrFail({
            where: {
                id: subscriptionId
            },
            relations: [
                'billingSubscriptionItems',
                'billingSubscriptionItems.billingProduct'
            ]
        });
        const licensedItem = (0, _getlicensedbillingsubscriptionitemorthrowutil.getCurrentLicensedBillingSubscriptionItemOrThrow)(subscription);
        const meteredItem = (0, _getmeteredbillingsubscriptionitemorthrowutil.getCurrentMeteredBillingSubscriptionItemOrThrow)(subscription);
        const toUpdateCurrentPrices = await this.computeSubscriptionPricesUpdate(subscriptionUpdate, {
            licensedPriceId: licensedItem.stripePriceId,
            meteredPriceId: meteredItem.stripePriceId,
            seats: licensedItem.quantity
        });
        const { schedule, currentPhase, nextPhase } = await this.stripeSubscriptionScheduleService.loadSubscriptionSchedule(subscription.stripeSubscriptionId);
        const shouldUpdateAtPeriodEnd = await this.shouldUpdateAtSubscriptionPeriodEnd(subscription, subscriptionUpdate);
        if (shouldUpdateAtPeriodEnd) {
            if (!(0, _utils.isDefined)(schedule)) {
                const { schedule, currentPhase } = await this.stripeSubscriptionScheduleService.createSubscriptionSchedule(subscription.stripeSubscriptionId);
                await this.runSubscriptionScheduleUpdate({
                    stripeScheduleId: schedule.id,
                    toUpdateCurrentPrices: undefined,
                    toUpdateNextPrices: toUpdateCurrentPrices,
                    currentPhase: this.billingSubscriptionPhaseService.toPhaseUpdateParams(currentPhase),
                    subscriptionCurrentPeriodEnd: Math.floor(subscription.currentPeriodEnd.getTime() / 1000)
                });
            } else {
                (0, _utils.assertIsDefinedOrThrow)(nextPhase);
                (0, _utils.assertIsDefinedOrThrow)(currentPhase);
                const toUpdateNextPrices = await this.computeSubscriptionPricesUpdate(subscriptionUpdate, (0, _getsubscriptionpricesfromschedulephaseutil.getSubscriptionPricesFromSchedulePhase)(nextPhase));
                await this.runSubscriptionScheduleUpdate({
                    stripeScheduleId: schedule.id,
                    toUpdateNextPrices,
                    toUpdateCurrentPrices: undefined,
                    currentPhase: this.billingSubscriptionPhaseService.toPhaseUpdateParams(currentPhase),
                    subscriptionCurrentPeriodEnd: Math.floor(subscription.currentPeriodEnd.getTime() / 1000)
                });
            }
        } else {
            const subscriptionOptions = (0, _computesubscriptionupdateoptionsutil.computeSubscriptionUpdateOptions)(subscriptionUpdate);
            await this.runSubscriptionUpdate({
                stripeSubscriptionId: subscription.stripeSubscriptionId,
                licensedStripeItemId: licensedItem.stripeSubscriptionItemId,
                meteredStripeItemId: meteredItem.stripeSubscriptionItemId,
                licensedStripePriceId: toUpdateCurrentPrices.licensedPriceId,
                meteredStripePriceId: toUpdateCurrentPrices.meteredPriceId,
                seats: toUpdateCurrentPrices.seats,
                ...subscriptionOptions
            });
            if (subscriptionUpdate.type !== _billingsubscriptionupdatetype.SubscriptionUpdateType.SEATS) {
                await this.billingSubscriptionItemRepository.update({
                    stripeSubscriptionId: subscription.stripeSubscriptionId
                }, {
                    hasReachedCurrentPeriodCap: false
                });
                const meteredPricingInfo = await this.meteredCreditService.getMeteredPricingInfoFromPriceId(toUpdateCurrentPrices.meteredPriceId);
                const creditBalance = await this.meteredCreditService.getCreditBalance(subscription.stripeCustomerId, meteredPricingInfo.unitPriceCents);
                await this.stripeBillingAlertService.createUsageThresholdAlertForCustomerMeter(subscription.stripeCustomerId, meteredPricingInfo.tierCap, creditBalance, subscription.currentPeriodStart);
            }
            if ((0, _utils.isDefined)(nextPhase)) {
                (0, _utils.assertIsDefinedOrThrow)(schedule);
                const { currentPhase: refreshedCurrentPhase } = await this.stripeSubscriptionScheduleService.loadSubscriptionSchedule(subscription.stripeSubscriptionId);
                (0, _utils.assertIsDefinedOrThrow)(refreshedCurrentPhase);
                const nextPhasePrices = (0, _getsubscriptionpricesfromschedulephaseutil.getSubscriptionPricesFromSchedulePhase)(nextPhase);
                const toUpdateNextPrices = await this.computeSubscriptionPricesUpdate(subscriptionUpdate, nextPhasePrices);
                await this.runSubscriptionScheduleUpdate({
                    stripeScheduleId: schedule.id,
                    toUpdateNextPrices,
                    toUpdateCurrentPrices: undefined,
                    currentPhase: this.billingSubscriptionPhaseService.toPhaseUpdateParams(refreshedCurrentPhase),
                    subscriptionCurrentPeriodEnd: Math.floor(subscription.currentPeriodEnd.getTime() / 1000)
                });
            }
        }
        await this.billingSubscriptionService.syncSubscriptionToDatabase(subscription.workspaceId, subscription.stripeSubscriptionId);
    }
    async runSubscriptionUpdate({ stripeSubscriptionId, licensedStripeItemId, meteredStripeItemId, licensedStripePriceId, meteredStripePriceId, seats, anchor, proration, metadata }) {
        return await this.stripeSubscriptionService.updateSubscription(stripeSubscriptionId, {
            items: [
                {
                    id: licensedStripeItemId,
                    price: licensedStripePriceId,
                    quantity: seats
                },
                {
                    id: meteredStripeItemId,
                    price: meteredStripePriceId
                }
            ],
            ...anchor ? {
                billing_cycle_anchor: anchor
            } : {},
            ...proration ? {
                proration_behavior: proration
            } : {},
            ...metadata ? {
                metadata
            } : {},
            billing_thresholds: await this.billingPriceService.getBillingThresholdsByMeterPriceId(meteredStripePriceId)
        });
    }
    async runSubscriptionScheduleUpdate({ stripeScheduleId, toUpdateNextPrices, toUpdateCurrentPrices, currentPhase, subscriptionCurrentPeriodEnd }) {
        let toUpdateCurrentPhase = {
            ...currentPhase,
            end_date: subscriptionCurrentPeriodEnd
        };
        if ((0, _utils.isDefined)(toUpdateCurrentPrices)) {
            toUpdateCurrentPhase = await this.billingSubscriptionPhaseService.buildPhaseUpdateParams({
                licensedStripePriceId: toUpdateCurrentPrices.licensedPriceId,
                seats: toUpdateCurrentPrices.seats,
                meteredStripePriceId: toUpdateCurrentPrices.meteredPriceId,
                endDate: subscriptionCurrentPeriodEnd,
                startDate: currentPhase.start_date
            });
        }
        const toUpdateNextPhase = await this.billingSubscriptionPhaseService.buildPhaseUpdateParams({
            licensedStripePriceId: toUpdateNextPrices.licensedPriceId,
            seats: toUpdateNextPrices.seats,
            meteredStripePriceId: toUpdateNextPrices.meteredPriceId,
            startDate: subscriptionCurrentPeriodEnd,
            endDate: undefined
        });
        if (await this.billingSubscriptionPhaseService.isSamePhaseSignature(toUpdateCurrentPhase, toUpdateNextPhase)) {
            return await this.stripeSubscriptionScheduleService.releaseSubscriptionSchedule(stripeScheduleId);
        }
        return await this.stripeSubscriptionScheduleService.updateSchedule(stripeScheduleId, {
            phases: [
                toUpdateCurrentPhase,
                toUpdateNextPhase
            ]
        });
    }
    async shouldUpdateAtSubscriptionPeriodEnd(subscription, update) {
        switch(update.type){
            case _billingsubscriptionupdatetype.SubscriptionUpdateType.PLAN:
                {
                    const currentPlan = subscription.billingSubscriptionItems[0].billingProduct?.metadata.planKey;
                    const isDowngrade = currentPlan !== update.newPlan && update.newPlan === _billingplankeyenum.BillingPlanKey.PRO;
                    return isDowngrade;
                }
            case _billingsubscriptionupdatetype.SubscriptionUpdateType.METERED_PRICE:
                {
                    const currentMeteredPriceId = subscription.billingSubscriptionItems.find((item)=>item.quantity == null)?.stripePriceId;
                    (0, _utils.assertIsDefinedOrThrow)(currentMeteredPriceId);
                    const currentMeteredPrice = await this.billingPriceRepository.findOneOrFail({
                        where: {
                            stripePriceId: currentMeteredPriceId
                        },
                        relations: [
                            'billingProduct'
                        ]
                    });
                    const newMeteredPrice = await this.billingPriceRepository.findOneOrFail({
                        where: {
                            stripePriceId: update.newMeteredPriceId
                        },
                        relations: [
                            'billingProduct'
                        ]
                    });
                    _billingvalidate.billingValidator.assertIsMeteredPrice(currentMeteredPrice);
                    _billingvalidate.billingValidator.assertIsMeteredPrice(newMeteredPrice);
                    const currentMeteredCap = currentMeteredPrice.tiers[0].up_to;
                    const newMeteredCap = newMeteredPrice.tiers[0].up_to;
                    const isDowngrade = currentMeteredCap > newMeteredCap;
                    return isDowngrade;
                }
            case _billingsubscriptionupdatetype.SubscriptionUpdateType.SEATS:
                return false;
            case _billingsubscriptionupdatetype.SubscriptionUpdateType.INTERVAL:
                {
                    const currentInterval = subscription.interval;
                    const isDowngrade = currentInterval !== update.newInterval && update.newInterval === _billingsubscriptionintervalenum.SubscriptionInterval.Month;
                    return isDowngrade;
                }
            default:
                {
                    return (0, _utils.assertUnreachable)(update, 'Should never occur, add validator for new subscription update type');
                }
        }
    }
    async computeSubscriptionPricesUpdate(update, currentPrices) {
        switch(update.type){
            case _billingsubscriptionupdatetype.SubscriptionUpdateType.PLAN:
                return await this.computeSubscriptionPricesUpdateByPlan(update.newPlan, currentPrices);
            case _billingsubscriptionupdatetype.SubscriptionUpdateType.METERED_PRICE:
                return await this.computeSubscriptionPricesUpdateByMeteredPrice(update.newMeteredPriceId, currentPrices);
            case _billingsubscriptionupdatetype.SubscriptionUpdateType.SEATS:
                return this.computeSubscriptionPricesUpdateBySeats(update.newSeats, currentPrices);
            case _billingsubscriptionupdatetype.SubscriptionUpdateType.INTERVAL:
                return await this.computeSubscriptionPricesUpdateByInterval(update.newInterval, currentPrices);
        }
    }
    computeSubscriptionPricesUpdateBySeats(newSeats, currentPrices) {
        return {
            ...currentPrices,
            seats: newSeats
        };
    }
    async computeSubscriptionPricesUpdateByMeteredPrice(newMeteredPriceId, currentPrices) {
        const currentLicensedPrice = await this.billingPriceRepository.findOneOrFail({
            where: {
                stripePriceId: currentPrices.licensedPriceId
            },
            relations: [
                'billingProduct'
            ]
        });
        const currentInterval = currentLicensedPrice.interval;
        const currentPlanKey = currentLicensedPrice.billingProduct?.metadata.planKey;
        (0, _utils.assertIsDefinedOrThrow)(currentPlanKey);
        const newMeteredPrice = await this.billingPriceRepository.findOneOrFail({
            where: {
                stripePriceId: newMeteredPriceId
            },
            relations: [
                'billingProduct'
            ]
        });
        _billingvalidate.billingValidator.assertIsMeteredPrice(newMeteredPrice);
        const newInterval = newMeteredPrice.interval;
        const newPlanKey = newMeteredPrice.billingProduct?.metadata.planKey;
        if (newInterval === currentInterval && currentPlanKey === newPlanKey) {
            return {
                ...currentPrices,
                meteredPriceId: newMeteredPriceId
            };
        }
        const newEquivalentMeteredPrice = await this.billingPriceService.findEquivalentMeteredPrice({
            meteredPrice: newMeteredPrice,
            targetInterval: currentInterval,
            targetPlanKey: currentPlanKey,
            hasSameInterval: newInterval === currentInterval,
            hasSamePlanKey: currentPlanKey === newPlanKey
        });
        return {
            ...currentPrices,
            meteredPriceId: newEquivalentMeteredPrice.stripePriceId
        };
    }
    async computeSubscriptionPricesUpdateByPlan(newPlan, currentPrices) {
        const currentLicensedPrice = await this.billingPriceRepository.findOneOrFail({
            where: {
                stripePriceId: currentPrices.licensedPriceId
            },
            relations: [
                'billingProduct'
            ]
        });
        const currentInterval = currentLicensedPrice.interval;
        const currentPlanKey = currentLicensedPrice.billingProduct?.metadata.planKey;
        (0, _utils.assertIsDefinedOrThrow)(currentPlanKey);
        if (currentPlanKey === newPlan) {
            return currentPrices;
        }
        const billingPricesPerPlanAndIntervalArray = await this.billingProductService.getProductPrices({
            interval: currentInterval,
            planKey: newPlan
        });
        const targetLicensedPrice = (0, _utils.findOrThrow)(billingPricesPerPlanAndIntervalArray, ({ billingProduct })=>billingProduct?.metadata.productKey === _billingproductkeyenum.BillingProductKey.BASE_PRODUCT);
        const currentMeteredPrice = await this.billingPriceRepository.findOneOrFail({
            where: {
                stripePriceId: currentPrices.meteredPriceId
            },
            relations: [
                'billingProduct'
            ]
        });
        _billingvalidate.billingValidator.assertIsMeteredPrice(currentMeteredPrice);
        const targetMeteredPrice = await this.billingPriceService.findEquivalentMeteredPrice({
            meteredPrice: currentMeteredPrice,
            targetInterval: currentInterval,
            targetPlanKey: newPlan,
            hasSameInterval: true,
            hasSamePlanKey: false
        });
        return {
            ...currentPrices,
            licensedPriceId: targetLicensedPrice.stripePriceId,
            meteredPriceId: targetMeteredPrice.stripePriceId
        };
    }
    async computeSubscriptionPricesUpdateByInterval(newInterval, currentPrices) {
        const currentLicensedPrice = await this.billingPriceRepository.findOneOrFail({
            where: {
                stripePriceId: currentPrices.licensedPriceId
            },
            relations: [
                'billingProduct'
            ]
        });
        const currentInterval = currentLicensedPrice.interval;
        const currentPlanKey = currentLicensedPrice.billingProduct?.metadata.planKey;
        (0, _utils.assertIsDefinedOrThrow)(currentPlanKey);
        if (currentInterval === newInterval) {
            return currentPrices;
        }
        const billingPricesPerPlanAndIntervalArray = await this.billingProductService.getProductPrices({
            interval: newInterval,
            planKey: currentPlanKey
        });
        const targetLicensedPrice = (0, _utils.findOrThrow)(billingPricesPerPlanAndIntervalArray, ({ billingProduct })=>billingProduct?.metadata.productKey === _billingproductkeyenum.BillingProductKey.BASE_PRODUCT);
        const currentMeteredPrice = await this.billingPriceRepository.findOneOrFail({
            where: {
                stripePriceId: currentPrices.meteredPriceId
            },
            relations: [
                'billingProduct'
            ]
        });
        _billingvalidate.billingValidator.assertIsMeteredPrice(currentMeteredPrice);
        const targetMeteredPrice = await this.billingPriceService.findEquivalentMeteredPrice({
            meteredPrice: currentMeteredPrice,
            targetInterval: newInterval,
            targetPlanKey: currentPlanKey,
            hasSameInterval: false,
            hasSamePlanKey: true
        });
        return {
            ...currentPrices,
            licensedPriceId: targetLicensedPrice.stripePriceId,
            meteredPriceId: targetMeteredPrice.stripePriceId
        };
    }
    constructor(stripeSubscriptionService, billingPriceService, billingProductService, billingPriceRepository, billingSubscriptionItemRepository, billingSubscriptionRepository, stripeSubscriptionScheduleService, billingSubscriptionPhaseService, stripeBillingAlertService, billingSubscriptionService, meteredCreditService){
        this.stripeSubscriptionService = stripeSubscriptionService;
        this.billingPriceService = billingPriceService;
        this.billingProductService = billingProductService;
        this.billingPriceRepository = billingPriceRepository;
        this.billingSubscriptionItemRepository = billingSubscriptionItemRepository;
        this.billingSubscriptionRepository = billingSubscriptionRepository;
        this.stripeSubscriptionScheduleService = stripeSubscriptionScheduleService;
        this.billingSubscriptionPhaseService = billingSubscriptionPhaseService;
        this.stripeBillingAlertService = stripeBillingAlertService;
        this.billingSubscriptionService = billingSubscriptionService;
        this.meteredCreditService = meteredCreditService;
        this.logger = new _common.Logger(BillingSubscriptionUpdateService.name);
    }
};
BillingSubscriptionUpdateService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_billingpriceentity.BillingPriceEntity)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_billingsubscriptionitementity.BillingSubscriptionItemEntity)),
    _ts_param(5, (0, _typeorm.InjectRepository)(_billingsubscriptionentity.BillingSubscriptionEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _stripesubscriptionservice.StripeSubscriptionService === "undefined" ? Object : _stripesubscriptionservice.StripeSubscriptionService,
        typeof _billingpriceservice.BillingPriceService === "undefined" ? Object : _billingpriceservice.BillingPriceService,
        typeof _billingproductservice.BillingProductService === "undefined" ? Object : _billingproductservice.BillingProductService,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _stripesubscriptionscheduleservice.StripeSubscriptionScheduleService === "undefined" ? Object : _stripesubscriptionscheduleservice.StripeSubscriptionScheduleService,
        typeof _billingsubscriptionphaseservice.BillingSubscriptionPhaseService === "undefined" ? Object : _billingsubscriptionphaseservice.BillingSubscriptionPhaseService,
        typeof _stripebillingalertservice.StripeBillingAlertService === "undefined" ? Object : _stripebillingalertservice.StripeBillingAlertService,
        typeof _billingsubscriptionservice.BillingSubscriptionService === "undefined" ? Object : _billingsubscriptionservice.BillingSubscriptionService,
        typeof _meteredcreditservice.MeteredCreditService === "undefined" ? Object : _meteredcreditservice.MeteredCreditService
    ])
], BillingSubscriptionUpdateService);

//# sourceMappingURL=billing-subscription-update.service.js.map