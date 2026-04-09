"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AdminPanelService", {
    enumerable: true,
    get: function() {
        return AdminPanelService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _semver = /*#__PURE__*/ _interop_require_default(require("semver"));
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _zod = /*#__PURE__*/ _interop_require_wildcard(require("zod"));
const _types = require("twenty-shared/types");
const _authexception = require("../auth/auth.exception");
const _workspacedomainsservice = require("../domain/workspace-domains/services/workspace-domains.service");
const _fileservice = require("../file/services/file.service");
const _securehttpclientservice = require("../secure-http-client/secure-http-client.service");
const _configvariablesgroupmetadata = require("../twenty-config/constants/config-variables-group-metadata");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
const _userentity = require("../user/user.entity");
const _uservalidate = require("../user/user.validate");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
let AdminPanelService = class AdminPanelService {
    async userLookup(userIdentifier) {
        const isEmail = userIdentifier.includes('@');
        const normalizedIdentifier = isEmail ? userIdentifier.toLowerCase() : userIdentifier;
        const targetUser = await this.userRepository.findOne({
            where: isEmail ? {
                email: normalizedIdentifier
            } : {
                id: normalizedIdentifier
            },
            relations: {
                userWorkspaces: {
                    workspace: {
                        workspaceUsers: {
                            user: true
                        },
                        featureFlags: true
                    }
                }
            }
        });
        _uservalidate.userValidator.assertIsDefinedOrThrow(targetUser, new _authexception.AuthException('User not found', _authexception.AuthExceptionCode.INVALID_INPUT, {
            userFriendlyMessage: /*i18n*/ {
                id: "g5Z6no",
                message: "User not found. Please check the email or ID."
            }
        }));
        const allFeatureFlagKeys = Object.values(_types.FeatureFlagKey);
        return {
            user: {
                id: targetUser.id,
                email: targetUser.email,
                firstName: targetUser.firstName,
                lastName: targetUser.lastName
            },
            workspaces: targetUser.userWorkspaces.map((userWorkspace)=>({
                    id: userWorkspace.workspace.id,
                    name: userWorkspace.workspace.displayName ?? '',
                    totalUsers: userWorkspace.workspace.workspaceUsers.length,
                    logo: userWorkspace.workspace.logo ? this.fileService.signFileUrl({
                        url: userWorkspace.workspace.logo,
                        workspaceId: userWorkspace.workspace.id
                    }) : userWorkspace.workspace.logo,
                    allowImpersonation: userWorkspace.workspace.allowImpersonation,
                    workspaceUrls: this.workspaceDomainsService.getWorkspaceUrls({
                        subdomain: userWorkspace.workspace.subdomain,
                        customDomain: userWorkspace.workspace.customDomain,
                        isCustomDomainEnabled: userWorkspace.workspace.isCustomDomainEnabled
                    }),
                    users: userWorkspace.workspace.workspaceUsers.filter((workspaceUser)=>(0, _utils.isDefined)(workspaceUser.user)).map((workspaceUser)=>({
                            id: workspaceUser.user.id,
                            email: workspaceUser.user.email,
                            firstName: workspaceUser.user.firstName,
                            lastName: workspaceUser.user.lastName
                        })),
                    featureFlags: allFeatureFlagKeys.map((key)=>({
                            key,
                            value: userWorkspace.workspace.featureFlags?.find((flag)=>flag.key === key)?.value ?? false
                        }))
                }))
        };
    }
    getConfigVariablesGrouped() {
        const rawEnvVars = this.twentyConfigService.getAll();
        const groupedData = new Map();
        for (const [varName, { value, metadata, source }] of Object.entries(rawEnvVars)){
            const { group, description } = metadata;
            if (metadata.isHiddenInAdminPanel) {
                continue;
            }
            const envVar = {
                name: varName,
                description,
                value: value ?? null,
                isSensitive: metadata.isSensitive ?? false,
                isEnvOnly: metadata.isEnvOnly ?? false,
                type: metadata.type,
                options: metadata.options,
                source
            };
            if (!groupedData.has(group)) {
                groupedData.set(group, []);
            }
            groupedData.get(group)?.push(envVar);
        }
        const groups = Array.from(groupedData.entries()).filter(([name])=>!_configvariablesgroupmetadata.CONFIG_VARIABLES_GROUP_METADATA[name].isHiddenInAdminPanel).sort((a, b)=>{
            const positionA = _configvariablesgroupmetadata.CONFIG_VARIABLES_GROUP_METADATA[a[0]].position;
            const positionB = _configvariablesgroupmetadata.CONFIG_VARIABLES_GROUP_METADATA[b[0]].position;
            return positionA - positionB;
        }).map(([name, variables])=>({
                name,
                description: _configvariablesgroupmetadata.CONFIG_VARIABLES_GROUP_METADATA[name].description,
                isHiddenOnLoad: _configvariablesgroupmetadata.CONFIG_VARIABLES_GROUP_METADATA[name].isHiddenOnLoad,
                variables: variables.sort((a, b)=>a.name.localeCompare(b.name))
            }));
        return {
            groups
        };
    }
    getConfigVariable(key) {
        const variableWithMetadata = this.twentyConfigService.getVariableWithMetadata(key);
        if (!variableWithMetadata) {
            throw new Error(`Config variable ${key} not found`);
        }
        const { value, metadata, source } = variableWithMetadata;
        return {
            name: key,
            description: metadata.description ?? '',
            value: value ?? null,
            isSensitive: metadata.isSensitive ?? false,
            isEnvOnly: metadata.isEnvOnly ?? false,
            type: metadata.type,
            options: metadata.options,
            source
        };
    }
    async getVersionInfo() {
        const currentVersion = this.twentyConfigService.get('APP_VERSION');
        try {
            const httpClient = this.secureHttpClientService.getHttpClient();
            const rawResponse = await httpClient.get('https://hub.docker.com/v2/repositories/twentycrm/twenty/tags?page_size=100');
            const response = _zod.object({
                data: _zod.object({
                    results: _zod.array(_zod.object({
                        name: _zod.string()
                    }))
                })
            }).parse(rawResponse);
            const versions = response.data.results.map((tag)=>tag.name).filter((name)=>name !== 'latest' && _semver.default.valid(name));
            if (versions.length === 0) {
                return {
                    currentVersion,
                    latestVersion: 'latest'
                };
            }
            versions.sort((a, b)=>_semver.default.compare(b, a));
            const latestVersion = versions[0];
            return {
                currentVersion,
                latestVersion
            };
        } catch  {
            return {
                currentVersion,
                latestVersion: 'latest'
            };
        }
    }
    constructor(twentyConfigService, workspaceDomainsService, fileService, secureHttpClientService, userRepository){
        this.twentyConfigService = twentyConfigService;
        this.workspaceDomainsService = workspaceDomainsService;
        this.fileService = fileService;
        this.secureHttpClientService = secureHttpClientService;
        this.userRepository = userRepository;
    }
};
AdminPanelService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(4, (0, _typeorm.InjectRepository)(_userentity.UserEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _workspacedomainsservice.WorkspaceDomainsService === "undefined" ? Object : _workspacedomainsservice.WorkspaceDomainsService,
        typeof _fileservice.FileService === "undefined" ? Object : _fileservice.FileService,
        typeof _securehttpclientservice.SecureHttpClientService === "undefined" ? Object : _securehttpclientservice.SecureHttpClientService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], AdminPanelService);

//# sourceMappingURL=admin-panel.service.js.map