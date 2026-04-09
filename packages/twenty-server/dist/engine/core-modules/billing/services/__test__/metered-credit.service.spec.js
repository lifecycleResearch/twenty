/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _billingpriceentity = require("../../entities/billing-price.entity");
const _billingsubscriptionentity = require("../../entities/billing-subscription.entity");
const _billingproductkeyenum = require("../../enums/billing-product-key.enum");
const _billingsubscriptionstatusenum = require("../../enums/billing-subscription-status.enum");
const _billingsubscriptionitemservice = require("../billing-subscription-item.service");
const _meteredcreditservice = require("../metered-credit.service");
const _stripebillingalertservice = require("../../stripe/services/stripe-billing-alert.service");
const _stripecreditgrantservice = require("../../stripe/services/stripe-credit-grant.service");
describe('MeteredCreditService', ()=>{
    let service;
    let billingSubscriptionRepository;
    let billingSubscriptionItemService;
    let stripeBillingAlertService;
    let stripeCreditGrantService;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _meteredcreditservice.MeteredCreditService,
                {
                    provide: (0, _typeorm.getRepositoryToken)(_billingsubscriptionentity.BillingSubscriptionEntity),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn()
                    }
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_billingpriceentity.BillingPriceEntity),
                    useValue: {
                        findOneOrFail: jest.fn()
                    }
                },
                {
                    provide: _billingsubscriptionitemservice.BillingSubscriptionItemService,
                    useValue: {
                        getMeteredSubscriptionItemDetails: jest.fn()
                    }
                },
                {
                    provide: _stripebillingalertservice.StripeBillingAlertService,
                    useValue: {
                        createUsageThresholdAlertForCustomerMeter: jest.fn()
                    }
                },
                {
                    provide: _stripecreditgrantservice.StripeCreditGrantService,
                    useValue: {
                        getCustomerCreditBalance: jest.fn()
                    }
                }
            ]
        }).compile();
        service = module.get(_meteredcreditservice.MeteredCreditService);
        billingSubscriptionRepository = module.get((0, _typeorm.getRepositoryToken)(_billingsubscriptionentity.BillingSubscriptionEntity));
        billingSubscriptionItemService = module.get(_billingsubscriptionitemservice.BillingSubscriptionItemService);
        stripeBillingAlertService = module.get(_stripebillingalertservice.StripeBillingAlertService);
        stripeCreditGrantService = module.get(_stripecreditgrantservice.StripeCreditGrantService);
    });
    describe('getMeteredPricingInfo', ()=>{
        const createMockSubscription = (meteredTiers = null)=>({
                id: 'sub_123',
                billingSubscriptionItems: [
                    {
                        stripePriceId: 'price_123',
                        billingProduct: {
                            metadata: {
                                productKey: _billingproductkeyenum.BillingProductKey.WORKFLOW_NODE_EXECUTION
                            },
                            billingPrices: [
                                {
                                    stripePriceId: 'price_123',
                                    stripeMeterId: 'meter_123',
                                    tiers: meteredTiers ?? [
                                        {
                                            up_to: 1000,
                                            flat_amount: null,
                                            unit_amount: null,
                                            unit_amount_decimal: null
                                        },
                                        {
                                            up_to: null,
                                            flat_amount: null,
                                            unit_amount: null,
                                            unit_amount_decimal: '10'
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            });
        it('should return pricing info when subscription and metered item found', async ()=>{
            const mockSubscription = createMockSubscription();
            billingSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);
            const result = await service.getMeteredPricingInfo('sub_123');
            expect(result).toEqual({
                tierCap: 1000,
                unitPriceCents: 10,
                stripeMeterId: 'meter_123'
            });
        });
        it('should return null when subscription not found', async ()=>{
            billingSubscriptionRepository.findOne.mockResolvedValue(null);
            const result = await service.getMeteredPricingInfo('sub_123');
            expect(result).toBeNull();
        });
        it('should return null when metered item not found', async ()=>{
            const mockSubscription = {
                id: 'sub_123',
                billingSubscriptionItems: [
                    {
                        billingProduct: {
                            metadata: {
                                productKey: 'other_product'
                            },
                            billingPrices: []
                        }
                    }
                ]
            };
            billingSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);
            const result = await service.getMeteredPricingInfo('sub_123');
            expect(result).toBeNull();
        });
    });
    describe('getMeteredRolloverParameters', ()=>{
        it('should return parameters when metered item found', async ()=>{
            billingSubscriptionItemService.getMeteredSubscriptionItemDetails.mockResolvedValue([
                {
                    stripeSubscriptionItemId: 'si_123',
                    productKey: _billingproductkeyenum.BillingProductKey.WORKFLOW_NODE_EXECUTION,
                    stripeMeterId: 'meter_123',
                    tierQuantity: 5000,
                    unitPriceCents: 5,
                    freeTrialQuantity: 100
                }
            ]);
            const result = await service.getMeteredRolloverParameters('sub_123');
            expect(result).toEqual({
                stripeMeterId: 'meter_123',
                tierQuantity: 5000,
                unitPriceCents: 5
            });
        });
        it('should return null when metered item not found', async ()=>{
            billingSubscriptionItemService.getMeteredSubscriptionItemDetails.mockResolvedValue([]);
            const result = await service.getMeteredRolloverParameters('sub_123');
            expect(result).toBeNull();
        });
    });
    describe('recreateBillingAlertForSubscription', ()=>{
        it('should create billing alert with correct parameters', async ()=>{
            const currentPeriodStart = new Date('2024-01-01');
            const mockSubscription = {
                id: 'sub_123',
                stripeCustomerId: 'cus_123',
                currentPeriodStart,
                status: _billingsubscriptionstatusenum.SubscriptionStatus.Active,
                billingSubscriptionItems: [
                    {
                        stripePriceId: 'price_123',
                        billingProduct: {
                            metadata: {
                                productKey: _billingproductkeyenum.BillingProductKey.WORKFLOW_NODE_EXECUTION
                            },
                            billingPrices: [
                                {
                                    stripePriceId: 'price_123',
                                    stripeMeterId: 'meter_123',
                                    tiers: [
                                        {
                                            up_to: 1000,
                                            flat_amount: null,
                                            unit_amount: null,
                                            unit_amount_decimal: null
                                        },
                                        {
                                            up_to: null,
                                            flat_amount: null,
                                            unit_amount: null,
                                            unit_amount_decimal: '10'
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            };
            // Mock for getMeteredPricingInfo (uses findOne)
            billingSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);
            stripeCreditGrantService.getCustomerCreditBalance.mockResolvedValue(500);
            await service.recreateBillingAlertForSubscription(mockSubscription);
            expect(stripeBillingAlertService.createUsageThresholdAlertForCustomerMeter).toHaveBeenCalledWith('cus_123', 1000, 500, currentPeriodStart);
        });
        it('should not create alert when metered pricing info not found', async ()=>{
            const mockSubscription = {
                id: 'sub_123',
                stripeCustomerId: 'cus_123',
                currentPeriodStart: new Date('2024-01-01'),
                status: _billingsubscriptionstatusenum.SubscriptionStatus.Active,
                billingSubscriptionItems: []
            };
            billingSubscriptionRepository.findOne.mockResolvedValue(mockSubscription);
            await service.recreateBillingAlertForSubscription(mockSubscription);
            expect(stripeBillingAlertService.createUsageThresholdAlertForCustomerMeter).not.toHaveBeenCalled();
        });
    });
});

//# sourceMappingURL=metered-credit.service.spec.js.map