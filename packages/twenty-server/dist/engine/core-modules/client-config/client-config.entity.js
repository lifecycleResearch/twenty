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
    get AdminAIModelConfig () {
        return AdminAIModelConfig;
    },
    get AdminAIModelsDTO () {
        return AdminAIModelsDTO;
    },
    get ApiConfig () {
        return ApiConfig;
    },
    get Billing () {
        return Billing;
    },
    get Captcha () {
        return Captcha;
    },
    get ClientAIModelConfig () {
        return ClientAIModelConfig;
    },
    get ClientConfig () {
        return ClientConfig;
    },
    get NativeModelCapabilities () {
        return NativeModelCapabilities;
    },
    get PublicFeatureFlag () {
        return PublicFeatureFlag;
    },
    get PublicFeatureFlagMetadata () {
        return PublicFeatureFlagMetadata;
    },
    get Sentry () {
        return Sentry;
    },
    get Support () {
        return Support;
    }
});
const _graphql = require("@nestjs/graphql");
const _types = require("twenty-shared/types");
const _supportinterface = require("../twenty-config/interfaces/support.interface");
const _billingtrialperioddto = require("../billing/dtos/billing-trial-period.dto");
const _interfaces = require("../captcha/interfaces");
const _publicworkspacedatadto = require("../workspace/dtos/public-workspace-data.dto");
const _aimodelroleenum = require("../../metadata-modules/ai/ai-models/types/ai-model-role.enum");
const _modelfamilyenum = require("../../metadata-modules/ai/ai-models/types/model-family.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
(0, _graphql.registerEnumType)(_types.FeatureFlagKey, {
    name: 'FeatureFlagKey'
});
(0, _graphql.registerEnumType)(_modelfamilyenum.ModelFamily, {
    name: 'ModelFamily'
});
(0, _graphql.registerEnumType)(_aimodelroleenum.AiModelRole, {
    name: 'AiModelRole'
});
let NativeModelCapabilities = class NativeModelCapabilities {
};
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], NativeModelCapabilities.prototype, "webSearch", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], NativeModelCapabilities.prototype, "twitterSearch", void 0);
NativeModelCapabilities = _ts_decorate([
    (0, _graphql.ObjectType)()
], NativeModelCapabilities);
let ClientAIModelConfig = class ClientAIModelConfig {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", typeof ModelId === "undefined" ? Object : ModelId)
], ClientAIModelConfig.prototype, "modelId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], ClientAIModelConfig.prototype, "label", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_modelfamilyenum.ModelFamily, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _modelfamilyenum.ModelFamily === "undefined" ? Object : _modelfamilyenum.ModelFamily)
], ClientAIModelConfig.prototype, "modelFamily", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ClientAIModelConfig.prototype, "modelFamilyLabel", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ClientAIModelConfig.prototype, "sdkPackage", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Number),
    _ts_metadata("design:type", Number)
], ClientAIModelConfig.prototype, "inputCostPerMillionTokensInCredits", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Number),
    _ts_metadata("design:type", Number)
], ClientAIModelConfig.prototype, "outputCostPerMillionTokensInCredits", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>NativeModelCapabilities, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof NativeModelCapabilities === "undefined" ? Object : NativeModelCapabilities)
], ClientAIModelConfig.prototype, "nativeCapabilities", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], ClientAIModelConfig.prototype, "isDeprecated", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], ClientAIModelConfig.prototype, "isRecommended", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ClientAIModelConfig.prototype, "providerName", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ClientAIModelConfig.prototype, "dataResidency", void 0);
ClientAIModelConfig = _ts_decorate([
    (0, _graphql.ObjectType)()
], ClientAIModelConfig);
let AdminAIModelConfig = class AdminAIModelConfig {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], AdminAIModelConfig.prototype, "modelId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], AdminAIModelConfig.prototype, "label", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_modelfamilyenum.ModelFamily, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _modelfamilyenum.ModelFamily === "undefined" ? Object : _modelfamilyenum.ModelFamily)
], AdminAIModelConfig.prototype, "modelFamily", void 0);
_ts_decorate([
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], AdminAIModelConfig.prototype, "modelFamilyLabel", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], AdminAIModelConfig.prototype, "sdkPackage", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], AdminAIModelConfig.prototype, "isAvailable", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], AdminAIModelConfig.prototype, "isAdminEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], AdminAIModelConfig.prototype, "isDeprecated", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], AdminAIModelConfig.prototype, "isRecommended", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Number, {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], AdminAIModelConfig.prototype, "contextWindowTokens", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Number, {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], AdminAIModelConfig.prototype, "maxOutputTokens", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Number, {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], AdminAIModelConfig.prototype, "inputCostPerMillionTokens", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Number, {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], AdminAIModelConfig.prototype, "outputCostPerMillionTokens", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], AdminAIModelConfig.prototype, "providerName", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], AdminAIModelConfig.prototype, "providerLabel", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], AdminAIModelConfig.prototype, "name", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], AdminAIModelConfig.prototype, "dataResidency", void 0);
AdminAIModelConfig = _ts_decorate([
    (0, _graphql.ObjectType)()
], AdminAIModelConfig);
let AdminAIModelsDTO = class AdminAIModelsDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>[
            AdminAIModelConfig
        ]),
    _ts_metadata("design:type", Array)
], AdminAIModelsDTO.prototype, "models", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], AdminAIModelsDTO.prototype, "defaultSmartModelId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], AdminAIModelsDTO.prototype, "defaultFastModelId", void 0);
AdminAIModelsDTO = _ts_decorate([
    (0, _graphql.ObjectType)('AdminAIModels')
], AdminAIModelsDTO);
let Billing = class Billing {
};
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], Billing.prototype, "isBillingEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Billing.prototype, "billingUrl", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            _billingtrialperioddto.BillingTrialPeriodDTO
        ]),
    _ts_metadata("design:type", Array)
], Billing.prototype, "trialPeriods", void 0);
Billing = _ts_decorate([
    (0, _graphql.ObjectType)()
], Billing);
let Support = class Support {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_supportinterface.SupportDriver),
    _ts_metadata("design:type", typeof _supportinterface.SupportDriver === "undefined" ? Object : _supportinterface.SupportDriver)
], Support.prototype, "supportDriver", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Support.prototype, "supportFrontChatId", void 0);
Support = _ts_decorate([
    (0, _graphql.ObjectType)()
], Support);
let Sentry = class Sentry {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Sentry.prototype, "environment", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Sentry.prototype, "release", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], Sentry.prototype, "dsn", void 0);
Sentry = _ts_decorate([
    (0, _graphql.ObjectType)()
], Sentry);
let Captcha = class Captcha {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_interfaces.CaptchaDriverType, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Captcha.prototype, "provider", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], Captcha.prototype, "siteKey", void 0);
Captcha = _ts_decorate([
    (0, _graphql.ObjectType)()
], Captcha);
let ApiConfig = class ApiConfig {
};
_ts_decorate([
    (0, _graphql.Field)(()=>Number, {
        nullable: false
    }),
    _ts_metadata("design:type", Number)
], ApiConfig.prototype, "mutationMaximumAffectedRecords", void 0);
ApiConfig = _ts_decorate([
    (0, _graphql.ObjectType)()
], ApiConfig);
let PublicFeatureFlagMetadata = class PublicFeatureFlagMetadata {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], PublicFeatureFlagMetadata.prototype, "label", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], PublicFeatureFlagMetadata.prototype, "description", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], PublicFeatureFlagMetadata.prototype, "imagePath", void 0);
PublicFeatureFlagMetadata = _ts_decorate([
    (0, _graphql.ObjectType)()
], PublicFeatureFlagMetadata);
let PublicFeatureFlag = class PublicFeatureFlag {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_types.FeatureFlagKey),
    _ts_metadata("design:type", typeof _types.FeatureFlagKey === "undefined" ? Object : _types.FeatureFlagKey)
], PublicFeatureFlag.prototype, "key", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>PublicFeatureFlagMetadata),
    _ts_metadata("design:type", typeof PublicFeatureFlagMetadata === "undefined" ? Object : PublicFeatureFlagMetadata)
], PublicFeatureFlag.prototype, "metadata", void 0);
PublicFeatureFlag = _ts_decorate([
    (0, _graphql.ObjectType)()
], PublicFeatureFlag);
let ClientConfig = class ClientConfig {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ClientConfig.prototype, "appVersion", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_publicworkspacedatadto.AuthProvidersDTO, {
        nullable: false
    }),
    _ts_metadata("design:type", typeof _publicworkspacedatadto.AuthProvidersDTO === "undefined" ? Object : _publicworkspacedatadto.AuthProvidersDTO)
], ClientConfig.prototype, "authProviders", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Billing, {
        nullable: false
    }),
    _ts_metadata("design:type", typeof Billing === "undefined" ? Object : Billing)
], ClientConfig.prototype, "billing", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            ClientAIModelConfig
        ]),
    _ts_metadata("design:type", Array)
], ClientConfig.prototype, "aiModels", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "signInPrefilled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isMultiWorkspaceEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isEmailVerificationRequired", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ClientConfig.prototype, "defaultSubdomain", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], ClientConfig.prototype, "frontDomain", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "analyticsEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Support),
    _ts_metadata("design:type", typeof Support === "undefined" ? Object : Support)
], ClientConfig.prototype, "support", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isAttachmentPreviewEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Sentry),
    _ts_metadata("design:type", typeof Sentry === "undefined" ? Object : Sentry)
], ClientConfig.prototype, "sentry", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Captcha),
    _ts_metadata("design:type", typeof Captcha === "undefined" ? Object : Captcha)
], ClientConfig.prototype, "captcha", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>ApiConfig),
    _ts_metadata("design:type", typeof ApiConfig === "undefined" ? Object : ApiConfig)
], ClientConfig.prototype, "api", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "canManageFeatureFlags", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            PublicFeatureFlag
        ]),
    _ts_metadata("design:type", Array)
], ClientConfig.prototype, "publicFeatureFlags", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isMicrosoftMessagingEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isMicrosoftCalendarEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isGoogleMessagingEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isGoogleCalendarEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isConfigVariablesInDbEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isImapSmtpCaldavEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "allowRequestsToTwentyIcons", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ClientConfig.prototype, "calendarBookingPageId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isCloudflareIntegrationEnabled", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], ClientConfig.prototype, "isClickHouseConfigured", void 0);
ClientConfig = _ts_decorate([
    (0, _graphql.ObjectType)()
], ClientConfig);

//# sourceMappingURL=client-config.entity.js.map