"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get LogicFunctionExecutionException () {
        return LogicFunctionExecutionException;
    },
    get LogicFunctionExecutionExceptionCode () {
        return LogicFunctionExecutionExceptionCode;
    },
    get LogicFunctionExecutorService () {
        return LogicFunctionExecutorService;
    }
});
const _common = require("@nestjs/common");
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _auditservice = require("../../audit/services/audit.service");
const _logicfunctionexecuted = require("../../audit/utils/events/workspace-event/logic-function/logic-function-executed");
const _applicationtokenservice = require("../../auth/token/services/application-token.service");
const _logicfunctiondriverfactory = require("../logic-function-drivers/logic-function-driver.factory");
const _buildenvvar = require("./utils/build-env-var");
const _secretencryptionservice = require("../../secret-encryption/secret-encryption.service");
const _throttlerservice = require("../../throttler/throttler.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _findflatentitybyidinflatentitymapsutil = require("../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _subscriptionchannelenum = require("../../../subscriptions/enums/subscription-channel.enum");
const _subscriptionservice = require("../../../subscriptions/subscription.service");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
const _cleanserverurl = require("../../../../utils/clean-server-url");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LogicFunctionExecutionException = class LogicFunctionExecutionException extends Error {
    constructor(message, code){
        super(message), this.code = code;
        this.name = 'LogicFunctionExecutionException';
    }
};
var LogicFunctionExecutionExceptionCode = /*#__PURE__*/ function(LogicFunctionExecutionExceptionCode) {
    LogicFunctionExecutionExceptionCode["LOGIC_FUNCTION_NOT_FOUND"] = "LOGIC_FUNCTION_NOT_FOUND";
    LogicFunctionExecutionExceptionCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    return LogicFunctionExecutionExceptionCode;
}({});
let LogicFunctionExecutorService = class LogicFunctionExecutorService {
    async execute({ logicFunctionId, workspaceId, payload }) {
        await this.throttleExecution(workspaceId);
        const { flatApplication, flatLogicFunction, flatApplicationVariables } = await this.getFlatEntitiesOrThrow({
            workspaceId,
            logicFunctionId
        });
        const envVariables = await this.getExecutionEnvVariables({
            workspaceId,
            flatApplication,
            flatApplicationVariables,
            _flatLogicFunction: flatLogicFunction
        });
        const driver = this.logicFunctionDriverFactory.getCurrentDriver();
        const resultLogicFunction = await driver.execute({
            flatLogicFunction,
            flatApplication,
            applicationUniversalIdentifier: flatApplication.universalIdentifier,
            payload,
            env: envVariables,
            timeoutMs: flatLogicFunction.timeoutSeconds * 1_000
        });
        await this.handleExecutionResult({
            result: resultLogicFunction,
            flatApplication,
            flatLogicFunction,
            workspaceId
        });
        return resultLogicFunction;
    }
    async transpile(params) {
        const driver = this.logicFunctionDriverFactory.getCurrentDriver();
        return driver.transpile(params);
    }
    async throttleExecution(workspaceId) {
        try {
            await this.throttlerService.tokenBucketThrottleOrThrow(`${workspaceId}-logic-function-execution`, 1, this.twentyConfigService.get('LOGIC_FUNCTION_EXEC_THROTTLE_LIMIT'), this.twentyConfigService.get('LOGIC_FUNCTION_EXEC_THROTTLE_TTL'));
        } catch  {
            throw new LogicFunctionExecutionException('Logic function execution rate limit exceeded', "RATE_LIMIT_EXCEEDED");
        }
    }
    async getFlatEntitiesOrThrow({ workspaceId, logicFunctionId }) {
        const { flatLogicFunctionMaps, flatApplicationMaps, applicationVariableMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatLogicFunctionMaps',
            'flatApplicationMaps',
            'applicationVariableMaps'
        ]);
        const flatLogicFunction = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: logicFunctionId,
            flatEntityMaps: flatLogicFunctionMaps
        });
        if (!(0, _utils.isDefined)(flatLogicFunction) || (0, _utils.isDefined)(flatLogicFunction.deletedAt)) {
            throw new LogicFunctionExecutionException(`Logic function with id ${logicFunctionId} not found`, "LOGIC_FUNCTION_NOT_FOUND");
        }
        const flatApplication = (0, _utils.isDefined)(flatLogicFunction.applicationId) ? flatApplicationMaps.byId[flatLogicFunction.applicationId] : undefined;
        if (!(0, _utils.isDefined)(flatApplication)) {
            throw new LogicFunctionExecutionException(`Application not found for logic function ${logicFunctionId}`, "LOGIC_FUNCTION_NOT_FOUND");
        }
        const flatApplicationVariables = applicationVariableMaps.byApplicationId[flatApplication.id] ?? [];
        return {
            flatApplication,
            flatLogicFunction,
            flatApplicationVariables
        };
    }
    async getExecutionEnvVariables({ workspaceId, flatApplication, _flatLogicFunction, flatApplicationVariables }) {
        const applicationAccessToken = await this.applicationTokenService.generateApplicationAccessToken({
            workspaceId,
            applicationId: flatApplication.id
        });
        const baseUrl = (0, _cleanserverurl.cleanServerUrl)(this.twentyConfigService.get('SERVER_URL'));
        return {
            [_application.DEFAULT_API_URL_NAME]: baseUrl ?? '',
            [_application.DEFAULT_APP_ACCESS_TOKEN_NAME]: applicationAccessToken.token,
            [_application.DEFAULT_API_KEY_NAME]: applicationAccessToken.token,
            APPLICATION_ID: flatApplication.id,
            ...(0, _buildenvvar.buildEnvVar)(flatApplicationVariables, this.secretEncryptionService)
        };
    }
    async handleExecutionResult({ result, flatApplication, flatLogicFunction, workspaceId }) {
        if (this.twentyConfigService.get('LOGIC_FUNCTION_LOGS_ENABLED')) {
            /* oxlint-disable no-console */ console.log(result.logs);
        }
        await this.subscriptionService.publish({
            channel: _subscriptionchannelenum.SubscriptionChannel.LOGIC_FUNCTION_LOGS_CHANNEL,
            workspaceId,
            payload: {
                logicFunctionLogs: {
                    logs: result.logs,
                    id: flatLogicFunction.id,
                    name: flatLogicFunction.name,
                    universalIdentifier: flatLogicFunction.universalIdentifier,
                    applicationId: flatApplication.id,
                    applicationUniversalIdentifier: flatApplication.universalIdentifier
                }
            }
        });
        this.auditService.createContext({
            workspaceId
        }).insertWorkspaceEvent(_logicfunctionexecuted.LOGIC_FUNCTION_EXECUTED_EVENT, {
            duration: result.duration,
            status: result.status,
            ...result.error && {
                errorType: result.error.errorType
            },
            functionId: flatLogicFunction.id,
            functionName: flatLogicFunction.name
        });
    }
    constructor(logicFunctionDriverFactory, throttlerService, twentyConfigService, workspaceCacheService, applicationTokenService, secretEncryptionService, subscriptionService, auditService){
        this.logicFunctionDriverFactory = logicFunctionDriverFactory;
        this.throttlerService = throttlerService;
        this.twentyConfigService = twentyConfigService;
        this.workspaceCacheService = workspaceCacheService;
        this.applicationTokenService = applicationTokenService;
        this.secretEncryptionService = secretEncryptionService;
        this.subscriptionService = subscriptionService;
        this.auditService = auditService;
    }
};
LogicFunctionExecutorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _logicfunctiondriverfactory.LogicFunctionDriverFactory === "undefined" ? Object : _logicfunctiondriverfactory.LogicFunctionDriverFactory,
        typeof _throttlerservice.ThrottlerService === "undefined" ? Object : _throttlerservice.ThrottlerService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _applicationtokenservice.ApplicationTokenService === "undefined" ? Object : _applicationtokenservice.ApplicationTokenService,
        typeof _secretencryptionservice.SecretEncryptionService === "undefined" ? Object : _secretencryptionservice.SecretEncryptionService,
        typeof _subscriptionservice.SubscriptionService === "undefined" ? Object : _subscriptionservice.SubscriptionService,
        typeof _auditservice.AuditService === "undefined" ? Object : _auditservice.AuditService
    ])
], LogicFunctionExecutorService);

//# sourceMappingURL=logic-function-executor.service.js.map