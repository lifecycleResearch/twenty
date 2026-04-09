"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _approvedaccessdomainentity = require("../approved-access-domain.entity");
const _approvedaccessdomainexception = require("../approved-access-domain.exception");
const _workspacedomainsservice = require("../../domain/workspace-domains/services/workspace-domains.service");
const _emailservice = require("../../email/email.service");
const _fileservice = require("../../file/services/file.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _approvedaccessdomainservice = require("./approved-access-domain.service");
// To avoid dynamic import issues in Jest
jest.mock('@react-email/render', ()=>({
        render: jest.fn().mockImplementation(async (template, options)=>{
            if (options?.plainText) {
                return 'Plain Text Email';
            }
            return '<html><body>HTML email content</body></html>';
        })
    }));
describe('ApprovedAccessDomainService', ()=>{
    let service;
    let approvedAccessDomainRepository;
    let emailService;
    let twentyConfigService;
    let workspaceDomainsService;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _approvedaccessdomainservice.ApprovedAccessDomainService,
                {
                    provide: (0, _typeorm.getRepositoryToken)(_approvedaccessdomainentity.ApprovedAccessDomainEntity),
                    useValue: {
                        delete: jest.fn(),
                        findOneBy: jest.fn(),
                        find: jest.fn(),
                        save: jest.fn()
                    }
                },
                {
                    provide: _emailservice.EmailService,
                    useValue: {
                        send: jest.fn()
                    }
                },
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: {
                        get: jest.fn()
                    }
                },
                {
                    provide: _workspacedomainsservice.WorkspaceDomainsService,
                    useValue: {
                        buildWorkspaceURL: jest.fn()
                    }
                },
                {
                    provide: _fileservice.FileService,
                    useValue: {
                        signFileUrl: jest.fn().mockReturnValue('https://signed-url.com/logo.png')
                    }
                }
            ]
        }).compile();
        service = module.get(_approvedaccessdomainservice.ApprovedAccessDomainService);
        approvedAccessDomainRepository = module.get((0, _typeorm.getRepositoryToken)(_approvedaccessdomainentity.ApprovedAccessDomainEntity));
        emailService = module.get(_emailservice.EmailService);
        twentyConfigService = module.get(_twentyconfigservice.TwentyConfigService);
        workspaceDomainsService = module.get(_workspacedomainsservice.WorkspaceDomainsService);
    });
    describe('createApprovedAccessDomain', ()=>{
        it('should successfully create an approved access domain', async ()=>{
            const domain = 'custom-domain.com';
            const inWorkspace = {
                id: 'workspace-id',
                customDomain: null,
                isCustomDomainEnabled: false
            };
            const fromUser = {
                userEmail: 'user@custom-domain.com'
            };
            const expectedApprovedAccessDomain = {
                workspaceId: 'workspace-id',
                domain,
                isValidated: true
            };
            jest.spyOn(approvedAccessDomainRepository, 'save').mockResolvedValue(expectedApprovedAccessDomain);
            jest.spyOn(service, 'sendApprovedAccessDomainValidationEmail').mockResolvedValue();
            const result = await service.createApprovedAccessDomain(domain, inWorkspace, fromUser, 'validator@custom-domain.com');
            expect(approvedAccessDomainRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                workspaceId: 'workspace-id',
                domain
            }));
            expect(result).toEqual(expectedApprovedAccessDomain);
        });
        it('should throw an exception if approved access domain is not a company domain', async ()=>{
            await expect(service.createApprovedAccessDomain('gmail.com', {
                id: 'workspace-id'
            }, {
                userEmail: 'user@gmail.com'
            }, 'user@gmail.com')).rejects.toThrowError(new _approvedaccessdomainexception.ApprovedAccessDomainException('Approved access domain must be a company domain', _approvedaccessdomainexception.ApprovedAccessDomainExceptionCode.APPROVED_ACCESS_DOMAIN_MUST_BE_A_COMPANY_DOMAIN));
            expect(approvedAccessDomainRepository.save).not.toHaveBeenCalled();
        });
    });
    describe('deleteApprovedAccessDomain', ()=>{
        it('should delete an approved access domain successfully', async ()=>{
            const workspace = {
                id: 'workspace-id'
            };
            const approvedAccessDomainId = 'approved-access-domain-id';
            const approvedAccessDomainEntity = {
                id: approvedAccessDomainId,
                workspaceId: workspace.id
            };
            jest.spyOn(approvedAccessDomainRepository, 'findOneBy').mockResolvedValue(approvedAccessDomainEntity);
            jest.spyOn(approvedAccessDomainRepository, 'delete').mockResolvedValue({});
            await service.deleteApprovedAccessDomain(workspace, approvedAccessDomainId);
            expect(approvedAccessDomainRepository.findOneBy).toHaveBeenCalledWith({
                id: approvedAccessDomainId,
                workspaceId: workspace.id
            });
            expect(approvedAccessDomainRepository.delete).toHaveBeenCalledWith({
                id: approvedAccessDomainEntity.id
            });
        });
        it('should throw an error if the approved access domain does not exist', async ()=>{
            const workspace = {
                id: 'workspace-id'
            };
            const approvedAccessDomainId = 'approved-access-domain-id';
            jest.spyOn(approvedAccessDomainRepository, 'findOneBy').mockResolvedValue(null);
            await expect(service.deleteApprovedAccessDomain(workspace, approvedAccessDomainId)).rejects.toThrow();
            expect(approvedAccessDomainRepository.findOneBy).toHaveBeenCalledWith({
                id: approvedAccessDomainId,
                workspaceId: workspace.id
            });
            expect(approvedAccessDomainRepository.delete).not.toHaveBeenCalled();
        });
    });
    describe('sendApprovedAccessDomainValidationEmail', ()=>{
        it('should throw an exception if the approved access domain is already validated', async ()=>{
            const approvedAccessDomainId = 'approved-access-domain-id';
            const sender = {};
            const workspace = {};
            const email = 'validator@example.com';
            const approvedAccessDomain = {
                id: approvedAccessDomainId,
                isValidated: true
            };
            jest.spyOn(approvedAccessDomainRepository, 'findOneBy').mockResolvedValue(approvedAccessDomain);
            await expect(service.sendApprovedAccessDomainValidationEmail(sender, email, workspace, approvedAccessDomain)).rejects.toThrowError(new _approvedaccessdomainexception.ApprovedAccessDomainException('Approved access domain has already been validated', _approvedaccessdomainexception.ApprovedAccessDomainExceptionCode.APPROVED_ACCESS_DOMAIN_ALREADY_VERIFIED));
        });
        it('should throw an exception if the email does not match the approved access domain', async ()=>{
            const approvedAccessDomainId = 'approved-access-domain-id';
            const sender = {};
            const workspace = {};
            const email = 'validator@different.com';
            const approvedAccessDomain = {
                id: approvedAccessDomainId,
                isValidated: false,
                domain: 'example.com'
            };
            jest.spyOn(approvedAccessDomainRepository, 'findOneBy').mockResolvedValue(approvedAccessDomain);
            await expect(service.sendApprovedAccessDomainValidationEmail(sender, email, workspace, approvedAccessDomain)).rejects.toThrowError(new _approvedaccessdomainexception.ApprovedAccessDomainException('Approved access domain does not match email domain', _approvedaccessdomainexception.ApprovedAccessDomainExceptionCode.APPROVED_ACCESS_DOMAIN_DOES_NOT_MATCH_DOMAIN_EMAIL));
        });
        it('should send a validation email if all conditions are met', async ()=>{
            const sender = {
                userEmail: 'sender@example.com',
                name: {
                    firstName: 'John',
                    lastName: 'Doe'
                },
                locale: 'en'
            };
            const workspace = {
                displayName: 'Test Workspace',
                logo: '/logo.png'
            };
            const email = 'validator@custom-domain.com';
            const approvedAccessDomain = {
                isValidated: false,
                domain: 'custom-domain.com'
            };
            jest.spyOn(approvedAccessDomainRepository, 'findOneBy').mockResolvedValue(approvedAccessDomain);
            jest.spyOn(workspaceDomainsService, 'buildWorkspaceURL').mockReturnValue(new URL('https://sub.twenty.com'));
            jest.spyOn(twentyConfigService, 'get').mockImplementation((key)=>{
                if (key === 'EMAIL_FROM_ADDRESS') return 'no-reply@example.com';
                if (key === 'SERVER_URL') return 'https://api.example.com';
            });
            await service.sendApprovedAccessDomainValidationEmail(sender, email, workspace, approvedAccessDomain);
            expect(workspaceDomainsService.buildWorkspaceURL).toHaveBeenCalledWith({
                workspace: workspace,
                pathname: (0, _utils.getSettingsPath)(_types.SettingsPath.Domains),
                searchParams: {
                    validationToken: expect.any(String)
                }
            });
            expect(emailService.send).toHaveBeenCalledWith({
                from: 'John Doe (via Twenty) <no-reply@example.com>',
                to: email,
                subject: 'Approve your access domain',
                text: expect.any(String),
                html: expect.any(String)
            });
        });
    });
    describe('validateApprovedAccessDomain', ()=>{
        it('should validate the approved access domain successfully with a correct token', async ()=>{
            const approvedAccessDomainId = 'domain-id';
            const validationToken = 'valid-token';
            const approvedAccessDomain = {
                id: approvedAccessDomainId,
                domain: 'example.com',
                isValidated: false
            };
            jest.spyOn(approvedAccessDomainRepository, 'findOneBy').mockResolvedValue(approvedAccessDomain);
            jest.spyOn(service, 'generateUniqueHash').mockReturnValue(validationToken);
            const saveSpy = jest.spyOn(approvedAccessDomainRepository, 'save');
            await service.validateApprovedAccessDomain({
                validationToken,
                approvedAccessDomainId: approvedAccessDomainId
            });
            expect(approvedAccessDomainRepository.findOneBy).toHaveBeenCalledWith({
                id: approvedAccessDomainId
            });
            expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({
                isValidated: true
            }));
        });
        it('should throw an error if the approved access domain does not exist', async ()=>{
            const approvedAccessDomainId = 'invalid-domain-id';
            const validationToken = 'valid-token';
            jest.spyOn(approvedAccessDomainRepository, 'findOneBy').mockResolvedValue(null);
            await expect(service.validateApprovedAccessDomain({
                validationToken,
                approvedAccessDomainId: approvedAccessDomainId
            })).rejects.toThrowError(new _approvedaccessdomainexception.ApprovedAccessDomainException('Approved access domain not found', _approvedaccessdomainexception.ApprovedAccessDomainExceptionCode.APPROVED_ACCESS_DOMAIN_NOT_FOUND));
        });
        it('should throw an error if the validation token is invalid', async ()=>{
            const approvedAccessDomainId = 'domain-id';
            const validationToken = 'invalid-token';
            const approvedAccessDomain = {
                id: approvedAccessDomainId,
                domain: 'example.com',
                isValidated: false
            };
            jest.spyOn(approvedAccessDomainRepository, 'findOneBy').mockResolvedValue(approvedAccessDomain);
            jest.spyOn(service, 'generateUniqueHash').mockReturnValue('valid-token');
            await expect(service.validateApprovedAccessDomain({
                validationToken,
                approvedAccessDomainId: approvedAccessDomainId
            })).rejects.toThrowError(new _approvedaccessdomainexception.ApprovedAccessDomainException('Invalid approved access domain validation token', _approvedaccessdomainexception.ApprovedAccessDomainExceptionCode.APPROVED_ACCESS_DOMAIN_VALIDATION_TOKEN_INVALID));
        });
        it('should throw an error if the approved access domain is already validated', async ()=>{
            const approvedAccessDomainId = 'domain-id';
            const validationToken = 'valid-token';
            const approvedAccessDomain = {
                id: approvedAccessDomainId,
                domain: 'example.com',
                isValidated: true
            };
            jest.spyOn(approvedAccessDomainRepository, 'findOneBy').mockResolvedValue(approvedAccessDomain);
            await expect(service.validateApprovedAccessDomain({
                validationToken,
                approvedAccessDomainId: approvedAccessDomainId
            })).rejects.toThrowError(new _approvedaccessdomainexception.ApprovedAccessDomainException('Approved access domain has already been validated', _approvedaccessdomainexception.ApprovedAccessDomainExceptionCode.APPROVED_ACCESS_DOMAIN_ALREADY_VALIDATED));
        });
    });
});

//# sourceMappingURL=approved-access-domain.spec.js.map