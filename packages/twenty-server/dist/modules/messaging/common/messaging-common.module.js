"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingCommonModule", {
    enumerable: true,
    get: function() {
        return MessagingCommonModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _featureflagentity = require("../../../engine/core-modules/feature-flag/feature-flag.entity");
const _metricsmodule = require("../../../engine/core-modules/metrics/metrics.module");
const _connectedaccountdataaccessmodule = require("../../../engine/metadata-modules/connected-account/data-access/connected-account-data-access.module");
const _messagechanneldataaccessmodule = require("../../../engine/metadata-modules/message-channel/data-access/message-channel-data-access.module");
const _messagefolderdataaccessmodule = require("../../../engine/metadata-modules/message-folder/data-access/message-folder-data-access.module");
const _workspacedatasourcemodule = require("../../../engine/workspace-datasource/workspace-datasource.module");
const _connectedaccountmodule = require("../../connected-account/connected-account.module");
const _messagechannelsyncstatusservice = require("./services/message-channel-sync-status.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MessagingCommonModule = class MessagingCommonModule {
};
MessagingCommonModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _workspacedatasourcemodule.WorkspaceDataSourceModule,
            _typeorm.TypeOrmModule.forFeature([
                _featureflagentity.FeatureFlagEntity
            ]),
            _connectedaccountmodule.ConnectedAccountModule,
            _connectedaccountdataaccessmodule.ConnectedAccountDataAccessModule,
            _messagechanneldataaccessmodule.MessageChannelDataAccessModule,
            _messagefolderdataaccessmodule.MessageFolderDataAccessModule,
            _metricsmodule.MetricsModule
        ],
        providers: [
            _messagechannelsyncstatusservice.MessageChannelSyncStatusService
        ],
        exports: [
            _messagechannelsyncstatusservice.MessageChannelSyncStatusService
        ]
    })
], MessagingCommonModule);

//# sourceMappingURL=messaging-common.module.js.map