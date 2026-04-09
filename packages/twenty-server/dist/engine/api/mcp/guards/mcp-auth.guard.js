"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "McpAuthGuard", {
    enumerable: true,
    get: function() {
        return McpAuthGuard;
    }
});
const _common = require("@nestjs/common");
const _twentyconfigservice = require("../../../core-modules/twenty-config/twenty-config.service");
const _jwtauthguard = require("../../../guards/jwt-auth.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let McpAuthGuard = class McpAuthGuard {
    async canActivate(context) {
        const isAuthenticated = await this.jwtAuthGuard.canActivate(context);
        if (!isAuthenticated) {
            const serverUrl = this.twentyConfigService.get('SERVER_URL');
            const resourceMetadataUrl = `${serverUrl}/.well-known/oauth-protected-resource`;
            // Set the header on the response before throwing, because exception
            // filters may not preserve custom headers from the exception payload.
            const response = context.switchToHttp().getResponse();
            response.setHeader('WWW-Authenticate', `Bearer resource_metadata="${resourceMetadataUrl}"`);
            throw new _common.UnauthorizedException();
        }
        return true;
    }
    constructor(jwtAuthGuard, twentyConfigService){
        this.jwtAuthGuard = jwtAuthGuard;
        this.twentyConfigService = twentyConfigService;
    }
};
McpAuthGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwtauthguard.JwtAuthGuard === "undefined" ? Object : _jwtauthguard.JwtAuthGuard,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], McpAuthGuard);

//# sourceMappingURL=mcp-auth.guard.js.map