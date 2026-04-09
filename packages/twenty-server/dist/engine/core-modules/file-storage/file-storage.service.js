"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileStorageService", {
    enumerable: true,
    get: function() {
        return FileStorageService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _path = require("path");
const _typeorm1 = require("typeorm");
const _applicationentity = require("../application/application.entity");
const _filestoragedriverfactory = require("./file-storage-driver.factory");
const _fileentity = require("../file/entities/file.entity");
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
let FileStorageService = class FileStorageService {
    buildOnStoragePath({ workspaceId, applicationUniversalIdentifier, fileFolder, resourcePath }) {
        return (0, _path.join)(workspaceId, applicationUniversalIdentifier, fileFolder, resourcePath).replace(/\/+/g, '/');
    }
    async writeFile({ sourceFile, mimeType, fileFolder, applicationUniversalIdentifier, workspaceId, resourcePath, fileId, settings, queryRunner }) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        const applicationRepository = queryRunner ? queryRunner.manager.getRepository(_applicationentity.ApplicationEntity) : this.applicationRepository;
        const fileRepository = queryRunner ? queryRunner.manager.getRepository(_fileentity.FileEntity) : this.fileRepository;
        const application = await applicationRepository.findOneOrFail({
            where: {
                universalIdentifier: applicationUniversalIdentifier,
                workspaceId
            }
        });
        const onStoragePath = this.buildOnStoragePath({
            workspaceId,
            applicationUniversalIdentifier,
            fileFolder,
            resourcePath
        });
        await driver.writeFile({
            filePath: onStoragePath,
            mimeType,
            sourceFile
        });
        await fileRepository.upsert({
            path: `${fileFolder}/${resourcePath}`,
            workspaceId,
            applicationId: application.id,
            id: fileId,
            mimeType,
            size: typeof sourceFile === 'string' ? Buffer.byteLength(sourceFile) : sourceFile.length,
            settings
        }, [
            'path',
            'workspaceId',
            'applicationId'
        ]);
        return await fileRepository.findOneOrFail({
            where: {
                path: `${fileFolder}/${resourcePath}`,
                applicationId: application.id,
                workspaceId
            }
        });
    }
    async getPresignedUrl(params) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        const onStoragePath = this.buildOnStoragePath(params);
        return driver.getPresignedUrl({
            filePath: onStoragePath,
            expiresInSeconds: params.expiresInSeconds,
            responseContentType: params.responseContentType,
            responseContentDisposition: params.responseContentDisposition
        });
    }
    readFile(params) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        const onStoragePath = this.buildOnStoragePath(params);
        return driver.readFile({
            filePath: onStoragePath
        });
    }
    downloadFile(params) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        const onStoragePath = this.buildOnStoragePath(params);
        return driver.downloadFile({
            onStoragePath,
            localPath: params.localPath
        });
    }
    deleteLegacy(params) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        return driver.delete(params);
    }
    async deleteApplicationFiles({ applicationUniversalIdentifier, workspaceId }) {
        const application = await this.applicationRepository.findOneOrFail({
            where: {
                universalIdentifier: applicationUniversalIdentifier,
                workspaceId: workspaceId
            }
        });
        await this.fileRepository.delete({
            applicationId: application.id,
            workspaceId
        });
    }
    async delete(params) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        const onStoragePath = this.buildOnStoragePath(params);
        const deleteResult = driver.delete({
            folderPath: onStoragePath
        });
        const application = await this.applicationRepository.findOneOrFail({
            where: {
                universalIdentifier: params.applicationUniversalIdentifier,
                workspaceId: params.workspaceId
            }
        });
        const basePath = `${(0, _path.join)(params.fileFolder, params.resourcePath)}`.replace(/\/+/g, '/');
        await this.fileRepository.delete({
            path: (0, _typeorm1.Like)(`${basePath}%`),
            applicationId: application.id,
            workspaceId: params.workspaceId
        });
        return deleteResult;
    }
    async deleteByFileId({ fileId, workspaceId, fileFolder }) {
        const file = await this.fileRepository.findOneOrFail({
            where: {
                id: fileId,
                workspaceId,
                path: (0, _typeorm1.Like)(`${fileFolder}/%`)
            }
        });
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        await driver.delete({
            folderPath: `${file.workspaceId}/${file.applicationId}`,
            filename: file.path
        });
        await this.fileRepository.delete(fileId);
    }
    copyLegacy(params) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        return driver.copy(params);
    }
    async copy({ from, to }) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        const fromPath = this.buildOnStoragePath(from);
        const toPath = this.buildOnStoragePath(to);
        const isFile = await driver.checkFileExists({
            filePath: fromPath
        });
        if (isFile) {
            return driver.copy({
                from: {
                    folderPath: (0, _path.dirname)(fromPath),
                    filename: (0, _path.basename)(fromPath)
                },
                to: {
                    folderPath: (0, _path.dirname)(toPath),
                    filename: (0, _path.basename)(toPath)
                }
            });
        }
        return driver.copy({
            from: {
                folderPath: fromPath
            },
            to: {
                folderPath: toPath
            }
        });
    }
    checkFolderExistsLegacy(params) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        return driver.checkFolderExists(params);
    }
    checkFileExists(params) {
        const driver = this.fileStorageDriverFactory.getCurrentDriver();
        const onStoragePath = this.buildOnStoragePath(params);
        return driver.checkFileExists({
            filePath: onStoragePath
        });
    }
    constructor(fileStorageDriverFactory, fileRepository, applicationRepository){
        this.fileStorageDriverFactory = fileStorageDriverFactory;
        this.fileRepository = fileRepository;
        this.applicationRepository = applicationRepository;
    }
};
FileStorageService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_fileentity.FileEntity)),
    _ts_param(2, (0, _typeorm.InjectRepository)(_applicationentity.ApplicationEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _filestoragedriverfactory.FileStorageDriverFactory === "undefined" ? Object : _filestoragedriverfactory.FileStorageDriverFactory,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], FileStorageService);

//# sourceMappingURL=file-storage.service.js.map