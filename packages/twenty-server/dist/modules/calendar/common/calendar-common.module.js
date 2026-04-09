"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarCommonModule", {
    enumerable: true,
    get: function() {
        return CalendarCommonModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _featureflagentity = require("../../../engine/core-modules/feature-flag/feature-flag.entity");
const _metricsmodule = require("../../../engine/core-modules/metrics/metrics.module");
const _calendarchanneldataaccessmodule = require("../../../engine/metadata-modules/calendar-channel/data-access/calendar-channel-data-access.module");
const _connectedaccountdataaccessmodule = require("../../../engine/metadata-modules/connected-account/data-access/connected-account-data-access.module");
const _workspacedatasourcemodule = require("../../../engine/workspace-datasource/workspace-datasource.module");
const _calendarchannelsyncstatusservice = require("./services/calendar-channel-sync-status.service");
const _connectedaccountmodule = require("../../connected-account/connected-account.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CalendarCommonModule = class CalendarCommonModule {
};
CalendarCommonModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _workspacedatasourcemodule.WorkspaceDataSourceModule,
            _typeorm.TypeOrmModule.forFeature([
                _featureflagentity.FeatureFlagEntity
            ]),
            _connectedaccountmodule.ConnectedAccountModule,
            _calendarchanneldataaccessmodule.CalendarChannelDataAccessModule,
            _connectedaccountdataaccessmodule.ConnectedAccountDataAccessModule,
            _metricsmodule.MetricsModule
        ],
        providers: [
            _calendarchannelsyncstatusservice.CalendarChannelSyncStatusService
        ],
        exports: [
            _calendarchannelsyncstatusservice.CalendarChannelSyncStatusService
        ]
    })
], CalendarCommonModule);

//# sourceMappingURL=calendar-common.module.js.map