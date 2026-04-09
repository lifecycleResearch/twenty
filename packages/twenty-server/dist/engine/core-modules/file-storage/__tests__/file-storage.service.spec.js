"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _applicationentity = require("../../application/application.entity");
const _filestoragedriverfactory = require("../file-storage-driver.factory");
const _filestorageservice = require("../file-storage.service");
const _fileentity = require("../../file/entities/file.entity");
describe('FileStorageService', ()=>{
    let service;
    let fileStorageDriverFactory;
    const mockFileStorageDriverFactory = {
        getCurrentDriver: jest.fn()
    };
    const mockFileRepository = {
        save: jest.fn()
    };
    const mockApplicationRepository = {
        findOneOrFail: jest.fn()
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _filestorageservice.FileStorageService,
                {
                    provide: _filestoragedriverfactory.FileStorageDriverFactory,
                    useValue: mockFileStorageDriverFactory
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_fileentity.FileEntity),
                    useValue: mockFileRepository
                },
                {
                    provide: (0, _typeorm.getRepositoryToken)(_applicationentity.ApplicationEntity),
                    useValue: mockApplicationRepository
                }
            ]
        }).compile();
        service = module.get(_filestorageservice.FileStorageService);
        fileStorageDriverFactory = module.get(_filestoragedriverfactory.FileStorageDriverFactory);
        jest.clearAllMocks();
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
    describe('storage operations', ()=>{
        let mockDriver;
        beforeEach(()=>{
            mockDriver = {
                writeFile: jest.fn(),
                readFile: jest.fn(),
                delete: jest.fn(),
                move: jest.fn(),
                copy: jest.fn(),
                downloadFolder: jest.fn(),
                uploadFolder: jest.fn(),
                checkFileExists: jest.fn(),
                checkFolderExists: jest.fn(),
                getPresignedUrl: jest.fn()
            };
            mockFileStorageDriverFactory.getCurrentDriver.mockReturnValue(mockDriver);
        });
        describe('deleteLegacy', ()=>{
            it('should delegate to the current driver with filename', async ()=>{
                const deleteParams = {
                    folderPath: 'documents',
                    filename: 'test.txt'
                };
                mockDriver.delete.mockResolvedValue(undefined);
                await service.deleteLegacy(deleteParams);
                expect(fileStorageDriverFactory.getCurrentDriver).toHaveBeenCalled();
                expect(mockDriver.delete).toHaveBeenCalledWith(deleteParams);
            });
            it('should delegate to the current driver without filename (delete folder)', async ()=>{
                const deleteParams = {
                    folderPath: 'documents'
                };
                mockDriver.delete.mockResolvedValue(undefined);
                await service.deleteLegacy(deleteParams);
                expect(fileStorageDriverFactory.getCurrentDriver).toHaveBeenCalled();
                expect(mockDriver.delete).toHaveBeenCalledWith(deleteParams);
            });
            it('should handle delete errors', async ()=>{
                const deleteParams = {
                    folderPath: 'documents',
                    filename: 'test.txt'
                };
                const error = new Error('Delete failed');
                mockDriver.delete.mockRejectedValue(error);
                await expect(service.deleteLegacy(deleteParams)).rejects.toThrow('Delete failed');
                expect(fileStorageDriverFactory.getCurrentDriver).toHaveBeenCalled();
                expect(mockDriver.delete).toHaveBeenCalledWith(deleteParams);
            });
        });
        describe('copyLegacy', ()=>{
            it('should delegate to the current driver', async ()=>{
                const copyParams = {
                    from: {
                        folderPath: 'documents',
                        filename: 'test.txt'
                    },
                    to: {
                        folderPath: 'backup',
                        filename: 'test-backup.txt'
                    }
                };
                mockDriver.copy.mockResolvedValue(undefined);
                await service.copyLegacy(copyParams);
                expect(fileStorageDriverFactory.getCurrentDriver).toHaveBeenCalled();
                expect(mockDriver.copy).toHaveBeenCalledWith(copyParams);
            });
            it('should handle copy errors', async ()=>{
                const copyParams = {
                    from: {
                        folderPath: 'documents',
                        filename: 'test.txt'
                    },
                    to: {
                        folderPath: 'backup',
                        filename: 'test-backup.txt'
                    }
                };
                const error = new Error('Copy failed');
                mockDriver.copy.mockRejectedValue(error);
                await expect(service.copyLegacy(copyParams)).rejects.toThrow('Copy failed');
                expect(fileStorageDriverFactory.getCurrentDriver).toHaveBeenCalled();
                expect(mockDriver.copy).toHaveBeenCalledWith(copyParams);
            });
        });
        describe('getPresignedUrl', ()=>{
            it('should delegate to the driver and return the URL', async ()=>{
                mockDriver.getPresignedUrl.mockResolvedValue('https://s3.example.com/signed');
                mockApplicationRepository.findOneOrFail.mockResolvedValue({
                    universalIdentifier: 'app-uid'
                });
                const result = await service.getPresignedUrl({
                    resourcePath: 'file.txt',
                    fileFolder: 'workflow',
                    applicationUniversalIdentifier: 'app-uid',
                    workspaceId: 'ws-id',
                    responseContentType: 'image/png',
                    responseContentDisposition: 'inline'
                });
                expect(result).toBe('https://s3.example.com/signed');
                expect(mockDriver.getPresignedUrl).toHaveBeenCalled();
            });
            it('should return null when driver returns null', async ()=>{
                mockDriver.getPresignedUrl.mockResolvedValue(null);
                mockApplicationRepository.findOneOrFail.mockResolvedValue({
                    universalIdentifier: 'app-uid'
                });
                const result = await service.getPresignedUrl({
                    resourcePath: 'file.txt',
                    fileFolder: 'workflow',
                    applicationUniversalIdentifier: 'app-uid',
                    workspaceId: 'ws-id'
                });
                expect(result).toBeNull();
            });
        });
        describe('checkFolderExistsLegacy', ()=>{
            it('should delegate to the current driver and return true', async ()=>{
                const checkParams = {
                    folderPath: 'documents'
                };
                mockDriver.checkFolderExists.mockResolvedValue(true);
                const result = await service.checkFolderExistsLegacy(checkParams);
                expect(fileStorageDriverFactory.getCurrentDriver).toHaveBeenCalled();
                expect(mockDriver.checkFolderExists).toHaveBeenCalledWith(checkParams);
                expect(result).toBe(true);
            });
            it('should delegate to the current driver and return false', async ()=>{
                const checkParams = {
                    folderPath: 'nonexistent'
                };
                mockDriver.checkFolderExists.mockResolvedValue(false);
                const result = await service.checkFolderExistsLegacy(checkParams);
                expect(fileStorageDriverFactory.getCurrentDriver).toHaveBeenCalled();
                expect(mockDriver.checkFolderExists).toHaveBeenCalledWith(checkParams);
                expect(result).toBe(false);
            });
        });
    });
});

//# sourceMappingURL=file-storage.service.spec.js.map