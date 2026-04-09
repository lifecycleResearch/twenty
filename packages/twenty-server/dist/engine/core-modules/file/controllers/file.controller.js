"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileController", {
    enumerable: true,
    get: function() {
        return FileController;
    }
});
const _common = require("@nestjs/common");
const _path = require("path");
const _express = require("express");
const _types = require("twenty-shared/types");
const _filestorageexception = require("../../file-storage/interfaces/file-storage-exception");
const _fileexception = require("../file.exception");
const _fileapiexceptionfilter = require("../filters/file-api-exception.filter");
const _filebyidguard = require("../guards/file-by-id.guard");
const _fileservice = require("../services/file.service");
const _setfileresponseheadersutils = require("../utils/set-file-response-headers.utils");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _publicendpointguard = require("../../../guards/public-endpoint.guard");
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
let FileController = class FileController {
    async getPublicAssets(res, req, workspaceId, applicationId) {
        const filepath = (0, _path.join)(...req.params.path);
        try {
            const { stream, mimeType } = await this.fileService.getFileStreamByPath({
                workspaceId,
                applicationId,
                fileFolder: _types.FileFolder.PublicAsset,
                filepath
            });
            (0, _setfileresponseheadersutils.setFileResponseHeaders)(res, mimeType);
            stream.on('error', ()=>{
                throw new _fileexception.FileException('Error streaming file from storage', _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR);
            });
            stream.pipe(res);
        } catch (error) {
            if (error instanceof _filestorageexception.FileStorageException && error.code === _filestorageexception.FileStorageExceptionCode.FILE_NOT_FOUND) {
                throw new _fileexception.FileException('File not found', _fileexception.FileExceptionCode.FILE_NOT_FOUND);
            }
            throw new _fileexception.FileException(`Error retrieving file: ${error.message}`, _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }
    async getFileById(res, req, fileFolder, fileId) {
        // oxlint-disable-next-line @typescripttypescript/no-explicit-any
        const workspaceId = req?.workspaceId;
        try {
            const fileResponse = await this.fileService.getFileResponseById({
                fileId,
                workspaceId,
                fileFolder
            });
            if (fileResponse.type === 'redirect') {
                return res.redirect(fileResponse.presignedUrl);
            }
            (0, _setfileresponseheadersutils.setFileResponseHeaders)(res, fileResponse.mimeType);
            fileResponse.stream.on('error', ()=>{
                if (!res.headersSent) {
                    res.status(500).send('Error streaming file from storage');
                    return;
                }
                res.destroy();
            });
            fileResponse.stream.pipe(res);
        } catch (error) {
            if (error instanceof _filestorageexception.FileStorageException && error.code === _filestorageexception.FileStorageExceptionCode.FILE_NOT_FOUND) {
                throw new _fileexception.FileException('File not found', _fileexception.FileExceptionCode.FILE_NOT_FOUND);
            }
            throw new _fileexception.FileException(`Error retrieving file: ${error.message}`, _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }
    constructor(fileService){
        this.fileService = fileService;
    }
};
_ts_decorate([
    (0, _common.Get)('public-assets/:workspaceId/:applicationId/*path'),
    (0, _common.UseGuards)(_publicendpointguard.PublicEndpointGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_param(2, (0, _common.Param)('workspaceId')),
    _ts_param(3, (0, _common.Param)('applicationId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        typeof _express.Request === "undefined" ? Object : _express.Request,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FileController.prototype, "getPublicAssets", null);
_ts_decorate([
    (0, _common.Get)('file/:fileFolder/:id'),
    (0, _common.UseGuards)(_filebyidguard.FileByIdGuard, _nopermissionguard.NoPermissionGuard),
    _ts_param(0, (0, _common.Res)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_param(2, (0, _common.Param)('fileFolder')),
    _ts_param(3, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Response === "undefined" ? Object : _express.Response,
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _filebyidguard.SupportedFileFolder === "undefined" ? Object : _filebyidguard.SupportedFileFolder,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FileController.prototype, "getFileById", null);
FileController = _ts_decorate([
    (0, _common.Controller)(),
    (0, _common.UseFilters)(_fileapiexceptionfilter.FileApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _fileservice.FileService === "undefined" ? Object : _fileservice.FileService
    ])
], FileController);

//# sourceMappingURL=file.controller.js.map