"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _mcpauthguard = require("../mcp-auth.guard");
describe('McpAuthGuard', ()=>{
    let guard;
    let jwtAuthGuard;
    let twentyConfigService;
    const mockSetHeader = jest.fn();
    const mockContext = {
        switchToHttp: ()=>({
                getResponse: ()=>({
                        setHeader: mockSetHeader
                    }),
                getRequest: ()=>({})
            })
    };
    beforeEach(()=>{
        jwtAuthGuard = {
            canActivate: jest.fn()
        };
        twentyConfigService = {
            get: jest.fn().mockReturnValue('https://crm.example.com')
        };
        guard = new _mcpauthguard.McpAuthGuard(jwtAuthGuard, twentyConfigService);
        mockSetHeader.mockClear();
    });
    it('should return true when JwtAuthGuard passes', async ()=>{
        jwtAuthGuard.canActivate.mockResolvedValue(true);
        const result = await guard.canActivate(mockContext);
        expect(result).toBe(true);
        expect(mockSetHeader).not.toHaveBeenCalled();
    });
    it('should set WWW-Authenticate header and throw when auth fails', async ()=>{
        jwtAuthGuard.canActivate.mockResolvedValue(false);
        await expect(guard.canActivate(mockContext)).rejects.toThrow(_common.UnauthorizedException);
        expect(mockSetHeader).toHaveBeenCalledWith('WWW-Authenticate', 'Bearer resource_metadata="https://crm.example.com/.well-known/oauth-protected-resource"');
    });
});

//# sourceMappingURL=mcp-auth.guard.spec.js.map