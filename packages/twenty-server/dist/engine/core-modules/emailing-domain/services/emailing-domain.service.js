"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingDomainService", {
    enumerable: true,
    get: function() {
        return EmailingDomainService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _emailingdomaindriverfactory = require("../drivers/emailing-domain-driver.factory");
const _emailingdomain = require("../drivers/types/emailing-domain");
const _emailingdomainentity = require("../emailing-domain.entity");
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
let EmailingDomainService = class EmailingDomainService {
    async createEmailingDomain(domain, driver, workspace) {
        const existingDomain = await this.emailingDomainRepository.findOneBy({
            domain,
            workspaceId: workspace.id
        });
        if (existingDomain) {
            throw new Error('Emailing domain already exists for this workspace');
        }
        const driverInstance = this.emailingDomainDriverFactory.getCurrentDriver();
        const verificationResult = await driverInstance.verifyDomain({
            domain,
            workspaceId: workspace.id
        });
        const domainToCreate = {
            domain,
            driver,
            workspaceId: workspace.id,
            ...verificationResult
        };
        const savedDomain = await this.emailingDomainRepository.save(domainToCreate);
        return savedDomain;
    }
    async deleteEmailingDomain(workspace, emailingDomainId) {
        const emailingDomain = await this.emailingDomainRepository.findOneBy({
            id: emailingDomainId,
            workspaceId: workspace.id
        });
        if (!emailingDomain) {
            throw new Error('Emailing domain not found');
        }
        await this.emailingDomainRepository.delete({
            id: emailingDomain.id
        });
    }
    async getEmailingDomains(workspace) {
        return await this.emailingDomainRepository.find({
            where: {
                workspaceId: workspace.id
            },
            order: {
                createdAt: 'DESC'
            }
        });
    }
    async getEmailingDomain(workspace, emailingDomainId) {
        return await this.emailingDomainRepository.findOneBy({
            id: emailingDomainId,
            workspaceId: workspace.id
        });
    }
    async verifyEmailingDomain(workspace, emailingDomainId) {
        const emailingDomain = await this.getEmailingDomain(workspace, emailingDomainId);
        if (!emailingDomain) {
            throw new Error('Emailing domain not found');
        }
        if (emailingDomain.status === _emailingdomain.EmailingDomainStatus.VERIFIED) {
            throw new Error('Emailing domain is already verified');
        }
        const driver = this.emailingDomainDriverFactory.getCurrentDriver();
        const verificationResult = await driver.verifyDomain({
            domain: emailingDomain.domain,
            workspaceId: emailingDomain.workspaceId
        });
        const updatedDomain = await this.emailingDomainRepository.save({
            ...emailingDomain,
            ...verificationResult
        });
        return updatedDomain;
    }
    async syncEmailingDomain(workspace, emailingDomainId) {
        const emailingDomain = await this.getEmailingDomain(workspace, emailingDomainId);
        if (!emailingDomain) {
            throw new Error('Emailing domain not found');
        }
        await this.emailingDomainRepository.update({
            id: emailingDomainId
        }, {
            verificationRecords: emailingDomain.verificationRecords,
            status: _emailingdomain.EmailingDomainStatus.PENDING
        });
        try {
            const driver = this.emailingDomainDriverFactory.getCurrentDriver();
            const statusResult = await driver.getDomainStatus({
                domain: emailingDomain.domain,
                workspaceId: emailingDomain.workspaceId
            });
            const updatedDomain = await this.emailingDomainRepository.save({
                ...emailingDomain,
                ...statusResult
            });
            return updatedDomain;
        } catch (error) {
            await this.emailingDomainRepository.update({
                id: emailingDomainId
            }, {
                verificationRecords: emailingDomain.verificationRecords,
                status: emailingDomain.status
            });
            throw error;
        }
    }
    constructor(emailingDomainRepository, emailingDomainDriverFactory){
        this.emailingDomainRepository = emailingDomainRepository;
        this.emailingDomainDriverFactory = emailingDomainDriverFactory;
    }
};
EmailingDomainService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_emailingdomainentity.EmailingDomainEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _emailingdomaindriverfactory.EmailingDomainDriverFactory === "undefined" ? Object : _emailingdomaindriverfactory.EmailingDomainDriverFactory
    ])
], EmailingDomainService);

//# sourceMappingURL=emailing-domain.service.js.map