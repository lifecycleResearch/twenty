"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _stream = require("stream");
const _types = require("twenty-shared/types");
const _filestorageexception = require("../../file-storage/interfaces/file-storage-exception");
const _fileexception = require("../file.exception");
const _fileapiexceptionfilter = require("../filters/file-api-exception.filter");
const _filebyidguard = require("../guards/file-by-id.guard");
const _fileservice = require("../services/file.service");
const _publicendpointguard = require("../../../guards/public-endpoint.guard");
const _nopermissionguard = require("../../../guards/no-permission.guard");
const _filecontroller = require("./file.controller");
const createMockStream = ()=>{
    const stream = new _stream.Readable();
    stream.push('file content');
    stream.push(null);
    stream.pipe = jest.fn();
    return stream;
};
const createMockResponse = ()=>({
        setHeader: jest.fn(),
        redirect: jest.fn()
    });
describe('FileController', ()=>{
    let controller;
    let fileService;
    const mock_FileByIdGuard = {
        canActivate: jest.fn(()=>true)
    };
    const mock_PublicEndpointGuard = {
        canActivate: jest.fn(()=>true)
    };
    const mock_NoPermissionGuard = {
        canActivate: jest.fn(()=>true)
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _filecontroller.FileController
            ],
            providers: [
                {
                    provide: _fileservice.FileService,
                    useValue: {
                        getFileStreamById: jest.fn(),
                        getFileStreamByPath: jest.fn(),
                        getFileResponseById: jest.fn()
                    }
                }
            ]
        }).overrideGuard(_filebyidguard.FileByIdGuard).useValue(mock_FileByIdGuard).overrideGuard(_publicendpointguard.PublicEndpointGuard).useValue(mock_PublicEndpointGuard).overrideGuard(_nopermissionguard.NoPermissionGuard).useValue(mock_NoPermissionGuard).overrideFilter(_fileapiexceptionfilter.FileApiExceptionFilter).useValue({}).compile();
        controller = module.get(_filecontroller.FileController);
        fileService = module.get(_fileservice.FileService);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
    describe('getFileById', ()=>{
        it('should 302 redirect when presigned URL is available', async ()=>{
            jest.spyOn(fileService, 'getFileResponseById').mockResolvedValue({
                type: 'redirect',
                presignedUrl: 'https://s3.example.com/file?signed=abc'
            });
            const mockRequest = {
                workspaceId: 'workspace-id'
            };
            const mockResponse = createMockResponse();
            await controller.getFileById(mockResponse, mockRequest, _types.FileFolder.Workflow, 'file-123');
            expect(fileService.getFileResponseById).toHaveBeenCalledWith({
                fileId: 'file-123',
                workspaceId: 'workspace-id',
                fileFolder: _types.FileFolder.Workflow
            });
            expect(mockResponse.redirect).toHaveBeenCalledWith('https://s3.example.com/file?signed=abc');
            expect(mockResponse.setHeader).not.toHaveBeenCalled();
        });
        it('should stream with headers when no presigned URL (local driver)', async ()=>{
            const mockStream = createMockStream();
            jest.spyOn(fileService, 'getFileResponseById').mockResolvedValue({
                type: 'stream',
                stream: mockStream,
                mimeType: 'image/png'
            });
            const mockRequest = {
                workspaceId: 'workspace-id'
            };
            const mockResponse = createMockResponse();
            await controller.getFileById(mockResponse, mockRequest, _types.FileFolder.CorePicture, 'file-123');
            expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png');
            expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
            expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', 'inline');
            expect(mockStream.pipe).toHaveBeenCalledWith(mockResponse);
        });
        it('should force attachment disposition for non-safe MIME types', async ()=>{
            const mockStream = createMockStream();
            jest.spyOn(fileService, 'getFileResponseById').mockResolvedValue({
                type: 'stream',
                stream: mockStream,
                mimeType: 'text/html'
            });
            const mockRequest = {
                workspaceId: 'workspace-id'
            };
            const mockResponse = createMockResponse();
            await controller.getFileById(mockResponse, mockRequest, _types.FileFolder.Workflow, 'file-123');
            expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html');
            expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment');
        });
        it('should throw FileException with FILE_NOT_FOUND when file is not found', async ()=>{
            jest.spyOn(fileService, 'getFileResponseById').mockRejectedValue(new _filestorageexception.FileStorageException('File not found', _filestorageexception.FileStorageExceptionCode.FILE_NOT_FOUND));
            const mockRequest = {
                workspaceId: 'workspace-id'
            };
            const mockResponse = createMockResponse();
            await expect(controller.getFileById(mockResponse, mockRequest, _types.FileFolder.FilesField, 'missing-file')).rejects.toThrow(new _fileexception.FileException('File not found', _fileexception.FileExceptionCode.FILE_NOT_FOUND));
        });
        it('should throw FileException with INTERNAL_SERVER_ERROR for unexpected errors', async ()=>{
            jest.spyOn(fileService, 'getFileResponseById').mockRejectedValue(new Error('Storage unavailable'));
            const mockRequest = {
                workspaceId: 'workspace-id'
            };
            const mockResponse = createMockResponse();
            await expect(controller.getFileById(mockResponse, mockRequest, _types.FileFolder.Workflow, 'file-456')).rejects.toThrow(new _fileexception.FileException('Error retrieving file: Storage unavailable', _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR));
        });
    });
    describe('getPublicAssets', ()=>{
        it('should call fileService.getFileStreamByPath and pipe with headers', async ()=>{
            const mockStream = createMockStream();
            jest.spyOn(fileService, 'getFileStreamByPath').mockResolvedValue({
                stream: mockStream,
                mimeType: 'image/png'
            });
            const mockRequest = {
                params: {
                    path: [
                        'images',
                        'logo.png'
                    ]
                }
            };
            const mockResponse = createMockResponse();
            await controller.getPublicAssets(mockResponse, mockRequest, 'workspace-id', 'app-id');
            expect(fileService.getFileStreamByPath).toHaveBeenCalledWith({
                workspaceId: 'workspace-id',
                applicationId: 'app-id',
                fileFolder: _types.FileFolder.PublicAsset,
                filepath: 'images/logo.png'
            });
            expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png');
            expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
            expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', 'inline');
            expect(mockStream.pipe).toHaveBeenCalledWith(mockResponse);
        });
        it('should handle single-segment path', async ()=>{
            const mockStream = createMockStream();
            jest.spyOn(fileService, 'getFileStreamByPath').mockResolvedValue({
                stream: mockStream,
                mimeType: 'image/x-icon'
            });
            const mockRequest = {
                params: {
                    path: [
                        'favicon.ico'
                    ]
                }
            };
            const mockResponse = createMockResponse();
            await controller.getPublicAssets(mockResponse, mockRequest, 'workspace-id', 'app-id');
            expect(fileService.getFileStreamByPath).toHaveBeenCalledWith({
                workspaceId: 'workspace-id',
                applicationId: 'app-id',
                fileFolder: _types.FileFolder.PublicAsset,
                filepath: 'favicon.ico'
            });
        });
        it('should throw FileException with FILE_NOT_FOUND when asset is not found', async ()=>{
            jest.spyOn(fileService, 'getFileStreamByPath').mockRejectedValue(new _filestorageexception.FileStorageException('File not found', _filestorageexception.FileStorageExceptionCode.FILE_NOT_FOUND));
            const mockRequest = {
                params: {
                    path: [
                        'missing-asset.png'
                    ]
                }
            };
            const mockResponse = createMockResponse();
            await expect(controller.getPublicAssets(mockResponse, mockRequest, 'workspace-id', 'app-id')).rejects.toThrow(new _fileexception.FileException('File not found', _fileexception.FileExceptionCode.FILE_NOT_FOUND));
        });
        it('should throw FileException with INTERNAL_SERVER_ERROR for unexpected errors', async ()=>{
            jest.spyOn(fileService, 'getFileStreamByPath').mockRejectedValue(new Error('Connection refused'));
            const mockRequest = {
                params: {
                    path: [
                        'broken-asset.png'
                    ]
                }
            };
            const mockResponse = createMockResponse();
            await expect(controller.getPublicAssets(mockResponse, mockRequest, 'workspace-id', 'app-id')).rejects.toThrow(new _fileexception.FileException('Error retrieving file: Connection refused', _fileexception.FileExceptionCode.INTERNAL_SERVER_ERROR));
        });
    });
});

//# sourceMappingURL=file.controller.spec.js.map