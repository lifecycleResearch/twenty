"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LogicFunctionExecutorModule", {
    enumerable: true,
    get: function() {
        return LogicFunctionExecutorModule;
    }
});
const _common = require("@nestjs/common");
const _logicfunctionexecutorservice = require("./logic-function-executor.service");
const _throttlermodule = require("../../throttler/throttler.module");
const _auditmodule = require("../../audit/audit.module");
const _tokenmodule = require("../../auth/token/token.module");
const _secretencryptionmodule = require("../../secret-encryption/secret-encryption.module");
const _subscriptionsmodule = require("../../../subscriptions/subscriptions.module");
const _workspacecachemodule = require("../../../workspace-cache/workspace-cache.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LogicFunctionExecutorModule = class LogicFunctionExecutorModule {
};
LogicFunctionExecutorModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _throttlermodule.ThrottlerModule,
            _auditmodule.AuditModule,
            _tokenmodule.TokenModule,
            _secretencryptionmodule.SecretEncryptionModule,
            _subscriptionsmodule.SubscriptionsModule,
            _workspacecachemodule.WorkspaceCacheModule
        ],
        providers: [
            _logicfunctionexecutorservice.LogicFunctionExecutorService
        ],
        exports: [
            _logicfunctionexecutorservice.LogicFunctionExecutorService
        ]
    })
], LogicFunctionExecutorModule);

//# sourceMappingURL=logic-function-executor.module.js.map