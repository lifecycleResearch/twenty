"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileService", {
    enumerable: true,
    get: function() {
        return FileService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _applicationentity = require("../../application/application.entity");
const _authcontexttype = require("../../auth/types/auth-context.type");
const _filestorageservice = require("../../file-storage/file-storage.service");
const _fileentity = require("../entities/file.entity");
const _removefilefolderfromfileentitypathutils = require("../utils/remove-file-folder-from-file-entity-path.utils");
const _getcontentdispositionutils = require("../utils/get-content-disposition.utils");
const _jwtwrapperservice = require("../../jwt/services/jwt-wrapper.service");
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
let FileService = class FileService {
    async getFileStreamByPath({ workspaceId, applicationId, filepath, fileFolder }) {
        const file = await this.fileRepository.findOneOrFail({
            where: {
                path: `${fileFolder}/${filepath}`,
                workspaceId,
                applicationId
            }
        });
        const application = await this.applicationRepository.findOneOrFail({
            where: {
                id: applicationId,
                workspaceId
            }
        });
        const stream = await this.fileStorageService.readFile({
            resourcePath: filepath,
            fileFolder,
            applicationUniversalIdentifier: application.universalIdentifier,
            workspaceId
        });
        return {
            stream,
            mimeType: file.mimeType
        };
    }
    async getFileStreamById({ fileId, workspaceId, fileFolder }) {
        const file = await this.fileRepository.findOneOrFail({
            where: {
                id: fileId,
                workspaceId,
                path: (0, _typeorm1.Like)(`${fileFolder}/%`)
            }
        });
        const application = await this.applicationRepository.findOneOrFail({
            where: {
                id: file.applicationId,
                workspaceId
            }
        });
        const stream = await this.fileStorageService.readFile({
            resourcePath: (0, _removefilefolderfromfileentitypathutils.removeFileFolderFromFileEntityPath)(file.path),
            fileFolder,
            applicationUniversalIdentifier: application.universalIdentifier,
            workspaceId
        });
        return {
            stream,
            mimeType: file.mimeType
        };
    }
    async getFileResponseById(params) {
        const file = await this.fileRepository.findOneOrFail({
            where: {
                id: params.fileId,
                workspaceId: params.workspaceId,
                path: (0, _typeorm1.Like)(`${params.fileFolder}/%`)
            }
        });
        const application = await this.applicationRepository.findOneOrFail({
            where: {
                id: file.applicationId,
                workspaceId: params.workspaceId
            }
        });
        const mimeType = file.mimeType ?? 'application/octet-stream';
        const resourceIdentifier = {
            resourcePath: (0, _removefilefolderfromfileentitypathutils.removeFileFolderFromFileEntityPath)(file.path),
            fileFolder: params.fileFolder,
            applicationUniversalIdentifier: application.universalIdentifier,
            workspaceId: params.workspaceId
        };
        const presignedUrl = await this.fileStorageService.getPresignedUrl({
            ...resourceIdentifier,
            expiresInSeconds: this.twentyConfigService.get('STORAGE_S3_PRESIGNED_URL_EXPIRES_IN'),
            responseContentType: mimeType,
            responseContentDisposition: (0, _getcontentdispositionutils.getContentDisposition)(mimeType)
        });
        if (presignedUrl) {
            return {
                type: 'redirect',
                presignedUrl
            };
        }
        const stream = await this.fileStorageService.readFile(resourceIdentifier);
        return {
            type: 'stream',
            stream,
            mimeType
        };
    }
    async getFileContentById({ fileId, workspaceId, fileFolder }) {
        const file = await this.fileRepository.findOneOrFail({
            where: {
                id: fileId,
                workspaceId,
                path: (0, _typeorm1.Like)(`${fileFolder}/%`)
            }
        });
        const application = await this.applicationRepository.findOneOrFail({
            where: {
                id: file.applicationId,
                workspaceId
            }
        });
        const stream = await this.fileStorageService.readFile({
            resourcePath: (0, _removefilefolderfromfileentitypathutils.removeFileFolderFromFileEntityPath)(file.path),
            fileFolder,
            applicationUniversalIdentifier: application.universalIdentifier,
            workspaceId
        });
        const buffer = await (0, _streamtobuffer.streamToBuffer)(stream);
        return {
            buffer,
            mimeType: file.mimeType ?? 'application/octet-stream'
        };
    }
    signFileUrl({ url, workspaceId }) {
        if (!(0, _guards.isNonEmptyString)(url)) {
            return url;
        }
        return (0, _utils.buildSignedPath)({
            path: url,
            token: this.encodeFileToken({
                filename: (0, _utils.extractFolderPathFilenameAndTypeOrThrow)(url).filename,
                workspaceId
            })
        });
    }
    encodeFileToken(payloadToEncode) {
        const fileTokenExpiresIn = this.twentyConfigService.get('FILE_TOKEN_EXPIRES_IN');
        const payload = {
            ...payloadToEncode,
            sub: payloadToEncode.workspaceId,
            type: _authcontexttype.JwtTokenTypeEnum.FILE
        };
        const secret = this.jwtWrapperService.generateAppSecret(payload.type, payloadToEncode.workspaceId);
        return this.jwtWrapperService.sign(payload, {
            secret,
            expiresIn: fileTokenExpiresIn
        });
    }
    async deleteFile({ folderPath, filename, workspaceId }) {
        const workspaceFolderPath = `workspace-${workspaceId}/${folderPath}`;
        return await this.fileStorageService.deleteLegacy({
            folderPath: workspaceFolderPath,
            filename
        });
    }
    async deleteWorkspaceFolder(workspaceId) {
        const workspaceFolderPath = `workspace-${workspaceId}`;
        const isWorkspaceFolderFound = await this.fileStorageService.checkFolderExistsLegacy({
            folderPath: workspaceFolderPath
        });
        if (!isWorkspaceFolderFound) {
            return;
        }
        return await this.fileStorageService.deleteLegacy({
            folderPath: workspaceFolderPath
        });
    }
    constructor(jwtWrapperService, fileStorageService, twentyConfigService, fileRepository, applicationRepository){
        this.jwtWrapperService = jwtWrapperService;
        this.fileStorageService = fileStorageService;
        this.twentyConfigService = twentyConfigService;
        this.fileRepository = fileRepository;
        this.applicationRepository = applicationRepository;
    }
};
FileService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(3, (0, _typeorm.InjectRepository)(_fileentity.FileEntity)),
    _ts_param(4, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwtwrapperservice.JwtWrapperService === "undefined" ? Object : _jwtwrapperservice.JwtWrapperService,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], FileService);

//# sourceMappingURL=file.service.js.map