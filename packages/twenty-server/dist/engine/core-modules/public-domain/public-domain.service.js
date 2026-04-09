"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PublicDomainService", {
    enumerable: true,
    get: function() {
        return PublicDomainService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _dnsmanagerservice = require("../dns-manager/services/dns-manager.service");
const _publicdomainentity = require("./public-domain.entity");
const _publicdomainexception = require("./public-domain.exception");
const _workspaceentity = require("../workspace/workspace.entity");
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
let PublicDomainService = class PublicDomainService {
    async deletePublicDomain({ domain, workspace }) {
        const formattedDomain = domain.trim().toLowerCase();
        await this.dnsManagerService.deleteHostnameSilently(formattedDomain, {
            isPublicDomain: true
        });
        await this.publicDomainRepository.delete({
            domain: formattedDomain,
            workspaceId: workspace.id
        });
    }
    async createPublicDomain({ domain, workspace }) {
        const formattedDomain = domain.trim().toLowerCase();
        if (await this.workspaceRepository.findOneBy({
            customDomain: formattedDomain
        })) {
            throw new _publicdomainexception.PublicDomainException('Domain already used for workspace custom domain', _publicdomainexception.PublicDomainExceptionCode.DOMAIN_ALREADY_REGISTERED_AS_CUSTOM_DOMAIN, {
                userFriendlyMessage: /*i18n*/ {
                    id: "IymH4t",
                    message: "Domain already used for workspace custom domain"
                }
            });
        }
        if (await this.publicDomainRepository.findOneBy({
            domain: formattedDomain,
            workspaceId: workspace.id
        })) {
            throw new _publicdomainexception.PublicDomainException('Public domain already registered', _publicdomainexception.PublicDomainExceptionCode.PUBLIC_DOMAIN_ALREADY_REGISTERED, {
                userFriendlyMessage: /*i18n*/ {
                    id: "OL88cI",
                    message: "Public domain already registered"
                }
            });
        }
        const publicDomain = this.publicDomainRepository.create({
            domain: formattedDomain,
            workspaceId: workspace.id
        });
        await this.dnsManagerService.registerHostname(formattedDomain, {
            isPublicDomain: true
        });
        try {
            await this.publicDomainRepository.insert(publicDomain);
        } catch (error) {
            await this.dnsManagerService.deleteHostnameSilently(formattedDomain, {
                isPublicDomain: true
            });
            throw error;
        }
        return publicDomain;
    }
    async checkPublicDomainValidRecords(publicDomain, domainValidRecords) {
        const publicDomainWithRecords = domainValidRecords ?? await this.dnsManagerService.getHostnameWithRecords(publicDomain.domain, {
            isPublicDomain: true
        });
        if (!publicDomainWithRecords) return;
        const isCustomDomainWorking = await this.dnsManagerService.isHostnameWorking(publicDomain.domain, {
            isPublicDomain: true
        });
        if (publicDomain.isValidated !== isCustomDomainWorking) {
            publicDomain.isValidated = isCustomDomainWorking;
            await this.publicDomainRepository.save(publicDomain);
        }
        return publicDomainWithRecords;
    }
    async findByDomain(domain) {
        return this.publicDomainRepository.findOne({
            where: {
                domain
            }
        });
    }
    constructor(dnsManagerService, publicDomainRepository, workspaceRepository){
        this.dnsManagerService = dnsManagerService;
        this.publicDomainRepository = publicDomainRepository;
        this.workspaceRepository = workspaceRepository;
    }
};
PublicDomainService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_publicdomainentity.PublicDomainEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dnsmanagerservice.DnsManagerService === "undefined" ? Object : _dnsmanagerservice.DnsManagerService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], PublicDomainService);

//# sourceMappingURL=public-domain.service.js.map