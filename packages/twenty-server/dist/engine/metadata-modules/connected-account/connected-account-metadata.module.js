"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountMetadataModule", {
    enumerable: true,
    get: function() {
        return ConnectedAccountMetadataModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _featureflagmodule = require("../../core-modules/feature-flag/feature-flag.module");
const _connectedaccountmetadataservice = require("./connected-account-metadata.service");
const _connectedaccountentity = require("./entities/connected-account.entity");
const _connectedaccountgraphqlapiexceptioninterceptor = require("./interceptors/connected-account-graphql-api-exception.interceptor");
const _connectedaccountresolver = require("./resolvers/connected-account.resolver");
const _permissionsmodule = require("../permissions/permissions.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ConnectedAccountMetadataModule = class ConnectedAccountMetadataModule {
};
ConnectedAccountMetadataModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _connectedaccountentity.ConnectedAccountEntity
            ]),
            _permissionsmodule.PermissionsModule,
            _featureflagmodule.FeatureFlagModule
        ],
        providers: [
            _connectedaccountmetadataservice.ConnectedAccountMetadataService,
            _connectedaccountresolver.ConnectedAccountResolver,
            _connectedaccountgraphqlapiexceptioninterceptor.ConnectedAccountGraphqlApiExceptionInterceptor
        ],
        exports: [
            _connectedaccountmetadataservice.ConnectedAccountMetadataService
        ]
    })
], ConnectedAccountMetadataModule);

//# sourceMappingURL=connected-account-metadata.module.js.map