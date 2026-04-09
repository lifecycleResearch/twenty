"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AwsSesDriver", {
    enumerable: true,
    get: function() {
        return AwsSesDriver;
    }
});
const _common = require("@nestjs/common");
const _clientsesv2 = require("@aws-sdk/client-sesv2");
const _emailingdomain = require("../../types/emailing-domain");
let AwsSesDriver = class AwsSesDriver {
    async verifyDomain(input) {
        try {
            this.logger.log(`Starting domain verification for: ${input.domain}`);
            const tenantName = this.generateTenantName(input.workspaceId);
            await this.ensureTenantExists(tenantName);
            const { isVerified, verificationRecords } = await this.createOrUpdateEmailIdentity(input.domain, tenantName);
            if (isVerified) {
                await this.enableDkimSigning(input.domain);
            }
            return {
                status: isVerified ? _emailingdomain.EmailingDomainStatus.VERIFIED : _emailingdomain.EmailingDomainStatus.PENDING,
                verifiedAt: isVerified ? new Date() : null,
                verificationRecords
            };
        } catch (error) {
            this.logger.error(`Failed to verify domain ${input.domain}: ${error}`);
            this.awsSesHandleErrorService.handleAwsSesError(error, 'verifyDomain');
        }
    }
    async getDomainStatus(input) {
        try {
            this.logger.log(`Getting domain status for: ${input.domain}`);
            const sesClient = this.awsSesClientProvider.getSESClient();
            const getIdentityCommand = new _clientsesv2.GetEmailIdentityCommand({
                EmailIdentity: input.domain
            });
            const identityResponse = await sesClient.send(getIdentityCommand);
            const status = this.determineVerificationStatus(identityResponse);
            const isFullyVerified = status === _emailingdomain.EmailingDomainStatus.VERIFIED;
            const verificationRecords = this.buildVerificationRecords(input.domain, identityResponse.DkimAttributes?.Tokens || []);
            return {
                status,
                verifiedAt: isFullyVerified ? new Date() : null,
                verificationRecords
            };
        } catch (error) {
            if (error.name === 'NotFoundException') {
                return {
                    status: _emailingdomain.EmailingDomainStatus.FAILED,
                    verifiedAt: null,
                    verificationRecords: []
                };
            }
            this.logger.error(`Failed to get domain status ${input.domain}: ${error}`);
            this.awsSesHandleErrorService.handleAwsSesError(error, 'getDomainStatus');
        }
    }
    generateTenantName(workspaceId) {
        return `twenty-workspace-${workspaceId}`;
    }
    async ensureTenantExists(tenantName) {
        const sesClient = this.awsSesClientProvider.getSESClient();
        try {
            await sesClient.send(new _clientsesv2.CreateTenantCommand({
                TenantName: tenantName
            }));
            this.logger.log(`Created tenant: ${tenantName}`);
        } catch (error) {
            if (error.name === 'AlreadyExistsException') {
                this.logger.log(`Tenant already exists: ${tenantName}`);
                return;
            }
            throw error;
        }
    }
    async createOrUpdateEmailIdentity(domain, tenantName) {
        const sesClient = this.awsSesClientProvider.getSESClient();
        try {
            const getIdentityCommand = new _clientsesv2.GetEmailIdentityCommand({
                EmailIdentity: domain
            });
            const existingIdentity = await sesClient.send(getIdentityCommand);
            const isVerified = existingIdentity.VerifiedForSendingStatus === true;
            const verificationRecords = this.buildVerificationRecords(domain, existingIdentity.DkimAttributes?.Tokens || []);
            if (!isVerified) {
                await this.associateResourceWithTenant(domain, tenantName);
            }
            return {
                isVerified,
                verificationRecords
            };
        } catch (error) {
            if (error.name === 'NotFoundException') {
                return await this.createNewEmailIdentity(domain, tenantName);
            }
            throw error;
        }
    }
    async createNewEmailIdentity(domain, tenantName) {
        const sesClient = this.awsSesClientProvider.getSESClient();
        const createCommand = new _clientsesv2.CreateEmailIdentityCommand({
            EmailIdentity: domain,
            Tags: [
                {
                    Key: 'Tenant',
                    Value: tenantName
                }
            ]
        });
        const createResponse = await sesClient.send(createCommand);
        const dkimTokens = createResponse.DkimAttributes?.Tokens || [];
        await this.associateResourceWithTenant(domain, tenantName);
        const verificationRecords = this.buildVerificationRecords(domain, dkimTokens);
        return {
            isVerified: false,
            verificationRecords
        };
    }
    async associateResourceWithTenant(domain, tenantName) {
        const sesClient = this.awsSesClientProvider.getSESClient();
        try {
            await sesClient.send(new _clientsesv2.CreateTenantResourceAssociationCommand({
                TenantName: tenantName,
                ResourceArn: `arn:aws:ses:${this.config.region}:${this.config.accountId}:identity/${domain}`
            }));
            this.logger.log(`Associated domain ${domain} with tenant ${tenantName}`);
        } catch (error) {
            if (error.name === 'AlreadyExistsException') {
                this.logger.log(`Domain ${domain} already associated with tenant ${tenantName}`);
                return;
            }
            throw error;
        }
    }
    async enableDkimSigning(domain) {
        const sesClient = this.awsSesClientProvider.getSESClient();
        const dkimCommand = new _clientsesv2.PutEmailIdentityDkimAttributesCommand({
            EmailIdentity: domain,
            SigningEnabled: true
        });
        await sesClient.send(dkimCommand);
        this.logger.log(`Enabled DKIM signing for domain: ${domain}`);
    }
    buildVerificationRecords(domain, dkimTokens) {
        return dkimTokens.map((token)=>({
                type: 'CNAME',
                key: `${token}._domainkey.${domain}`,
                value: `${token}.dkim.amazonses.com`
            }));
    }
    determineVerificationStatus(identityResponse) {
        const isVerified = identityResponse.VerifiedForSendingStatus === true;
        const isDkimEnabled = identityResponse.DkimAttributes?.SigningEnabled === true;
        const dkimStatus = identityResponse.DkimAttributes?.Status;
        if (isVerified && isDkimEnabled && dkimStatus === 'SUCCESS') {
            return _emailingdomain.EmailingDomainStatus.VERIFIED;
        }
        if (identityResponse.VerifiedForSendingStatus === false || dkimStatus === 'FAILED') {
            return _emailingdomain.EmailingDomainStatus.FAILED;
        }
        return _emailingdomain.EmailingDomainStatus.PENDING;
    }
    constructor(config, awsSesClientProvider, awsSesHandleErrorService){
        this.config = config;
        this.awsSesClientProvider = awsSesClientProvider;
        this.awsSesHandleErrorService = awsSesHandleErrorService;
        this.logger = new _common.Logger(AwsSesDriver.name);
    }
};

//# sourceMappingURL=aws-ses-driver.service.js.map