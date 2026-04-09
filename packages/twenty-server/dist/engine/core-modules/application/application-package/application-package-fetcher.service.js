"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApplicationPackageFetcherService", {
    enumerable: true,
    get: function() {
        return ApplicationPackageFetcherService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _child_process = require("child_process");
const _fs = require("fs");
const _os = require("os");
const _path = require("path");
const _util = require("util");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _applicationregistrationsourcetypeenum = require("../application-registration/enums/application-registration-source-type.enum");
const _applicationexception = require("../application.exception");
const _applicationentity = require("../application.entity");
const _yarnenginedirname = require("./constants/yarn-engine-dirname");
const _assertvalidnpmpackagenameutil = require("./utils/assert-valid-npm-package-name.util");
const _extracttarballsecurelyutil = require("./utils/extract-tarball-securely.util");
const _readjsonfileutil = require("./utils/read-json-file.util");
const _tarballutils = require("./utils/tarball-utils");
const _filestorageservice = require("../../file-storage/file-storage.service");
const _fileentity = require("../../file/entities/file.entity");
const _removefilefolderfromfileentitypathutils = require("../../file/utils/remove-file-folder-from-file-entity-path.utils");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _streamtobuffer = require("../../../../utils/stream-to-buffer");
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
const execFilePromise = (0, _util.promisify)(_child_process.execFile);
const APP_FETCHER_TMPDIR = (0, _path.join)((0, _os.tmpdir)(), 'twenty-app-fetcher');
const RESOLUTION_TIMEOUT_MS = 30_000;
let ApplicationPackageFetcherService = class ApplicationPackageFetcherService {
    async onModuleInit() {
        try {
            await _fs.promises.rm(APP_FETCHER_TMPDIR, {
                recursive: true,
                force: true
            });
        } catch  {
        // best-effort cleanup of stale temp files from previous runs
        }
    }
    async resolveNpmPackage(packageName, targetVersion) {
        return this.resolveFromNpm(packageName, targetVersion);
    }
    async resolvePackage(appRegistration, options) {
        switch(appRegistration.sourceType){
            case _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM:
                if (!appRegistration.sourcePackage) {
                    throw new _applicationexception.ApplicationException(`App registration ${appRegistration.id} has sourceType=npm but no sourcePackage`, _applicationexception.ApplicationExceptionCode.PACKAGE_RESOLUTION_FAILED);
                }
                return this.resolveFromNpm(appRegistration.sourcePackage, options?.targetVersion);
            case _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL:
                return this.resolveFromTarball(appRegistration);
            case _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL:
            case _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.OAUTH_ONLY:
                return null;
        }
    }
    async cleanupExtractedDir(extractedDir) {
        try {
            await _fs.promises.rm(extractedDir, {
                recursive: true,
                force: true
            });
        } catch (error) {
            this.logger.warn(`Failed to clean up ${extractedDir}: ${error}`);
        }
    }
    async resolveFromNpm(packageName, targetVersion) {
        const workDir = (0, _path.join)(APP_FETCHER_TMPDIR, (0, _uuid.v4)());
        await _fs.promises.mkdir(workDir, {
            recursive: true
        });
        try {
            const registryUrl = this.twentyConfigService.get('APP_REGISTRY_URL');
            const authToken = this.twentyConfigService.get('APP_REGISTRY_TOKEN');
            (0, _assertvalidnpmpackagenameutil.assertValidNpmPackageName)(packageName);
            const versionSpec = targetVersion ?? 'latest';
            await this.writeNpmrc({
                workDir,
                packageName,
                registryUrl,
                authToken
            });
            await this.setupYarnEngine(workDir);
            await this.writeMinimalPackageJson(workDir, packageName, versionSpec);
            await this.runYarnInstall(workDir);
            const packageDir = (0, _path.join)(workDir, 'node_modules', packageName);
            const manifest = await (0, _readjsonfileutil.readJsonFileOrThrow)(packageDir, 'manifest.json');
            const packageJson = await (0, _readjsonfileutil.readJsonFileOrThrow)(packageDir, 'package.json');
            return {
                extractedDir: packageDir,
                cleanupDir: workDir,
                manifest,
                packageJson
            };
        } catch (error) {
            await this.cleanupExtractedDir(workDir);
            throw new _applicationexception.ApplicationException(`Failed to resolve npm package ${packageName}: ${error}`, _applicationexception.ApplicationExceptionCode.PACKAGE_RESOLUTION_FAILED);
        }
    }
    async resolveFromTarball(appRegistration) {
        if (!(0, _utils.isDefined)(appRegistration.tarballFileId)) {
            throw new _applicationexception.ApplicationException(`App registration ${appRegistration.id} has sourceType=tarball but no tarball file`, _applicationexception.ApplicationExceptionCode.TARBALL_EXTRACTION_FAILED);
        }
        const workDir = (0, _path.join)(APP_FETCHER_TMPDIR, (0, _uuid.v4)());
        await _fs.promises.mkdir(workDir, {
            recursive: true
        });
        try {
            const file = await this.fileRepository.findOneOrFail({
                where: {
                    id: appRegistration.tarballFileId
                }
            });
            const application = await this.applicationRepository.findOneOrFail({
                where: {
                    id: file.applicationId
                }
            });
            const tarballStream = await this.fileStorageService.readFile({
                workspaceId: file.workspaceId,
                applicationUniversalIdentifier: application.universalIdentifier,
                fileFolder: _types.FileFolder.AppTarball,
                resourcePath: (0, _removefilefolderfromfileentitypathutils.removeFileFolderFromFileEntityPath)(file.path)
            });
            const tarballBuffer = await (0, _streamtobuffer.streamToBuffer)(tarballStream);
            const tarballPath = (0, _path.join)(workDir, 'app.tar.gz');
            await _fs.promises.writeFile(tarballPath, tarballBuffer);
            await (0, _extracttarballsecurelyutil.extractTarballSecurely)(tarballPath, workDir);
            await _fs.promises.rm(tarballPath);
            const contentDir = await (0, _tarballutils.resolvePackageContentDir)(workDir);
            const manifest = await (0, _readjsonfileutil.readJsonFileOrThrow)(contentDir, 'manifest.json');
            const packageJson = await (0, _readjsonfileutil.readJsonFileOrThrow)(contentDir, 'package.json');
            return {
                extractedDir: contentDir,
                cleanupDir: workDir,
                manifest,
                packageJson
            };
        } catch (error) {
            await this.cleanupExtractedDir(workDir);
            if (error instanceof _applicationexception.ApplicationException) {
                throw error;
            }
            throw new _applicationexception.ApplicationException(`Failed to resolve tarball for app ${appRegistration.universalIdentifier}: ${error}`, _applicationexception.ApplicationExceptionCode.TARBALL_EXTRACTION_FAILED);
        }
    }
    // Note: .npmrc settings take precedence over publishConfig.registry in
    // individual packages. This is correct for our use case since we want
    // to control the registry at the resolver level.
    async writeNpmrc(config) {
        const lines = [];
        const registryHost = new URL(config.registryUrl).host;
        if (config.packageName.startsWith('@')) {
            const scope = config.packageName.split('/')[0];
            lines.push(`${scope}:registry=${config.registryUrl}`);
        } else if (config.registryUrl !== 'https://registry.npmjs.org') {
            lines.push(`registry=${config.registryUrl}`);
        }
        if (config.authToken) {
            lines.push(`//${registryHost}/:_authToken=${config.authToken}`);
        }
        if (lines.length > 0) {
            await _fs.promises.writeFile((0, _path.join)(config.workDir, '.npmrc'), lines.join('\n') + '\n');
        }
    }
    async setupYarnEngine(workDir) {
        await _fs.promises.cp(_yarnenginedirname.YARN_ENGINE_DIRNAME, workDir, {
            recursive: true
        });
    }
    async writeMinimalPackageJson(workDir, packageName, versionSpec) {
        const packageJson = {
            name: 'twenty-app-resolver-workspace',
            private: true,
            dependencies: {
                [packageName]: versionSpec
            }
        };
        await _fs.promises.writeFile((0, _path.join)(workDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    }
    async resolveLocalYarnPath(workDir) {
        const yarnrcPath = (0, _path.join)(workDir, '.yarnrc.yml');
        const yarnrcContent = await _fs.promises.readFile(yarnrcPath, 'utf-8');
        const match = yarnrcContent.match(/^yarnPath:\s*(.+)$/m);
        if (!match) {
            throw new _applicationexception.ApplicationException('yarnPath not found in .yarnrc.yml', _applicationexception.ApplicationExceptionCode.PACKAGE_RESOLUTION_FAILED);
        }
        return (0, _path.join)(workDir, match[1].trim());
    }
    async runYarnInstall(workDir) {
        const localYarnPath = await this.resolveLocalYarnPath(workDir);
        const { NODE_OPTIONS: _nodeOptions, ...cleanEnv } = process.env;
        try {
            await execFilePromise(process.execPath, [
                localYarnPath,
                'install',
                '--no-immutable'
            ], {
                cwd: workDir,
                env: cleanEnv,
                timeout: RESOLUTION_TIMEOUT_MS
            });
        } catch (error) {
            const stderr = (0, _utils.isDefined)(error) && typeof error === 'object' && 'stderr' in error && typeof error.stderr === 'string' ? error.stderr : undefined;
            const message = stderr ?? (error instanceof Error ? error.message : String(error));
            throw new _applicationexception.ApplicationException(`yarn install failed: ${message}`, _applicationexception.ApplicationExceptionCode.PACKAGE_RESOLUTION_FAILED);
        }
    }
    constructor(twentyConfigService, fileStorageService, fileRepository, applicationRepository){
        this.twentyConfigService = twentyConfigService;
        this.fileStorageService = fileStorageService;
        this.fileRepository = fileRepository;
        this.applicationRepository = applicationRepository;
        this.logger = new _common.Logger(ApplicationPackageFetcherService.name);
    }
};
ApplicationPackageFetcherService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(2, (0, _typeorm.InjectRepository)(_fileentity.FileEntity)),
    _ts_param(3, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ApplicationPackageFetcherService);

//# sourceMappingURL=application-package-fetcher.service.js.map