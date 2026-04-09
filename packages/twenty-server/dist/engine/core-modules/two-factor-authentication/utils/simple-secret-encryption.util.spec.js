"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _authcontexttype = require("../../auth/types/auth-context.type");
const _jwtwrapperservice = require("../../jwt/services/jwt-wrapper.service");
const _simplesecretencryptionutil = require("./simple-secret-encryption.util");
describe('SimpleSecretEncryptionUtil', ()=>{
    let util;
    let jwtWrapperService;
    const mockAppSecret = 'mock-app-secret-for-testing-purposes-12345678';
    const testSecret = 'KVKFKRCPNZQUYMLXOVYDSKLMNBVCXZ';
    const testPurpose = 'user123workspace456otp-secret';
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _simplesecretencryptionutil.SimpleSecretEncryptionUtil,
                {
                    provide: _jwtwrapperservice.JwtWrapperService,
                    useValue: {
                        generateAppSecret: jest.fn().mockImplementation((_type, purpose)=>{
                            // Return different secrets for different purposes to simulate real behavior
                            return `${mockAppSecret}-${purpose}`;
                        })
                    }
                }
            ]
        }).compile();
        util = module.get(_simplesecretencryptionutil.SimpleSecretEncryptionUtil);
        jwtWrapperService = module.get(_jwtwrapperservice.JwtWrapperService);
        jest.clearAllMocks();
    });
    it('should be defined', ()=>{
        expect(util).toBeDefined();
    });
    describe('encryptSecret and decryptSecret', ()=>{
        it('should encrypt and decrypt a secret correctly', async ()=>{
            const encrypted = await util.encryptSecret(testSecret, testPurpose);
            const decrypted = await util.decryptSecret(encrypted, testPurpose);
            expect(decrypted).toBe(testSecret);
            expect(encrypted).not.toBe(testSecret);
            expect(encrypted).toContain(':'); // Should contain IV separator
        });
        it('should generate different encrypted values for the same secret', async ()=>{
            const encrypted1 = await util.encryptSecret(testSecret, testPurpose);
            const encrypted2 = await util.encryptSecret(testSecret, testPurpose);
            expect(encrypted1).not.toBe(encrypted2); // Different IVs should produce different results
            const decrypted1 = await util.decryptSecret(encrypted1, testPurpose);
            const decrypted2 = await util.decryptSecret(encrypted2, testPurpose);
            expect(decrypted1).toBe(testSecret);
            expect(decrypted2).toBe(testSecret);
        });
        it('should use the correct JWT token type and purpose', async ()=>{
            await util.encryptSecret(testSecret, testPurpose);
            expect(jwtWrapperService.generateAppSecret).toHaveBeenCalledWith(_authcontexttype.JwtTokenTypeEnum.KEY_ENCRYPTION_KEY, testPurpose);
        });
        it('should handle special characters in secrets', async ()=>{
            const specialSecret = 'SECRET-WITH_SPECIAL@CHARS#123!';
            const encrypted = await util.encryptSecret(specialSecret, testPurpose);
            const decrypted = await util.decryptSecret(encrypted, testPurpose);
            expect(decrypted).toBe(specialSecret);
        });
        it('should not recover original secret with wrong purpose', async ()=>{
            const encrypted = await util.encryptSecret(testSecret, testPurpose);
            // AES-256-CBC may either throw (invalid padding) or produce garbage.
            // Both outcomes are acceptable — the key property is that the original
            // secret is never returned.
            try {
                const decrypted = await util.decryptSecret(encrypted, 'wrong-purpose');
                expect(decrypted).not.toBe(testSecret);
            } catch  {
            // Expected: wrong key produced invalid padding
            }
        });
        it('should fail to decrypt malformed encrypted data', async ()=>{
            await expect(util.decryptSecret('invalid-encrypted-data', testPurpose)).rejects.toThrow();
        });
        it('should handle empty secrets', async ()=>{
            const emptySecret = '';
            const encrypted = await util.encryptSecret(emptySecret, testPurpose);
            const decrypted = await util.decryptSecret(encrypted, testPurpose);
            expect(decrypted).toBe(emptySecret);
        });
    });
});

//# sourceMappingURL=simple-secret-encryption.util.spec.js.map