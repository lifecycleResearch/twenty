"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _applicationvariableentity = require("../application-variable.entity");
const _applicationvariableexception = require("../application-variable.exception");
const _applicationvariableservice = require("../application-variable.service");
const _secretapplicationvariablemaskconstant = require("../constants/secret-application-variable-mask.constant");
const _secretencryptionservice = require("../../../secret-encryption/secret-encryption.service");
const _workspacecacheservice = require("../../../../workspace-cache/services/workspace-cache.service");
describe('ApplicationVariableEntityService', ()=>{
    let service;
    let repository;
    let secretEncryptionService;
    let workspaceCacheService;
    const mockWorkspaceId = 'workspace-123';
    const mockApplicationId = 'app-456';
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _applicationvariableservice.ApplicationVariableEntityService,
                {
                    provide: (0, _typeorm.getRepositoryToken)(_applicationvariableentity.ApplicationVariableEntity),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        save: jest.fn(),
                        delete: jest.fn()
                    }
                },
                {
                    provide: _secretencryptionservice.SecretEncryptionService,
                    useValue: {
                        encrypt: jest.fn((value)=>`encrypted_${value}`),
                        decrypt: jest.fn((value)=>value.replace('encrypted_', '')),
                        decryptAndMask: jest.fn(({ value: _value, mask: _mask })=>'********')
                    }
                },
                {
                    provide: _workspacecacheservice.WorkspaceCacheService,
                    useValue: {
                        invalidateAndRecompute: jest.fn()
                    }
                }
            ]
        }).compile();
        service = module.get(_applicationvariableservice.ApplicationVariableEntityService);
        repository = module.get((0, _typeorm.getRepositoryToken)(_applicationvariableentity.ApplicationVariableEntity));
        secretEncryptionService = module.get(_secretencryptionservice.SecretEncryptionService);
        workspaceCacheService = module.get(_workspacecacheservice.WorkspaceCacheService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
    describe('update', ()=>{
        it('should encrypt value when variable is secret', async ()=>{
            const existingVariable = {
                id: '1',
                key: 'API_KEY',
                value: 'old-encrypted-value',
                isSecret: true,
                applicationId: mockApplicationId
            };
            repository.findOne.mockResolvedValue(existingVariable);
            repository.update.mockResolvedValue({
                affected: 1
            });
            await service.update({
                key: 'API_KEY',
                plainTextValue: 'new-secret-value',
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId
            });
            expect(secretEncryptionService.encrypt).toHaveBeenCalledWith('new-secret-value');
            expect(repository.update).toHaveBeenCalledWith({
                key: 'API_KEY',
                applicationId: mockApplicationId
            }, {
                value: 'encrypted_new-secret-value'
            });
            expect(workspaceCacheService.invalidateAndRecompute).toHaveBeenCalledWith(mockWorkspaceId, [
                'applicationVariableMaps'
            ]);
        });
        it('should not encrypt value when variable is not secret', async ()=>{
            const existingVariable = {
                id: '1',
                key: 'PUBLIC_URL',
                value: 'https://old-url.com',
                isSecret: false,
                applicationId: mockApplicationId
            };
            repository.findOne.mockResolvedValue(existingVariable);
            repository.update.mockResolvedValue({
                affected: 1
            });
            await service.update({
                key: 'PUBLIC_URL',
                plainTextValue: 'https://new-url.com',
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId
            });
            expect(secretEncryptionService.encrypt).not.toHaveBeenCalled();
            expect(repository.update).toHaveBeenCalledWith({
                key: 'PUBLIC_URL',
                applicationId: mockApplicationId
            }, {
                value: 'https://new-url.com'
            });
        });
        it('should throw exception when variable not found', async ()=>{
            repository.findOne.mockResolvedValue(null);
            await expect(service.update({
                key: 'NON_EXISTENT',
                plainTextValue: 'some-value',
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId
            })).rejects.toThrow(_applicationvariableexception.ApplicationVariableEntityException);
            await expect(service.update({
                key: 'NON_EXISTENT',
                plainTextValue: 'some-value',
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId
            })).rejects.toMatchObject({
                code: _applicationvariableexception.ApplicationVariableEntityExceptionCode.APPLICATION_VARIABLE_NOT_FOUND
            });
        });
    });
    describe('upsertManyApplicationVariableEntities', ()=>{
        it('should encrypt secret values when creating new variables', async ()=>{
            repository.find.mockResolvedValue([]);
            repository.save.mockResolvedValue({});
            repository.delete.mockResolvedValue({
                affected: 0
            });
            await service.upsertManyApplicationVariableEntities({
                applicationVariables: {
                    SECRET_KEY: {
                        universalIdentifier: 'secret-key-123',
                        value: 'my-secret',
                        description: 'A secret key',
                        isSecret: true
                    }
                },
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId
            });
            expect(secretEncryptionService.encrypt).toHaveBeenCalledWith('my-secret');
            expect(repository.save).toHaveBeenCalledWith([
                {
                    key: 'SECRET_KEY',
                    value: 'encrypted_my-secret',
                    description: 'A secret key',
                    isSecret: true,
                    applicationId: mockApplicationId
                }
            ]);
        });
        it('should not encrypt non-secret values when creating new variables', async ()=>{
            repository.find.mockResolvedValue([]);
            repository.save.mockResolvedValue({});
            repository.delete.mockResolvedValue({
                affected: 0
            });
            await service.upsertManyApplicationVariableEntities({
                applicationVariables: {
                    PUBLIC_URL: {
                        universalIdentifier: 'public-url-123',
                        value: 'https://example.com',
                        description: 'Public URL',
                        isSecret: false
                    }
                },
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId
            });
            expect(secretEncryptionService.encrypt).not.toHaveBeenCalled();
            expect(repository.save).toHaveBeenCalledWith([
                {
                    key: 'PUBLIC_URL',
                    value: 'https://example.com',
                    description: 'Public URL',
                    isSecret: false,
                    applicationId: mockApplicationId
                }
            ]);
        });
        it('should handle undefined isSecret as false', async ()=>{
            repository.find.mockResolvedValue([]);
            repository.save.mockResolvedValue({});
            repository.delete.mockResolvedValue({
                affected: 0
            });
            await service.upsertManyApplicationVariableEntities({
                applicationVariables: {
                    SOME_VAR: {
                        universalIdentifier: 'some-var-123',
                        value: 'some-value',
                        description: 'Some variable'
                    }
                },
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId
            });
            expect(secretEncryptionService.encrypt).not.toHaveBeenCalled();
            expect(repository.save).toHaveBeenCalledWith([
                expect.objectContaining({
                    isSecret: false
                })
            ]);
        });
        it('should update existing variables without changing values', async ()=>{
            const existingVariable = {
                id: '1',
                key: 'EXISTING_VAR',
                value: 'existing-encrypted-value',
                isSecret: true,
                applicationId: mockApplicationId
            };
            repository.find.mockResolvedValue([
                existingVariable
            ]);
            repository.save.mockResolvedValue({});
            repository.delete.mockResolvedValue({
                affected: 0
            });
            await service.upsertManyApplicationVariableEntities({
                applicationVariables: {
                    EXISTING_VAR: {
                        universalIdentifier: 'existing-var-123',
                        value: 'new-value',
                        description: 'Updated description',
                        isSecret: true
                    }
                },
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId
            });
            expect(repository.save).toHaveBeenCalledWith([
                {
                    id: '1',
                    description: 'Updated description',
                    isSecret: true
                }
            ]);
            expect(repository.update).not.toHaveBeenCalled();
        });
        it('should update existing value when shouldUpdateValue is true', async ()=>{
            const existingVariable = {
                id: '1',
                key: 'EXISTING_VAR',
                value: 'existing-encrypted-value',
                isSecret: true,
                applicationId: mockApplicationId
            };
            repository.find.mockResolvedValue([
                existingVariable
            ]);
            repository.save.mockResolvedValue({});
            repository.delete.mockResolvedValue({
                affected: 0
            });
            await service.upsertManyApplicationVariableEntities({
                applicationVariables: {
                    EXISTING_VAR: {
                        universalIdentifier: 'existing-var-123',
                        value: 'new-value',
                        description: 'Updated description',
                        isSecret: true
                    }
                },
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId,
                shouldUpdateValue: true
            });
            expect(repository.save).toHaveBeenCalledWith([
                {
                    id: '1',
                    description: 'Updated description',
                    value: 'encrypted_new-value',
                    isSecret: true
                }
            ]);
        });
        it('should update existing value if isSecret changes', async ()=>{
            const existingVariable = {
                id: '1',
                key: 'EXISTING_VAR',
                value: 'existing-encrypted-value',
                isSecret: true,
                applicationId: mockApplicationId
            };
            repository.find.mockResolvedValue([
                existingVariable
            ]);
            repository.save.mockResolvedValue({});
            repository.delete.mockResolvedValue({
                affected: 0
            });
            await service.upsertManyApplicationVariableEntities({
                applicationVariables: {
                    EXISTING_VAR: {
                        universalIdentifier: 'existing-var-123',
                        value: 'new-value',
                        description: 'Updated description',
                        isSecret: false
                    }
                },
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId
            });
            expect(repository.save).toHaveBeenCalledWith([
                {
                    id: '1',
                    description: 'Updated description',
                    value: 'new-value',
                    isSecret: false
                }
            ]);
            expect(repository.update).not.toHaveBeenCalled();
        });
        it('should handle undefined applicationVariables', async ()=>{
            await service.upsertManyApplicationVariableEntities({
                applicationVariables: undefined,
                applicationId: mockApplicationId,
                workspaceId: mockWorkspaceId
            });
            expect(repository.find).not.toHaveBeenCalled();
            expect(repository.save).not.toHaveBeenCalled();
            expect(repository.update).not.toHaveBeenCalled();
            expect(workspaceCacheService.invalidateAndRecompute).not.toHaveBeenCalled();
        });
    });
    describe('getDisplayValue', ()=>{
        it('should return plain value for non-secret variables', ()=>{
            const variable = {
                id: '1',
                key: 'PUBLIC_URL',
                value: 'https://example.com',
                isSecret: false,
                applicationId: mockApplicationId
            };
            const result = service.getDisplayValue(variable);
            expect(result).toBe('https://example.com');
            expect(secretEncryptionService.decryptAndMask).not.toHaveBeenCalled();
        });
        it('should call decryptAndMask for secret variables', ()=>{
            const variable = {
                id: '1',
                key: 'SECRET_KEY',
                value: 'encrypted_value',
                isSecret: true,
                applicationId: mockApplicationId
            };
            service.getDisplayValue(variable);
            expect(secretEncryptionService.decryptAndMask).toHaveBeenCalledWith({
                value: 'encrypted_value',
                mask: _secretapplicationvariablemaskconstant.SECRET_APPLICATION_VARIABLE_MASK
            });
        });
    });
});

//# sourceMappingURL=application-variable.service.spec.js.map