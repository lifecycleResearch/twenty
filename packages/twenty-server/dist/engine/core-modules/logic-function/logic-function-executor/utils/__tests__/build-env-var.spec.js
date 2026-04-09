"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildenvvar = require("../build-env-var");
describe('buildEnvVar', ()=>{
    const mockSecretEncryptionService = {
        encrypt: jest.fn((value)=>`encrypted_${value}`),
        decrypt: jest.fn((value)=>value.replace('encrypted_', ''))
    };
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    it('should return empty object for empty array', ()=>{
        const result = (0, _buildenvvar.buildEnvVar)([], mockSecretEncryptionService);
        expect(result).toEqual({});
    });
    it('should handle mixed secret and non-secret variables', ()=>{
        const flatVariables = [
            {
                id: '1',
                key: 'PUBLIC_URL',
                value: 'https://example.com',
                description: 'Public URL',
                isSecret: false,
                applicationId: 'app-1',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            },
            {
                id: '2',
                key: 'API_SECRET',
                value: 'encrypted_secret-123',
                description: 'API secret',
                isSecret: true,
                applicationId: 'app-1',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            },
            {
                id: '3',
                key: 'DEBUG',
                value: 'true',
                description: 'Debug flag',
                isSecret: false,
                applicationId: 'app-1',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            }
        ];
        const result = (0, _buildenvvar.buildEnvVar)(flatVariables, mockSecretEncryptionService);
        expect(result).toEqual({
            PUBLIC_URL: 'https://example.com',
            API_SECRET: 'secret-123',
            DEBUG: 'true'
        });
        expect(mockSecretEncryptionService.decrypt).toHaveBeenCalledTimes(1);
        expect(mockSecretEncryptionService.decrypt).toHaveBeenCalledWith('encrypted_secret-123');
    });
    it('should handle null or undefined values', ()=>{
        const flatVariables = [
            {
                id: '1',
                key: 'NULL_VALUE',
                value: null,
                description: '',
                isSecret: false,
                applicationId: 'app-1',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            },
            {
                id: '2',
                key: 'UNDEFINED_VALUE',
                value: undefined,
                description: '',
                isSecret: false,
                applicationId: 'app-1',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            }
        ];
        const result = (0, _buildenvvar.buildEnvVar)(flatVariables, mockSecretEncryptionService);
        expect(result).toEqual({
            NULL_VALUE: '',
            UNDEFINED_VALUE: ''
        });
    });
    it('should convert non-string values to strings', ()=>{
        const flatVariables = [
            {
                id: '1',
                key: 'NUMBER_VALUE',
                value: 123,
                description: '',
                isSecret: false,
                applicationId: 'app-1',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z'
            }
        ];
        const result = (0, _buildenvvar.buildEnvVar)(flatVariables, mockSecretEncryptionService);
        expect(result).toEqual({
            NUMBER_VALUE: '123'
        });
    });
});

//# sourceMappingURL=build-env-var.spec.js.map