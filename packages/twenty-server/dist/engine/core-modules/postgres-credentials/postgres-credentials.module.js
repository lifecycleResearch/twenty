"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostgresCredentialsModule", {
    enumerable: true,
    get: function() {
        return PostgresCredentialsModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _jwtmodule = require("../jwt/jwt.module");
const _postgrescredentialsentity = require("./postgres-credentials.entity");
const _postgrescredentialsresolver = require("./postgres-credentials.resolver");
const _postgrescredentialsservice = require("./postgres-credentials.service");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let PostgresCredentialsModule = class PostgresCredentialsModule {
};
PostgresCredentialsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _jwtmodule.JwtModule,
            _typeorm.TypeOrmModule.forFeature([
                _postgrescredentialsentity.PostgresCredentialsEntity
            ]),
            _permissionsmodule.PermissionsModule
        ],
        providers: [
            _postgrescredentialsresolver.PostgresCredentialsResolver,
            _postgrescredentialsservice.PostgresCredentialsService,
            _postgrescredentialsentity.PostgresCredentialsEntity
        ]
    })
], PostgresCredentialsModule);

//# sourceMappingURL=postgres-credentials.module.js.map