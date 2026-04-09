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
    get ApplicationTarballService () {
        return ApplicationTarballService;
    },
    get MAX_TARBALL_UPLOAD_SIZE_BYTES () {
        return MAX_TARBALL_UPLOAD_SIZE_BYTES;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _fs = require("fs");
const _os = require("os");
const _path = require("path");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _applicationregistrationentity = require("./application-registration.entity");
const _applicationregistrationexception = require("./application-registration.exception");
const _applicationregistrationsourcetypeenum = require("./enums/application-registration-source-type.enum");
const _extracttarballsecurelyutil = require("../application-package/utils/extract-tarball-securely.util");
const _readjsonfileutil = require("../application-package/utils/read-json-file.util");
const _tarballutils = require("../application-package/utils/tarball-utils");
const _applicationservice = require("../application.service");
const _filestorageservice = require("../../file-storage/file-storage.service");
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
const MAX_TARBALL_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024;
let ApplicationTarballService = class ApplicationTarballService {
    async uploadTarball(params) {
        const tempDir = (0, _path.join)((0, _os.tmpdir)(), 'twenty-tarball-upload', (0, _uuid.v4)());
        await _fs.promises.mkdir(tempDir, {
            recursive: true
        });
        try {
            const tarballPath = (0, _path.join)(tempDir, 'app.tar.gz');
            await _fs.promises.writeFile(tarballPath, params.tarballBuffer);
            const extractDir = (0, _path.join)(tempDir, 'extracted');
            await _fs.promises.mkdir(extractDir, {
                recursive: true
            });
            await (0, _extracttarballsecurelyutil.extractTarballSecurely)(tarballPath, extractDir);
            const contentDir = await (0, _tarballutils.resolvePackageContentDir)(extractDir);
            const manifest = await (0, _readjsonfileutil.readJsonFile)(contentDir, 'manifest.json');
            if (manifest === null) {
                throw new _applicationregistrationexception.ApplicationRegistrationException('manifest.json not found or invalid in tarball', _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_INPUT);
            }
            const universalIdentifier = params.universalIdentifier ?? manifest.application?.universalIdentifier;
            if (!(0, _utils.isDefined)(universalIdentifier)) {
                throw new _applicationregistrationexception.ApplicationRegistrationException('universalIdentifier is required (in body or manifest)', _applicationregistrationexception.ApplicationRegistrationExceptionCode.INVALID_INPUT);
            }
            let appRegistration = await this.appRegistrationRepository.findOne({
                where: {
                    universalIdentifier,
                    ownerWorkspaceId: params.ownerWorkspaceId
                }
            });
            if ((0, _utils.isDefined)(appRegistration)) {
                if (appRegistration.sourceType !== _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL && appRegistration.sourceType !== _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL) {
                    throw new _applicationregistrationexception.ApplicationRegistrationException(`This app is registered as ${appRegistration.sourceType}. Cannot upload tarball.`, _applicationregistrationexception.ApplicationRegistrationExceptionCode.SOURCE_CHANNEL_MISMATCH);
                }
            } else {
                appRegistration = this.appRegistrationRepository.create({
                    universalIdentifier,
                    name: manifest.application?.displayName ?? 'Unknown App',
                    sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL,
                    oAuthClientId: (0, _uuid.v4)(),
                    oAuthRedirectUris: [],
                    oAuthScopes: [],
                    ownerWorkspaceId: params.ownerWorkspaceId
                });
                appRegistration = await this.appRegistrationRepository.save(appRegistration);
            }
            const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
                workspaceId: params.ownerWorkspaceId
            });
            const savedFile = await this.fileStorageService.writeFile({
                sourceFile: params.tarballBuffer,
                resourcePath: `${appRegistration.id}/app.tar.gz`,
                mimeType: 'application/gzip',
                fileFolder: _types.FileFolder.AppTarball,
                applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
                workspaceId: params.ownerWorkspaceId,
                fileId: appRegistration.tarballFileId ?? (0, _uuid.v4)(),
                settings: {
                    isTemporaryFile: false,
                    toDelete: false
                }
            });
            await this.appRegistrationRepository.update(appRegistration.id, {
                sourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL,
                tarballFileId: savedFile.id
            });
            this.logger.log(`Tarball uploaded for app ${universalIdentifier} (registration ${appRegistration.id})`);
            return this.appRegistrationRepository.findOneOrFail({
                where: {
                    id: appRegistration.id
                }
            });
        } finally{
            await _fs.promises.rm(tempDir, {
                recursive: true,
                force: true
            });
        }
    }
    constructor(appRegistrationRepository, fileStorageService, applicationService){
        this.appRegistrationRepository = appRegistrationRepository;
        this.fileStorageService = fileStorageService;
        this.applicationService = applicationService;
        this.logger = new _common.Logger(ApplicationTarballService.name);
    }
};
ApplicationTarballService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationregistrationentity.ApplicationRegistrationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService
    ])
], ApplicationTarballService);

//# sourceMappingURL=application-tarball.service.js.map