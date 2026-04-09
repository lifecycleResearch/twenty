"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtWrapperService", {
    enumerable: true,
    get: function() {
        return JwtWrapperService;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _crypto = require("crypto");
const _jsonwebtoken = /*#__PURE__*/ _interop_require_wildcard(require("jsonwebtoken"));
const _passportjwt = require("passport-jwt");
const _utils = require("twenty-shared/utils");
const _authexception = require("../../auth/auth.exception");
const _authcontexttype = require("../../auth/types/auth-context.type");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let JwtWrapperService = class JwtWrapperService {
    sign(payload, options) {
        // Typescript does not handle well the overloads of the sign method, helping it a little bit
        return this.jwtService.sign(payload, options);
    }
    // oxlint-disable-next-line @typescripttypescript/no-explicit-any
    verify(token, options) {
        return this.jwtService.verify(token, options);
    }
    // oxlint-disable-next-line @typescripttypescript/no-explicit-any
    decode(payload, options) {
        return this.jwtService.decode(payload, options);
    }
    verifyJwtToken(token, options) {
        const payload = this.decode(token, {
            json: true
        });
        if (!(0, _utils.isDefined)(payload)) {
            throw new _authexception.AuthException('No payload', _authexception.AuthExceptionCode.UNAUTHENTICATED);
        }
        const type = payload.type;
        const appSecretBody = 'workspaceId' in payload ? payload.workspaceId : 'userId' in payload ? payload.userId : undefined;
        if (!(0, _utils.isDefined)(appSecretBody)) {
            throw new _authexception.AuthException('Invalid token type', _authexception.AuthExceptionCode.INVALID_JWT_TOKEN_TYPE);
        }
        try {
            // API_KEY tokens created before 12/12/2025 were accidentally signed
            // with ACCESS type instead of API_KEY. Try the correct secret first,
            // fall back to the old one for backward compatibility.
            // See https://github.com/twentyhq/twenty/pull/16504
            if (type === _authcontexttype.JwtTokenTypeEnum.API_KEY) {
                try {
                    return this.jwtService.verify(token, {
                        ...options,
                        secret: this.generateAppSecret(type, appSecretBody)
                    });
                } catch  {
                    return this.jwtService.verify(token, {
                        ...options,
                        secret: this.generateAppSecret(_authcontexttype.JwtTokenTypeEnum.ACCESS, appSecretBody)
                    });
                }
            }
            return this.jwtService.verify(token, {
                ...options,
                secret: this.generateAppSecret(type, appSecretBody)
            });
        } catch (error) {
            if (error instanceof _jsonwebtoken.TokenExpiredError) {
                throw new _authexception.AuthException('Token has expired.', _authexception.AuthExceptionCode.UNAUTHENTICATED);
            }
            if (error instanceof _jsonwebtoken.JsonWebTokenError) {
                throw new _authexception.AuthException('Token invalid.', _authexception.AuthExceptionCode.UNAUTHENTICATED);
            }
            throw new _authexception.AuthException('Unknown token error.', _authexception.AuthExceptionCode.INVALID_INPUT);
        }
    }
    generateAppSecret(type, appSecretBody) {
        const appSecret = this.twentyConfigService.get('APP_SECRET');
        if (!appSecret) {
            throw new Error('APP_SECRET is not set');
        }
        return (0, _crypto.createHash)('sha256').update(`${appSecret}${appSecretBody}${type}`).digest('hex');
    }
    extractJwtFromRequest() {
        return (request)=>{
            // First try to extract token from Authorization header
            const tokenFromHeader = _passportjwt.ExtractJwt.fromAuthHeaderAsBearerToken()(request);
            if (tokenFromHeader) {
                return tokenFromHeader;
            }
            // If not found in header, try to extract from URL query parameter
            // This is for edge cases where we don't control the origin request
            // (e.g. the REST API playground)
            return _passportjwt.ExtractJwt.fromUrlQueryParameter('token')(request);
        };
    }
    constructor(jwtService, twentyConfigService){
        this.jwtService = jwtService;
        this.twentyConfigService = twentyConfigService;
    }
};
JwtWrapperService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], JwtWrapperService);

//# sourceMappingURL=jwt-wrapper.service.js.map