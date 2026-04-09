"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtModule", {
    enumerable: true,
    get: function() {
        return JwtModule;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _jwtwrapperservice = require("./services/jwt-wrapper.service");
const _twentyconfigmodule = require("../twenty-config/twenty-config.module");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const InternalJwtModule = _jwt.JwtModule.registerAsync({
    useFactory: async (twentyConfigService)=>{
        return {
            secret: twentyConfigService.get('APP_SECRET'),
            signOptions: {
                algorithm: 'HS256',
                expiresIn: twentyConfigService.get('ACCESS_TOKEN_EXPIRES_IN')
            },
            verifyOptions: {
                algorithms: [
                    'HS256'
                ]
            }
        };
    },
    inject: [
        _twentyconfigservice.TwentyConfigService
    ]
});
let JwtModule = class JwtModule {
};
JwtModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            InternalJwtModule,
            _twentyconfigmodule.TwentyConfigModule
        ],
        controllers: [],
        providers: [
            _jwtwrapperservice.JwtWrapperService
        ],
        exports: [
            _jwtwrapperservice.JwtWrapperService
        ]
    })
], JwtModule);

//# sourceMappingURL=jwt.module.js.map