"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountDataAccessModule", {
    enumerable: true,
    get: function() {
        return ConnectedAccountDataAccessModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _featureflagmodule = require("../../../core-modules/feature-flag/feature-flag.module");
const _userworkspaceentity = require("../../../core-modules/user-workspace/user-workspace.entity");
const _connectedaccountdataaccessservice = require("./services/connected-account-data-access.service");
const _connectedaccountentity = require("../entities/connected-account.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ConnectedAccountDataAccessModule = class ConnectedAccountDataAccessModule {
};
ConnectedAccountDataAccessModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _connectedaccountentity.ConnectedAccountEntity,
                _userworkspaceentity.UserWorkspaceEntity
            ]),
            _featureflagmodule.FeatureFlagModule
        ],
        providers: [
            _connectedaccountdataaccessservice.ConnectedAccountDataAccessService
        ],
        exports: [
            _connectedaccountdataaccessservice.ConnectedAccountDataAccessService
        ]
    })
], ConnectedAccountDataAccessModule);

//# sourceMappingURL=connected-account-data-access.module.js.map