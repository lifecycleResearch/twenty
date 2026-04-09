"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationDevelopmentResolver", {
    enumerable: true,
    get: function() {
        return ApplicationDevelopmentResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _GraphQLUpload = /*#__PURE__*/ _interop_require_default(require("graphql-upload/GraphQLUpload.mjs"));
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _metadataresolverdecorator = require("../../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _applicationinput = require("./dtos/application.input");
const _createdevelopmentapplicationinput = require("./dtos/create-development-application.input");
const _developmentapplicationdto = require("./dtos/development-application.dto");
const _generateapplicationtokeninput = require("./dtos/generate-application-token.input");
const _uploadapplicationfileinput = require("./dtos/upload-application-file.input");
const _workspacemigrationdto = require("./dtos/workspace-migration.dto");
const _applicationexceptionfilter = require("../application-exception-filter");
const _applicationsyncservice = require("../application-manifest/application-sync.service");
const _applicationtokenpairdto = require("../application-oauth/dtos/application-token-pair.dto");
const _applicationregistrationvariableservice = require("../application-registration-variable/application-registration-variable.service");
const _applicationregistrationservice = require("../application-registration/application-registration.service");
const _applicationregistrationsourcetypeenum = require("../application-registration/enums/application-registration-source-type.enum");
const _applicationexception = require("../application.exception");
const _applicationservice = require("../application.service");
const _applicationtokenservice = require("../../auth/token/services/application-token.service");
const _filestorageservice = require("../../file-storage/file-storage.service");
const _filedto = require("../../file/dtos/file.dto");
const _resolvervalidationpipe = require("../../graphql/pipes/resolver-validation.pipe");
const _sdkclientgenerationservice = require("../../sdk-client/sdk-client-generation.service");
const _authuserdecorator = require("../../../decorators/auth/auth-user.decorator");
const _authuserworkspaceiddecorator = require("../../../decorators/auth/auth-user-workspace-id.decorator");
const _authworkspacedecorator = require("../../../decorators/auth/auth-workspace.decorator");
const _developmentguard = require("../../../guards/development.guard");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
const _workspacemigrationgraphqlapiexceptioninterceptor = require("../../../workspace-manager/workspace-migration/interceptors/workspace-migration-graphql-api-exception.interceptor");
const _streamtobuffer = require("../../../../utils/stream-to-buffer");
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
let ApplicationDevelopmentResolver = class ApplicationDevelopmentResolver {
    async createDevelopmentApplication({ universalIdentifier, name }, { id: workspaceId }) {
        const applicationRegistrationId = await this.findApplicationRegistrationId(universalIdentifier, workspaceId);
        const existing = await this.applicationService.findByUniversalIdentifier({
            universalIdentifier,
            workspaceId
        });
        if (existing) {
            return {
                id: existing.id,
                universalIdentifier: existing.universalIdentifier
            };
        }
        const application = await this.applicationService.create({
            universalIdentifier,
            name,
            sourcePath: universalIdentifier,
            sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL,
            applicationRegistrationId,
            workspaceId
        });
        return {
            id: application.id,
            universalIdentifier: application.universalIdentifier
        };
    }
    async generateApplicationToken({ applicationId }, { id: workspaceId }, user, userWorkspaceId) {
        return this.applicationTokenService.generateApplicationTokenPair({
            workspaceId,
            applicationId,
            userId: user?.id,
            userWorkspaceId
        });
    }
    async syncApplication({ manifest }, { id: workspaceId }) {
        const applicationRegistrationId = await this.findApplicationRegistrationId(manifest.application.universalIdentifier, workspaceId);
        const application = await this.applicationService.findByUniversalIdentifier({
            universalIdentifier: manifest.application.universalIdentifier,
            workspaceId
        });
        if (!(0, _utils.isDefined)(application)) {
            throw new _applicationexception.ApplicationException(`Application "${manifest.application.universalIdentifier}" not found in workspace "${workspaceId}". Run createDevelopmentApplication first.`, _applicationexception.ApplicationExceptionCode.APPLICATION_NOT_FOUND);
        }
        const isFirstSync = !(0, _utils.isDefined)(application.version);
        const { workspaceMigration, hasSchemaMetadataChanged } = await this.applicationSyncService.synchronizeFromManifest({
            workspaceId,
            manifest,
            applicationRegistrationId
        });
        if (isFirstSync || hasSchemaMetadataChanged) {
            await this.sdkClientGenerationService.generateSdkClientForApplication({
                workspaceId,
                applicationId: application.id,
                applicationUniversalIdentifier: manifest.application.universalIdentifier
            });
        }
        await this.syncRegistrationMetadata(applicationRegistrationId, manifest, workspaceId);
        return {
            applicationUniversalIdentifier: workspaceMigration.applicationUniversalIdentifier,
            actions: workspaceMigration.actions
        };
    }
    async uploadApplicationFile({ id: workspaceId }, { createReadStream, mimetype }, { applicationUniversalIdentifier, fileFolder, filePath }) {
        const allowedApplicationFileFolders = [
            _types.FileFolder.BuiltLogicFunction,
            _types.FileFolder.BuiltFrontComponent,
            _types.FileFolder.PublicAsset,
            _types.FileFolder.Source,
            _types.FileFolder.Dependencies
        ];
        if (!allowedApplicationFileFolders.includes(fileFolder)) {
            throw new _applicationexception.ApplicationException(`Invalid fileFolder for application file upload. Allowed values: ${allowedApplicationFileFolders.join(', ')}`, _applicationexception.ApplicationExceptionCode.INVALID_INPUT);
        }
        const buffer = await (0, _streamtobuffer.streamToBuffer)(createReadStream());
        return await this.fileStorageService.writeFile({
            sourceFile: buffer,
            mimeType: mimetype,
            fileFolder,
            applicationUniversalIdentifier,
            workspaceId,
            resourcePath: filePath,
            settings: {
                isTemporaryFile: false,
                toDelete: false
            }
        });
    }
    async findApplicationRegistrationId(universalIdentifier, workspaceId) {
        const existingRegistration = await this.applicationRegistrationService.findOneByUniversalIdentifier(universalIdentifier);
        if (!existingRegistration) {
            throw new _applicationexception.ApplicationException(`No registration found for "${universalIdentifier}". Create one first with createApplicationRegistration.`, _applicationexception.ApplicationExceptionCode.APPLICATION_NOT_FOUND);
        }
        const isOwner = await this.applicationRegistrationService.isOwnedByWorkspace(existingRegistration.id, workspaceId);
        if (!isOwner) {
            throw new _applicationexception.ApplicationException('Cannot sync application: registration is owned by another workspace', _applicationexception.ApplicationExceptionCode.FORBIDDEN);
        }
        return existingRegistration.id;
    }
    async syncRegistrationMetadata(applicationRegistrationId, manifest, workspaceId) {
        const isOwner = await this.applicationRegistrationService.isOwnedByWorkspace(applicationRegistrationId, workspaceId);
        if (isOwner) {
            await this.applicationRegistrationService.update({
                id: applicationRegistrationId,
                update: {
                    name: manifest.application.displayName,
                    description: manifest.application.description,
                    logoUrl: manifest.application.logoUrl,
                    author: manifest.application.author,
                    websiteUrl: manifest.application.websiteUrl,
                    termsUrl: manifest.application.termsUrl
                }
            }, workspaceId);
            if (manifest.application.serverVariables) {
                await this.applicationRegistrationVariableService.syncVariableSchemas(applicationRegistrationId, manifest.application.serverVariables);
            }
        }
    }
    constructor(applicationTokenService, applicationService, applicationSyncService, applicationRegistrationService, applicationRegistrationVariableService, fileStorageService, sdkClientGenerationService){
        this.applicationTokenService = applicationTokenService;
        this.applicationService = applicationService;
        this.applicationSyncService = applicationSyncService;
        this.applicationRegistrationService = applicationRegistrationService;
        this.applicationRegistrationVariableService = applicationRegistrationVariableService;
        this.fileStorageService = fileStorageService;
        this.sdkClientGenerationService = sdkClientGenerationService;
    }
};
_ts_decorate([
    (0, _graphql.Mutation)(()=>_developmentapplicationdto.DevelopmentApplicationDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createdevelopmentapplicationinput.CreateDevelopmentApplicationInput === "undefined" ? Object : _createdevelopmentapplicationinput.CreateDevelopmentApplicationInput,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationDevelopmentResolver.prototype, "createDevelopmentApplication", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_applicationtokenpairdto.ApplicationTokenPairDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(2, (0, _authuserdecorator.AuthUser)({
        allowUndefined: true
    })),
    _ts_param(3, (0, _authuserworkspaceiddecorator.AuthUserWorkspaceId)({
        allowUndefined: true
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _generateapplicationtokeninput.GenerateApplicationTokenInput === "undefined" ? Object : _generateapplicationtokeninput.GenerateApplicationTokenInput,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationDevelopmentResolver.prototype, "generateApplicationToken", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_workspacemigrationdto.WorkspaceMigrationDTO),
    _ts_param(0, (0, _graphql.Args)()),
    _ts_param(1, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationinput.ApplicationInput === "undefined" ? Object : _applicationinput.ApplicationInput,
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationDevelopmentResolver.prototype, "syncApplication", null);
_ts_decorate([
    (0, _graphql.Mutation)(()=>_filedto.FileDTO),
    (0, _common.UseGuards)((0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.UPLOAD_FILE)),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Args)({
        name: 'file',
        type: ()=>_GraphQLUpload.default
    })),
    _ts_param(2, (0, _graphql.Args)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof WorkspaceEntity === "undefined" ? Object : WorkspaceEntity,
        typeof FileUpload === "undefined" ? Object : FileUpload,
        typeof _uploadapplicationfileinput.UploadApplicationFileInput === "undefined" ? Object : _uploadapplicationfileinput.UploadApplicationFileInput
    ]),
    _ts_metadata("design:returntype", Promise)
], ApplicationDevelopmentResolver.prototype, "uploadApplicationFile", null);
ApplicationDevelopmentResolver = _ts_decorate([
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _metadataresolverdecorator.MetadataResolver)(),
    (0, _common.UseInterceptors)(_workspacemigrationgraphqlapiexceptioninterceptor.WorkspaceMigrationGraphqlApiExceptionInterceptor),
    (0, _common.UseFilters)(_applicationexceptionfilter.ApplicationExceptionFilter),
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard, _developmentguard.DevelopmentGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.APPLICATIONS)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _applicationtokenservice.ApplicationTokenService === "undefined" ? Object : _applicationtokenservice.ApplicationTokenService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _applicationsyncservice.ApplicationSyncService === "undefined" ? Object : _applicationsyncservice.ApplicationSyncService,
        typeof _applicationregistrationservice.ApplicationRegistrationService === "undefined" ? Object : _applicationregistrationservice.ApplicationRegistrationService,
        typeof _applicationregistrationvariableservice.ApplicationRegistrationVariableService === "undefined" ? Object : _applicationregistrationvariableservice.ApplicationRegistrationVariableService,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _sdkclientgenerationservice.SdkClientGenerationService === "undefined" ? Object : _sdkclientgenerationservice.SdkClientGenerationService
    ])
], ApplicationDevelopmentResolver);

//# sourceMappingURL=application-development.resolver.js.map