"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MarketplaceCatalogSyncService", {
    enumerable: true,
    get: function() {
        return MarketplaceCatalogSyncService;
    }
});
const _common = require("@nestjs/common");
const _applicationregistrationservice = require("../application-registration/application-registration.service");
const _applicationregistrationsourcetypeenum = require("../application-registration/enums/application-registration-source-type.enum");
const _marketplacecatalogindexconstant = require("./constants/marketplace-catalog-index.constant");
const _marketplaceservice = require("./marketplace.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MarketplaceCatalogSyncService = class MarketplaceCatalogSyncService {
    async syncCatalog() {
        await this.syncCuratedApps();
        await this.syncNpmApps();
        this.logger.log('Marketplace catalog sync completed');
    }
    async syncCuratedApps() {
        for (const entry of _marketplacecatalogindexconstant.MARKETPLACE_CATALOG_INDEX){
            try {
                await this.applicationRegistrationService.upsertFromCatalog({
                    universalIdentifier: entry.universalIdentifier,
                    name: entry.name,
                    description: entry.richDisplayData.aboutDescription ?? entry.description,
                    author: entry.author,
                    sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
                    sourcePackage: entry.sourcePackage,
                    logoUrl: entry.logoUrl ?? null,
                    websiteUrl: entry.websiteUrl ?? null,
                    termsUrl: entry.termsUrl ?? null,
                    latestAvailableVersion: entry.richDisplayData.version ?? null,
                    isListed: true,
                    isFeatured: entry.isFeatured,
                    marketplaceDisplayData: entry.richDisplayData,
                    ownerWorkspaceId: null
                });
            } catch (error) {
                this.logger.error(`Failed to sync curated app "${entry.name}": ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    async syncNpmApps() {
        const npmApps = await this.marketplaceService.fetchAppsFromNpmRegistry();
        const curatedIdentifiers = new Set(_marketplacecatalogindexconstant.MARKETPLACE_CATALOG_INDEX.map((entry)=>entry.universalIdentifier));
        for (const app of npmApps){
            if (curatedIdentifiers.has(app.id)) {
                continue;
            }
            try {
                await this.applicationRegistrationService.upsertFromCatalog({
                    universalIdentifier: app.id,
                    name: app.name,
                    description: app.description,
                    author: app.author,
                    sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
                    sourcePackage: app.sourcePackage ?? app.name,
                    logoUrl: null,
                    websiteUrl: app.websiteUrl ?? null,
                    termsUrl: null,
                    latestAvailableVersion: app.version ?? null,
                    isListed: true,
                    isFeatured: false,
                    marketplaceDisplayData: null,
                    ownerWorkspaceId: null
                });
            } catch (error) {
                this.logger.error(`Failed to sync npm app "${app.name}": ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    constructor(applicationRegistrationService, marketplaceService){
        this.applicationRegistrationService = applicationRegistrationService;
        this.marketplaceService = marketplaceService;
        this.logger = new _common.Logger(MarketplaceCatalogSyncService.name);
    }
};
MarketplaceCatalogSyncService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _marketplaceservice.MarketplaceService === "undefined" ? Object : _marketplaceservice.MarketplaceService
    ])
], MarketplaceCatalogSyncService);

//# sourceMappingURL=marketplace-catalog-sync.service.js.map