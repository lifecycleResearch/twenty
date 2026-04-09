"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationInstallService", {
    enumerable: true,
    get: function() {
        return ApplicationInstallService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _fs = require("fs");
const _path = require("path");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _applicationexception = require("../application.exception");
const _applicationregistrationentity = require("../application-registration/application-registration.entity");
const _applicationregistrationsourcetypeenum = require("../application-registration/enums/application-registration-source-type.enum");
const _applicationservice = require("../application.service");
const _applicationpackagefetcherservice = require("../application-package/application-package-fetcher.service");
const _applicationsyncservice = require("../application-manifest/application-sync.service");
const _cachelockservice = require("../../cache-lock/cache-lock.service");
const _filestorageservice = require("../../file-storage/file-storage.service");
const _sdkclientgenerationservice = require("../../sdk-client/sdk-client-generation.service");
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
let ApplicationInstallService = class ApplicationInstallService {
    async installApplication(params) {
        const appRegistration = await this.appRegistrationRepository.findOne({
            where: {
                id: params.appRegistrationId
            }
        });
        if (!appRegistration) {
            throw new _applicationexception.ApplicationException(`Application registration with id ${params.appRegistrationId} not found`, _applicationexception.ApplicationExceptionCode.APPLICATION_NOT_FOUND);
        }
        if (appRegistration.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL) {
            this.logger.log(`Skipping install for LOCAL app ${appRegistration.universalIdentifier} (files synced by CLI watcher in dev mode)`);
            return true;
        }
        if (appRegistration.sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.OAUTH_ONLY) {
            this.logger.log(`Skipping install for OAUTH_ONLY app ${appRegistration.universalIdentifier} (OAuth-only clients have no code artifacts)`);
            return true;
        }
        const lockKey = `app-install:${params.workspaceId}:${appRegistration.universalIdentifier}`;
        return this.cacheLockService.withLock(()=>this.doInstallApplication(appRegistration, {
                version: params.version,
                workspaceId: params.workspaceId
            }), lockKey, {
            ttl: 60_000,
            ms: 500,
            maxRetries: 120
        });
    }
    async doInstallApplication(appRegistration, params) {
        let resolvedPackage = null;
        try {
            resolvedPackage = await this.applicationPackageFetcherService.resolvePackage(appRegistration, {
                targetVersion: params.version
            });
            if (!resolvedPackage) {
                return true;
            }
            const universalIdentifier = appRegistration.universalIdentifier;
            const { application, wasCreated } = await this.ensureApplicationExists({
                universalIdentifier,
                name: resolvedPackage.manifest.application.displayName,
                workspaceId: params.workspaceId,
                applicationRegistrationId: appRegistration.id,
                sourceType: appRegistration.sourceType
            });
            await this.writeFilesToStorage(resolvedPackage.extractedDir, resolvedPackage.manifest, universalIdentifier, params.workspaceId);
            const { hasSchemaMetadataChanged } = await this.applicationSyncService.synchronizeFromManifest({
                workspaceId: params.workspaceId,
                manifest: resolvedPackage.manifest,
                applicationRegistrationId: appRegistration.id
            });
            if (wasCreated || hasSchemaMetadataChanged) {
                await this.sdkClientGenerationService.generateSdkClientForApplication({
                    workspaceId: params.workspaceId,
                    applicationId: application.id,
                    applicationUniversalIdentifier: universalIdentifier
                });
            }
            this.logger.log(`Successfully installed app ${universalIdentifier} v${resolvedPackage.packageJson.version ?? 'unknown'}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to install app ${appRegistration.universalIdentifier}: ${error}`);
            throw error;
        } finally{
            if (resolvedPackage) {
                await this.applicationPackageFetcherService.cleanupExtractedDir(resolvedPackage.cleanupDir);
            }
        }
    }
    async writeFilesToStorage(extractedDir, manifest, applicationUniversalIdentifier, workspaceId) {
        const filesToWrite = this.buildFileList(manifest);
        for (const { relativePath, fileFolder } of filesToWrite){
            const absolutePath = (0, _path.resolve)(extractedDir, relativePath);
            if (!absolutePath.startsWith(extractedDir)) {
                throw new _applicationexception.ApplicationException(`Path traversal detected for file: ${relativePath}`, _applicationexception.ApplicationExceptionCode.INVALID_INPUT);
            }
            let content;
            try {
                content = await _fs.promises.readFile(absolutePath);
            } catch  {
                throw new _applicationexception.ApplicationException(`File not found in package: ${relativePath}`, _applicationexception.ApplicationExceptionCode.PACKAGE_RESOLUTION_FAILED);
            }
            // TODO: mimeType should be defined, default to application/octet-stream, which won't be displayed
            // inline by the browser (forced download) due to Content-Disposition security headers.
            await this.fileStorageService.writeFile({
                sourceFile: content,
                mimeType: undefined,
                fileFolder,
                applicationUniversalIdentifier,
                workspaceId,
                resourcePath: relativePath,
                settings: {
                    isTemporaryFile: false,
                    toDelete: false
                }
            });
        }
    }
    buildFileList(manifest) {
        const files = [];
        files.push({
            relativePath: 'package.json',
            fileFolder: _types.FileFolder.Dependencies
        }, {
            relativePath: 'manifest.json',
            fileFolder: _types.FileFolder.Source
        });
        for (const logicFunction of manifest.logicFunctions ?? []){
            files.push({
                relativePath: logicFunction.builtHandlerPath,
                fileFolder: _types.FileFolder.BuiltLogicFunction
            });
        }
        for (const frontComponent of manifest.frontComponents ?? []){
            files.push({
                relativePath: frontComponent.builtComponentPath,
                fileFolder: _types.FileFolder.BuiltFrontComponent
            });
        }
        for (const publicAsset of manifest.publicAssets ?? []){
            files.push({
                relativePath: publicAsset.filePath,
                fileFolder: _types.FileFolder.PublicAsset
            });
        }
        return files;
    }
    async ensureApplicationExists(params) {
        const existing = await this.applicationService.findByUniversalIdentifier({
            universalIdentifier: params.universalIdentifier,
            workspaceId: params.workspaceId
        });
        if ((0, _utils.isDefined)(existing)) {
            return {
                application: existing,
                wasCreated: false
            };
        }
        const application = await this.applicationService.create({
            universalIdentifier: params.universalIdentifier,
            name: params.name,
            sourcePath: params.universalIdentifier,
            sourceType: params.sourceType,
            applicationRegistrationId: params.applicationRegistrationId,
            workspaceId: params.workspaceId
        });
        return {
            application,
            wasCreated: true
        };
    }
    constructor(appRegistrationRepository, applicationService, applicationPackageFetcherService, applicationSyncService, fileStorageService, cacheLockService, sdkClientGenerationService){
        this.appRegistrationRepository = appRegistrationRepository;
        this.applicationService = applicationService;
        this.applicationPackageFetcherService = applicationPackageFetcherService;
        this.applicationSyncService = applicationSyncService;
        this.fileStorageService = fileStorageService;
        this.cacheLockService = cacheLockService;
        this.sdkClientGenerationService = sdkClientGenerationService;
        this.logger = new _common.Logger(ApplicationInstallService.name);
    }
};
ApplicationInstallService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _applicationpackagefetcherservice.ApplicationPackageFetcherService === "undefined" ? Object : _applicationpackagefetcherservice.ApplicationPackageFetcherService,
        typeof _applicationsyncservice.ApplicationSyncService === "undefined" ? Object : _applicationsyncservice.ApplicationSyncService,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _cachelockservice.CacheLockService === "undefined" ? Object : _cachelockservice.CacheLockService,
        typeof _sdkclientgenerationservice.SdkClientGenerationService === "undefined" ? Object : _sdkclientgenerationservice.SdkClientGenerationService
    ])
], ApplicationInstallService);

//# sourceMappingURL=application-install.service.js.map