"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdateConnectedAccountOnReconnectService", {
    enumerable: true,
    get: function() {
        return UpdateConnectedAccountOnReconnectService;
    }
});
const _common = require("@nestjs/common");
const _connectedaccountdataaccessservice = require("../../../metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../twenty-orm/utils/build-system-auth-context.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UpdateConnectedAccountOnReconnectService = class UpdateConnectedAccountOnReconnectService {
    async updateConnectedAccountOnReconnect(input) {
        const { workspaceId, connectedAccountId, accessToken, refreshToken, scopes } = input;
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            await this.connectedAccountDataAccessService.update(workspaceId, {
                id: connectedAccountId
            }, {
                accessToken,
                refreshToken,
                scopes,
                authFailedAt: null
            });
        }, authContext);
    }
    constructor(globalWorkspaceOrmManager, connectedAccountDataAccessService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.connectedAccountDataAccessService = connectedAccountDataAccessService;
    }
};
UpdateConnectedAccountOnReconnectService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _connectedaccountdataaccessservice.ConnectedAccountDataAccessService === "undefined" ? Object : _connectedaccountdataaccessservice.ConnectedAccountDataAccessService
    ])
], UpdateConnectedAccountOnReconnectService);

//# sourceMappingURL=update-connected-account-on-reconnect.service.js.map