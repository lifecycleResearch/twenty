"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MarketplaceQueryService", {
    enumerable: true,
    get: function() {
        return MarketplaceQueryService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _applicationregistrationexception = require("../application-registration/application-registration.exception");
const _applicationregistrationservice = require("../application-registration/application-registration.service");
const _marketplacecatalogsynccronjob = require("./crons/marketplace-catalog-sync.cron.job");
const _messagequeuedecorator = require("../../message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../../message-queue/message-queue.constants");
const _messagequeueservice = require("../../message-queue/services/message-queue.service");
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
const MARKETPLACE_CACHE_TTL_MS = 5 * 60 * 1000;
let MarketplaceQueryService = class MarketplaceQueryService {
    async findManyMarketplaceApps() {
        if (this.cachedApps !== null && Date.now() < this.cacheExpiresAt) {
            return this.cachedApps;
        }
        const registrations = await this.applicationRegistrationService.findManyListed();
        if (registrations.length === 0) {
            if (!this.hasSyncBeenEnqueued) {
                this.hasSyncBeenEnqueued = true;
                this.logger.log('No marketplace registrations found, enqueuing one-time sync job');
                await this.messageQueueService.add(_marketplacecatalogsynccronjob.MarketplaceCatalogSyncCronJob.name, {});
            }
            return [];
        }
        this.cachedApps = registrations.map((registration)=>this.toMarketplaceAppDTO(registration));
        this.cacheExpiresAt = Date.now() + MARKETPLACE_CACHE_TTL_MS;
        return this.cachedApps;
    }
    async findOneMarketplaceApp(universalIdentifier) {
        const registration = await this.findRegistrationByUniversalIdentifier(universalIdentifier);
        return this.toMarketplaceAppDTO(registration);
    }
    async findRegistrationByUniversalIdentifier(universalIdentifier) {
        const registration = await this.applicationRegistrationService.findOneByUniversalIdentifier(universalIdentifier);
        if (!(0, _utils.isDefined)(registration)) {
            throw new _applicationregistrationexception.ApplicationRegistrationException(`No application registration found for identifier "${universalIdentifier}"`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.APPLICATION_REGISTRATION_NOT_FOUND);
        }
        return registration;
    }
    toMarketplaceAppDTO(registration) {
        const displayData = registration.marketplaceDisplayData;
        return {
            id: registration.universalIdentifier,
            name: registration.name,
            description: registration.description ?? '',
            icon: displayData?.icon ?? 'IconApps',
            version: displayData?.version ?? registration.latestAvailableVersion ?? '0.0.0',
            author: registration.author ?? 'Unknown',
            category: displayData?.category ?? '',
            logo: displayData?.logo,
            screenshots: displayData?.screenshots ?? [],
            aboutDescription: displayData?.aboutDescription ?? registration.description ?? '',
            providers: displayData?.providers ?? [],
            websiteUrl: registration.websiteUrl ?? undefined,
            termsUrl: registration.termsUrl ?? undefined,
            objects: displayData?.objects ?? [],
            fields: displayData?.fields ?? [],
            logicFunctions: displayData?.logicFunctions ?? [],
            frontComponents: displayData?.frontComponents ?? [],
            sourcePackage: registration.sourcePackage ?? undefined,
            defaultRole: displayData?.defaultRole,
            isFeatured: registration.isFeatured
        };
    }
    constructor(applicationRegistrationService, messageQueueService){
        this.applicationRegistrationService = applicationRegistrationService;
        this.messageQueueService = messageQueueService;
        this.logger = new _common.Logger(MarketplaceQueryService.name);
        this.cachedApps = null;
        this.cacheExpiresAt = 0;
        this.hasSyncBeenEnqueued = false;
    }
};
MarketplaceQueryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.cronQueue)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService
    ])
], MarketplaceQueryService);

//# sourceMappingURL=marketplace-query.service.js.map