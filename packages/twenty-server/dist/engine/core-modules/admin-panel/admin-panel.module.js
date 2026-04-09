"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelModule", {
    enumerable: true,
    get: function() {
        return AdminPanelModule;
    }
});
const _common = require("@nestjs/common");
const _terminus = require("@nestjs/terminus");
const _typeorm = require("@nestjs/typeorm");
const _adminpanelhealthservice = require("./admin-panel-health.service");
const _adminpanelqueueservice = require("./admin-panel-queue.service");
const _adminpanelresolver = require("./admin-panel.resolver");
const _adminpanelservice = require("./admin-panel.service");
const _applicationregistrationmodule = require("../application/application-registration/application-registration.module");
const _auditmodule = require("../audit/audit.module");
const _authmodule = require("../auth/auth.module");
const _workspacedomainsmodule = require("../domain/workspace-domains/workspace-domains.module");
const _featureflagmodule = require("../feature-flag/feature-flag.module");
const _filemodule = require("../file/file.module");
const _apphealth = require("./indicators/app.health");
const _connectedaccounthealth = require("./indicators/connected-account.health");
const _databasehealth = require("./indicators/database.health");
const _redishealth = require("./indicators/redis.health");
const _workerhealth = require("./indicators/worker.health");
const _impersonationmodule = require("../impersonation/impersonation.module");
const _metricsmodule = require("../metrics/metrics.module");
const _redisclientmodule = require("../redis-client/redis-client.module");
const _securehttpclientmodule = require("../secure-http-client/secure-http-client.module");
const _telemetrymodule = require("../telemetry/telemetry.module");
const _usagemodule = require("../usage/usage.module");
const _userentity = require("../user/user.entity");
const _workspaceentity = require("../workspace/workspace.entity");
const _permissionsmodule = require("../../metadata-modules/permissions/permissions.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AdminPanelModule = class AdminPanelModule {
};
AdminPanelModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _userentity.UserEntity,
                _workspaceentity.WorkspaceEntity
            ]),
            _authmodule.AuthModule,
            _filemodule.FileModule,
            _workspacedomainsmodule.WorkspaceDomainsModule,
            _redisclientmodule.RedisClientModule,
            _terminus.TerminusModule,
            _metricsmodule.MetricsModule,
            _featureflagmodule.FeatureFlagModule,
            _auditmodule.AuditModule,
            _telemetrymodule.TelemetryModule,
            _impersonationmodule.ImpersonationModule,
            _permissionsmodule.PermissionsModule,
            _securehttpclientmodule.SecureHttpClientModule,
            _applicationregistrationmodule.ApplicationRegistrationModule,
            _usagemodule.UsageModule
        ],
        providers: [
            _adminpanelresolver.AdminPanelResolver,
            _adminpanelservice.AdminPanelService,
            _adminpanelhealthservice.AdminPanelHealthService,
            _adminpanelqueueservice.AdminPanelQueueService,
            _databasehealth.DatabaseHealthIndicator,
            _redishealth.RedisHealthIndicator,
            _workerhealth.WorkerHealthIndicator,
            _connectedaccounthealth.ConnectedAccountHealth,
            _apphealth.AppHealthIndicator
        ],
        exports: [
            _adminpanelservice.AdminPanelService
        ]
    })
], AdminPanelModule);

//# sourceMappingURL=admin-panel.module.js.map