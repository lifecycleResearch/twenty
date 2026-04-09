"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelResolver", {
    enumerable: true,
    get: function() {
        return AdminPanelResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _typeorm = require("@nestjs/typeorm");
const _graphqltypejson = /*#__PURE__*/ _interop_require_default(require("graphql-type-json"));
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _constants = require("twenty-shared/constants");
const _adminpanelhealthservice = require("./admin-panel-health.service");
const _adminpanelqueueservice = require("./admin-panel-queue.service");
const _adminpanelservice = require("./admin-panel.service");
const _applicationregistrationentity = require("../application/application-registration/application-registration.entity");
const _applicationregistrationservice = require("../application/application-registration/application-registration.service");
const _clientconfigentity = require("../client-config/client-config.entity");
const _usagebreakdownitemdto = require("../usage/dtos/usage-breakdown-item.dto");
const _usageanalyticsservice = require("../usage/services/usage-analytics.service");
const _aimodelroleenum = require("../../metadata-modules/ai/ai-models/types/ai-model-role.enum");
const _configvariabledto = require("./dtos/config-variable.dto");
const _configvariablesdto = require("./dtos/config-variables.dto");
const _deletejobsresponsedto = require("./dtos/delete-jobs-response.dto");
const _queuejobsresponsedto = require("./dtos/queue-jobs-response.dto");
const _retryjobsresponsedto = require("./dtos/retry-jobs-response.dto");
const _systemhealthdto = require("./dtos/system-health.dto");
const _updateworkspacefeatureflaginput = require("./dtos/update-workspace-feature-flag.input");
const _userlookupdto = require("./dtos/user-lookup.dto");
const _userlookupinput = require("./dtos/user-lookup.input");
const _versioninfodto = require("./dtos/version-info.dto");
const _jobstateenum = require("./enums/job-state.enum");
const _queuemetricstimerangeenum = require("./enums/queue-metrics-time-range.enum");
const _authgraphqlapiexceptionfilter = require("../auth/filters/auth-graphql-api-exception.filter");
const _featureflagexception = require("../feature-flag/feature-flag.exception");
const _featureflagservice = require("../feature-flag/services/feature-flag.service");
const _preventnesttoautologgraphqlerrorsfilter = require("../graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../graphql/pipes/resolver-validation.pipe");
const _graphqlerrorsutil = require("../graphql/utils/graphql-errors.util");
const _healthindicatoridenum = require("./enums/health-indicator-id.enum");
const _configvariablegraphqlapiexceptionfilter = require("../twenty-config/filters/config-variable-graphql-api-exception.filter");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
const _aimodelregistryservice = require("../../metadata-modules/ai/ai-models/services/ai-model-registry.service");
const _modelsdevcatalogservice = require("../../metadata-modules/ai/ai-models/services/models-dev-catalog.service");
const _modelfamilylabelsconst = require("../../metadata-modules/ai/ai-models/constants/model-family-labels.const");
const _extractconfigvariablenameutil = require("../../metadata-modules/ai/ai-models/utils/extract-config-variable-name.util");
const _loaddefaultaiprovidersutil = require("../../metadata-modules/ai/ai-models/utils/load-default-ai-providers.util");
const _workspaceentity = require("../workspace/workspace.entity");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _adminpanelguard = require("../../guards/admin-panel-guard");
const _serverlevelimpersonateguard = require("../../guards/server-level-impersonate.guard");
const _settingspermissionguard = require("../../guards/settings-permission.guard");
const _userauthguard = require("../../guards/user-auth.guard");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _adminpanelhealthservicedatadto = require("./dtos/admin-panel-health-service-data.dto");
const _modelsdevmodelsuggestiondto = require("./dtos/models-dev-model-suggestion.dto");
const _modelsdevprovidersuggestiondto = require("./dtos/models-dev-provider-suggestion.dto");
const _queuemetricsdatadto = require("./dtos/queue-metrics-data.dto");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AdminPanelResolver = class AdminPanelResolver {
    async userLookupAdminPanel(userLookupInput) {
        return await this.adminService.userLookup(userLookupInput.userIdentifier);
    }
    async updateWorkspaceFeatureFlag(updateFlagInput) {
        try {
            await this.featureFlagService.upsertWorkspaceFeatureFlag({
                workspaceId: updateFlagInput.workspaceId,
                featureFlag: updateFlagInput.featureFlag,
                value: updateFlagInput.value
            });
            return true;
        } catch (error) {
            if (error instanceof _featureflagexception.FeatureFlagException) {
                throw new _graphqlerrorsutil.UserInputError(error.message);
            }
            throw error;
        }
    }
    async getConfigVariablesGrouped() {
        return this.adminService.getConfigVariablesGrouped();
    }
    async getSystemHealthStatus() {
        return this.adminPanelHealthService.getSystemHealthStatus();
    }
    async getIndicatorHealthStatus(indicatorId) {
        return this.adminPanelHealthService.getIndicatorHealthStatus(indicatorId);
    }
    async getQueueMetrics(queueName, timeRange = _queuemetricstimerangeenum.QueueMetricsTimeRange.OneHour) {
        return await this.adminPanelHealthService.getQueueMetrics(queueName, timeRange);
    }
    async versionInfo() {
        return this.adminService.getVersionInfo();
    }
    async getAdminAiModels() {
        const resolvedProviders = this.aiModelRegistryService.getResolvedProvidersForAdmin();
        const models = this.aiModelRegistryService.getAllModelsWithStatus().map(({ modelConfig, isAvailable, isAdminEnabled, isRecommended, providerName, name })=>({
                modelId: modelConfig.modelId,
                label: modelConfig.label,
                modelFamily: modelConfig.modelFamily,
                modelFamilyLabel: modelConfig.modelFamily ? _modelfamilylabelsconst.MODEL_FAMILY_LABELS[modelConfig.modelFamily] : undefined,
                sdkPackage: modelConfig.sdkPackage,
                isAvailable,
                isAdminEnabled,
                isDeprecated: modelConfig.isDeprecated ?? false,
                isRecommended,
                contextWindowTokens: modelConfig.contextWindowTokens,
                maxOutputTokens: modelConfig.maxOutputTokens,
                inputCostPerMillionTokens: modelConfig.inputCostPerMillionTokens,
                outputCostPerMillionTokens: modelConfig.outputCostPerMillionTokens,
                providerName,
                providerLabel: providerName ? resolvedProviders[providerName]?.label ?? providerName : undefined,
                name,
                dataResidency: modelConfig.dataResidency
            }));
        const prefs = this.twentyConfigService.get('AI_MODEL_PREFERENCES');
        return {
            models,
            defaultSmartModelId: prefs.defaultSmartModels?.[0],
            defaultFastModelId: prefs.defaultFastModels?.[0]
        };
    }
    async setAdminAiModelEnabled(modelId, enabled) {
        await this.aiModelRegistryService.setModelAdminEnabled(modelId, enabled);
        return true;
    }
    async setAdminAiModelRecommended(modelId, recommended) {
        await this.aiModelRegistryService.setModelRecommended(modelId, recommended);
        return true;
    }
    async setAdminDefaultAiModel(role, modelId) {
        await this.aiModelRegistryService.setDefaultModel(role, modelId);
        return true;
    }
    async getDatabaseConfigVariable(key) {
        this.twentyConfigService.validateConfigVariableExists(key);
        return this.adminService.getConfigVariable(key);
    }
    async createDatabaseConfigVariable(key, value) {
        await this.twentyConfigService.set(key, value);
        return true;
    }
    async updateDatabaseConfigVariable(key, value) {
        await this.twentyConfigService.update(key, value);
        return true;
    }
    async deleteDatabaseConfigVariable(key) {
        await this.twentyConfigService.delete(key);
        return true;
    }
    async getQueueJobs(queueName, state, limit, offset) {
        return await this.adminPanelQueueService.getQueueJobs(queueName, state, limit, offset);
    }
    async retryJobs(queueName, jobIds) {
        return await this.adminPanelQueueService.retryJobs(queueName, jobIds);
    }
    async deleteJobs(queueName, jobIds) {
        return await this.adminPanelQueueService.deleteJobs(queueName, jobIds);
    }
    async findAllApplicationRegistrations() {
        return this.applicationRegistrationService.findAll();
    }
    async getAiProviders() {
        const providers = this.aiModelRegistryService.getResolvedProvidersForAdmin();
        const catalogNames = this.aiModelRegistryService.getCatalogProviderNames();
        const rawCatalog = (0, _loaddefaultaiprovidersutil.loadDefaultAiProviders)();
        const masked = {};
        for (const [key, config] of Object.entries(providers)){
            const isCatalog = catalogNames.has(key);
            const rawConfig = isCatalog ? rawCatalog[key] : undefined;
            const apiKeyConfigVariable = rawConfig ? (0, _extractconfigvariablenameutil.extractConfigVariableName)(rawConfig.apiKey) : undefined;
            masked[key] = {
                npm: config.npm,
                label: config.label ?? key,
                source: isCatalog ? 'catalog' : 'custom',
                ...config.authType && {
                    authType: config.authType
                },
                ...config.name && {
                    name: config.name
                },
                ...config.baseUrl && {
                    baseUrl: config.baseUrl
                },
                ...config.region && {
                    region: config.region
                },
                ...config.dataResidency && {
                    dataResidency: config.dataResidency
                },
                ...config.apiKey && {
                    apiKey: `${config.apiKey.substring(0, 8)}...`
                },
                ...apiKeyConfigVariable && {
                    apiKeyConfigVariable
                },
                hasAccessKey: !!(config.accessKeyId && config.secretAccessKey)
            };
        }
        return masked;
    }
    async addAiProvider(providerName, providerConfig) {
        if (!/^[a-zA-Z0-9_-]+$/.test(providerName)) {
            throw new _graphqlerrorsutil.UserInputError('Invalid provider name');
        }
        const customProviders = {
            ...this.twentyConfigService.get('AI_PROVIDERS')
        };
        customProviders[providerName] = providerConfig;
        await this.twentyConfigService.set('AI_PROVIDERS', customProviders);
        this.aiModelRegistryService.refreshRegistry();
        return true;
    }
    async removeAiProvider(providerName) {
        const customProviders = {
            ...this.twentyConfigService.get('AI_PROVIDERS')
        };
        delete customProviders[providerName];
        await this.twentyConfigService.set('AI_PROVIDERS', customProviders);
        this.aiModelRegistryService.refreshRegistry();
        return true;
    }
    async getModelsDevProviders() {
        return this.modelsDevCatalogService.getProviderSuggestions();
    }
    async getModelsDevSuggestions(providerType) {
        return this.modelsDevCatalogService.getModelSuggestions(providerType);
    }
    async addModelToProvider(providerName, modelConfig) {
        const customProviders = {
            ...this.twentyConfigService.get('AI_PROVIDERS')
        };
        const existing = customProviders[providerName];
        if (!existing) {
            throw new _graphqlerrorsutil.UserInputError(`Provider "${providerName}" not found in custom providers`);
        }
        const existingModels = existing.models ?? [];
        const alreadyExists = existingModels.some((model)=>model.name === modelConfig.name);
        if (alreadyExists) {
            throw new _graphqlerrorsutil.UserInputError(`Model "${modelConfig.name}" already exists on provider "${providerName}"`);
        }
        customProviders[providerName] = {
            ...existing,
            models: [
                ...existingModels,
                {
                    ...modelConfig,
                    source: 'manual'
                }
            ]
        };
        await this.twentyConfigService.set('AI_PROVIDERS', customProviders);
        this.aiModelRegistryService.refreshRegistry();
        return true;
    }
    async removeModelFromProvider(providerName, modelName) {
        const customProviders = {
            ...this.twentyConfigService.get('AI_PROVIDERS')
        };
        const existing = customProviders[providerName];
        if (!existing) {
            throw new _graphqlerrorsutil.UserInputError(`Provider "${providerName}" not found in custom providers`);
        }
        const existingModels = existing.models ?? [];
        customProviders[providerName] = {
            ...existing,
            models: existingModels.filter((model)=>model.name !== modelName)
        };
        await this.twentyConfigService.set('AI_PROVIDERS', customProviders);
        this.aiModelRegistryService.refreshRegistry();
        return true;
    }
    async getAdminAiUsageByWorkspace(periodStart, periodEnd) {
        const defaultEnd = new Date();
        const defaultStart = new Date();
        defaultStart.setDate(defaultStart.getDate() - 30);
        const useDollarMode = !this.twentyConfigService.get('IS_BILLING_ENABLED');
        const items = await this.usageAnalyticsService.getAdminAiUsageByWorkspace({
            periodStart: periodStart ?? defaultStart,
            periodEnd: periodEnd ?? defaultEnd,
            useDollarMode
        });
        if (items.length === 0) {
            return items;
        }
        const workspaceIds = items.map((item)=>item.key);
        const workspaces = await this.workspaceRepository.find({
            where: {
                id: (0, _typeorm1.In)(workspaceIds)
            },
            select: {
                id: true,
                displayName: true
            }
        });
        const nameMap = new Map(workspaces.filter((workspace)=>(0, _utils.isDefined)(workspace.displayName)).map((workspace)=>[
                workspace.id,
                workspace.displayName
            ]));
        return items.map((item)=>({
                ...item,
                label: nameMap.get(item.key)
            }));
    }
    constructor(adminService, adminPanelHealthService, applicationRegistrationService, adminPanelQueueService, featureFlagService, twentyConfigService, aiModelRegistryService, modelsDevCatalogService, usageAnalyticsService, workspaceRepository){
        this.adminService = adminService;
        this.adminPanelHealthService = adminPanelHealthService;
        this.applicationRegistrationService = applicationRegistrationService;
        this.adminPanelQueueService = adminPanelQueueService;
        this.featureFlagService = featureFlagService;
        this.twentyConfigService = twentyConfigService;
        this.aiModelRegistryService = aiModelRegistryService;
        this.modelsDevCatalogService = modelsDevCatalogService;
        this.usageAnalyticsService = usageAnalyticsService;
        this.workspaceRepository = workspaceRepository;
    }
};
_ts_decorate([
    (0, _common.UseGuards)(_serverlevelimpersonateguard.ServerLevelImpersonateGuard),
    (0, _graphql.Mutation)(()=>_userlookupdto.UserLookup),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _userlookupinput.UserLookupInput === "undefined" ? Object : _userlookupinput.UserLookupInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "userLookupAdminPanel", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _updateworkspacefeatureflaginput.UpdateWorkspaceFeatureFlagInput === "undefined" ? Object : _updateworkspacefeatureflaginput.UpdateWorkspaceFeatureFlagInput
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "updateWorkspaceFeatureFlag", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_configvariablesdto.ConfigVariablesDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getConfigVariablesGrouped", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_systemhealthdto.SystemHealthDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getSystemHealthStatus", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_adminpanelhealthservicedatadto.AdminPanelHealthServiceDataDTO),
    _ts_param(0, (0, _graphql.Args)('indicatorId', {
        type: ()=>_healthindicatoridenum.HealthIndicatorId
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _healthindicatoridenum.HealthIndicatorId === "undefined" ? Object : _healthindicatoridenum.HealthIndicatorId
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getIndicatorHealthStatus", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_queuemetricsdatadto.QueueMetricsDataDTO),
    _ts_param(0, (0, _graphql.Args)('queueName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('timeRange', {
        nullable: true,
        defaultValue: _queuemetricstimerangeenum.QueueMetricsTimeRange.OneHour,
        type: ()=>_queuemetricstimerangeenum.QueueMetricsTimeRange
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _queuemetricstimerangeenum.QueueMetricsTimeRange === "undefined" ? Object : _queuemetricstimerangeenum.QueueMetricsTimeRange
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getQueueMetrics", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_versioninfodto.VersionInfoDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "versionInfo", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_clientconfigentity.AdminAIModelsDTO),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getAdminAiModels", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('modelId', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('enabled', {
        type: ()=>Boolean
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "setAdminAiModelEnabled", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('modelId', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('recommended', {
        type: ()=>Boolean
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Boolean
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "setAdminAiModelRecommended", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('role', {
        type: ()=>_aimodelroleenum.AiModelRole
    })),
    _ts_param(1, (0, _graphql.Args)('modelId', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _aimodelroleenum.AiModelRole === "undefined" ? Object : _aimodelroleenum.AiModelRole,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "setAdminDefaultAiModel", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_configvariabledto.ConfigVariableDTO),
    _ts_param(0, (0, _graphql.Args)('key', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getDatabaseConfigVariable", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('key', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('value', {
        type: ()=>_graphqltypejson.default
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "createDatabaseConfigVariable", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('key', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('value', {
        type: ()=>_graphqltypejson.default
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "updateDatabaseConfigVariable", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('key', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "deleteDatabaseConfigVariable", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_queuejobsresponsedto.QueueJobsResponseDTO),
    _ts_param(0, (0, _graphql.Args)('queueName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('state', {
        type: ()=>_jobstateenum.JobStateEnum
    })),
    _ts_param(2, (0, _graphql.Args)('limit', {
        type: ()=>_graphql.Int,
        nullable: true,
        defaultValue: 50
    })),
    _ts_param(3, (0, _graphql.Args)('offset', {
        type: ()=>_graphql.Int,
        nullable: true,
        defaultValue: 0
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _jobstateenum.JobStateEnum === "undefined" ? Object : _jobstateenum.JobStateEnum,
        Number,
        Number
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getQueueJobs", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>_retryjobsresponsedto.RetryJobsResponseDTO),
    _ts_param(0, (0, _graphql.Args)('queueName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('jobIds', {
        type: ()=>[
                String
            ]
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "retryJobs", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>_deletejobsresponsedto.DeleteJobsResponseDTO),
    _ts_param(0, (0, _graphql.Args)('queueName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('jobIds', {
        type: ()=>[
                String
            ]
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Array
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "deleteJobs", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>[
            _applicationregistrationentity.ApplicationRegistrationEntity
        ]),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "findAllApplicationRegistrations", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>_graphqltypejson.default),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getAiProviders", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('providerName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('providerConfig', {
        type: ()=>_graphqltypejson.default
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof AiProviderConfig === "undefined" ? Object : AiProviderConfig
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "addAiProvider", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('providerName', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "removeAiProvider", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>[
            _modelsdevprovidersuggestiondto.ModelsDevProviderSuggestionDTO
        ]),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getModelsDevProviders", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>[
            _modelsdevmodelsuggestiondto.ModelsDevModelSuggestionDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('providerType', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getModelsDevSuggestions", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('providerName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('modelConfig', {
        type: ()=>_graphqltypejson.default
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof AiProviderModelConfig === "undefined" ? Object : AiProviderModelConfig
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "addModelToProvider", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Mutation)(()=>Boolean),
    _ts_param(0, (0, _graphql.Args)('providerName', {
        type: ()=>String
    })),
    _ts_param(1, (0, _graphql.Args)('modelName', {
        type: ()=>String
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "removeModelFromProvider", null);
_ts_decorate([
    (0, _common.UseGuards)(_adminpanelguard.AdminPanelGuard),
    (0, _graphql.Query)(()=>[
            _usagebreakdownitemdto.UsageBreakdownItemDTO
        ]),
    _ts_param(0, (0, _graphql.Args)('periodStart', {
        type: ()=>Date,
        nullable: true
    })),
    _ts_param(1, (0, _graphql.Args)('periodEnd', {
        type: ()=>Date,
        nullable: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Date === "undefined" ? Object : Date,
        typeof Date === "undefined" ? Object : Date
    ]),
    _ts_metadata("design:returntype", Promise)
], AdminPanelResolver.prototype, "getAdminAiUsageByWorkspace", null);
AdminPanelResolver = _ts_decorate([
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseFilters)(_authgraphqlapiexceptionfilter.AuthGraphqlApiExceptionFilter, _preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter, _configvariablegraphqlapiexceptionfilter.ConfigVariableGraphqlApiExceptionFilter),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _userauthguard.UserAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.SECURITY)),
    _ts_param(9, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _adminpanelservice.AdminPanelService === "undefined" ? Object : _adminpanelservice.AdminPanelService,
        typeof _adminpanelhealthservice.AdminPanelHealthService === "undefined" ? Object : _adminpanelhealthservice.AdminPanelHealthService,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _adminpanelqueueservice.AdminPanelQueueService === "undefined" ? Object : _adminpanelqueueservice.AdminPanelQueueService,
        typeof _featureflagservice.FeatureFlagService === "undefined" ? Object : _featureflagservice.FeatureFlagService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _aimodelregistryservice.AiModelRegistryService === "undefined" ? Object : _aimodelregistryservice.AiModelRegistryService,
        typeof _modelsdevcatalogservice.ModelsDevCatalogService === "undefined" ? Object : _modelsdevcatalogservice.ModelsDevCatalogService,
        typeof _usageanalyticsservice.UsageAnalyticsService === "undefined" ? Object : _usageanalyticsservice.UsageAnalyticsService,
        typeof Repository === "undefined" ? Object : Repository
    ])
], AdminPanelResolver);

//# sourceMappingURL=admin-panel.resolver.js.map