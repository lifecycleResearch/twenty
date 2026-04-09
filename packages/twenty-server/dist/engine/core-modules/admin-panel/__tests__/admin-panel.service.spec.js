"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _adminpanelservice = require("../admin-panel.service");
const _auditservice = require("../../audit/services/audit.service");
const _logintokenservice = require("../../auth/token/services/login-token.service");
const _workspacedomainsservice = require("../../domain/workspace-domains/services/workspace-domains.service");
const _fileservice = require("../../file/services/file.service");
const _securehttpclientservice = require("../../secure-http-client/secure-http-client.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
const _userentity = require("../../user/user.entity");
const UserFindOneMock = jest.fn();
const LoginTokenServiceGenerateLoginTokenMock = jest.fn();
const TwentyConfigServiceGetAllMock = jest.fn();
const TwentyConfigServiceGetVariableWithMetadataMock = jest.fn();
const mockHttpClientGet = jest.fn();
const mockGetHttpClient = jest.fn().mockReturnValue({
    get: mockHttpClientGet
});
jest.mock('src/engine/core-modules/twenty-config/constants/config-variables-group-metadata', ()=>({
        CONFIG_VARIABLES_GROUP_METADATA: {
            SERVER_CONFIG: {
                position: 100,
                description: 'Server config description',
                isHiddenOnLoad: false
            },
            RATE_LIMITING: {
                position: 200,
                description: 'Rate limiting description',
                isHiddenOnLoad: false
            },
            OTHER: {
                position: 300,
                description: 'Other description',
                isHiddenOnLoad: true
            }
        }
    }));
describe('AdminPanelService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _adminpanelservice.AdminPanelService,
                {
                    provide: (0, _typeorm.getRepositoryToken)(_userentity.UserEntity),
                    useValue: {
                        findOne: UserFindOneMock
                    }
                },
                {
                    provide: _logintokenservice.LoginTokenService,
                    useValue: {
                        generateLoginToken: LoginTokenServiceGenerateLoginTokenMock
                    }
                },
                {
                    provide: _workspacedomainsservice.WorkspaceDomainsService,
                    useValue: {
                        getWorkspaceUrls: jest.fn().mockReturnValue({
                            customUrl: undefined,
                            subdomainUrl: 'https://twenty.twenty.com'
                        })
                    }
                },
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: {
                        getAll: TwentyConfigServiceGetAllMock,
                        getVariableWithMetadata: TwentyConfigServiceGetVariableWithMetadataMock
                    }
                },
                {
                    provide: _auditservice.AuditService,
                    useValue: {
                        createContext: jest.fn().mockReturnValue({
                            insertWorkspaceEvent: jest.fn()
                        })
                    }
                },
                {
                    provide: _fileservice.FileService,
                    useValue: {}
                },
                {
                    provide: _securehttpclientservice.SecureHttpClientService,
                    useValue: {
                        getHttpClient: mockGetHttpClient
                    }
                }
            ]
        }).compile();
        service = module.get(_adminpanelservice.AdminPanelService);
    });
    it('should be defined', async ()=>{
        expect(service).toBeDefined();
    });
    describe('getConfigVariablesGrouped', ()=>{
        it('should correctly group and sort config variables', ()=>{
            TwentyConfigServiceGetAllMock.mockReturnValue({
                SERVER_URL: {
                    value: 'http://localhost',
                    metadata: {
                        group: 'SERVER_CONFIG',
                        description: 'Server URL',
                        type: 'string',
                        options: undefined
                    },
                    source: 'env'
                },
                RATE_LIMIT_TTL: {
                    value: 60,
                    metadata: {
                        group: 'RATE_LIMITING',
                        description: 'Rate limit TTL',
                        type: 'number',
                        options: undefined
                    },
                    source: 'env'
                },
                API_KEY: {
                    value: 'secret-key',
                    metadata: {
                        group: 'SERVER_CONFIG',
                        description: 'API Key',
                        isSensitive: true,
                        type: 'string',
                        options: undefined
                    },
                    source: 'env'
                },
                OTHER_VAR: {
                    value: 'other',
                    metadata: {
                        group: 'OTHER',
                        description: 'Other var',
                        type: 'string',
                        options: undefined
                    },
                    source: 'env'
                }
            });
            const result = service.getConfigVariablesGrouped();
            expect(result).toEqual({
                groups: [
                    {
                        name: 'SERVER_CONFIG',
                        description: 'Server config description',
                        isHiddenOnLoad: false,
                        variables: [
                            {
                                name: 'API_KEY',
                                value: 'secret-key',
                                description: 'API Key',
                                isSensitive: true,
                                isEnvOnly: false,
                                type: 'string',
                                options: undefined,
                                source: 'env'
                            },
                            {
                                name: 'SERVER_URL',
                                value: 'http://localhost',
                                description: 'Server URL',
                                isSensitive: false,
                                isEnvOnly: false,
                                type: 'string',
                                options: undefined,
                                source: 'env'
                            }
                        ]
                    },
                    {
                        name: 'RATE_LIMITING',
                        description: 'Rate limiting description',
                        isHiddenOnLoad: false,
                        variables: [
                            {
                                name: 'RATE_LIMIT_TTL',
                                value: 60,
                                description: 'Rate limit TTL',
                                isSensitive: false,
                                isEnvOnly: false,
                                type: 'number',
                                options: undefined,
                                source: 'env'
                            }
                        ]
                    },
                    {
                        name: 'OTHER',
                        description: 'Other description',
                        isHiddenOnLoad: true,
                        variables: [
                            {
                                name: 'OTHER_VAR',
                                value: 'other',
                                description: 'Other var',
                                isSensitive: false,
                                isEnvOnly: false,
                                type: 'string',
                                options: undefined,
                                source: 'env'
                            }
                        ]
                    }
                ]
            });
            expect(result.groups[0].name).toBe('SERVER_CONFIG');
            expect(result.groups[1].name).toBe('RATE_LIMITING');
            expect(result.groups[2].name).toBe('OTHER');
        });
        it('should handle empty config variables', ()=>{
            TwentyConfigServiceGetAllMock.mockReturnValue({});
            const result = service.getConfigVariablesGrouped();
            expect(result).toEqual({
                groups: []
            });
        });
        it('should handle variables with undefined metadata fields', ()=>{
            TwentyConfigServiceGetAllMock.mockReturnValue({
                TEST_VAR: {
                    value: 'test',
                    metadata: {
                        group: 'SERVER_CONFIG',
                        type: 'string',
                        options: undefined
                    },
                    source: 'env'
                }
            });
            const result = service.getConfigVariablesGrouped();
            expect(result.groups[0].variables[0]).toEqual({
                name: 'TEST_VAR',
                value: 'test',
                description: undefined,
                isSensitive: false,
                isEnvOnly: false,
                options: undefined,
                source: 'env',
                type: 'string'
            });
        });
    });
    describe('getVersionInfo', ()=>{
        const mockEnvironmentGet = jest.fn();
        beforeEach(()=>{
            mockEnvironmentGet.mockReset();
            mockHttpClientGet.mockReset();
            service['twentyConfigService'].get = mockEnvironmentGet;
        });
        it('should return current and latest version when everything works', async ()=>{
            mockEnvironmentGet.mockReturnValue('1.0.0');
            mockHttpClientGet.mockResolvedValue({
                data: {
                    results: [
                        {
                            name: '2.0.0'
                        },
                        {
                            name: '1.5.0'
                        },
                        {
                            name: '1.0.0'
                        },
                        {
                            name: 'latest'
                        }
                    ]
                }
            });
            const result = await service.getVersionInfo();
            expect(result).toEqual({
                currentVersion: '1.0.0',
                latestVersion: '2.0.0'
            });
        });
        it('should handle undefined APP_VERSION', async ()=>{
            mockEnvironmentGet.mockReturnValue(undefined);
            mockHttpClientGet.mockResolvedValue({
                data: {
                    results: [
                        {
                            name: '2.0.0'
                        },
                        {
                            name: 'latest'
                        }
                    ]
                }
            });
            const result = await service.getVersionInfo();
            expect(result).toEqual({
                currentVersion: undefined,
                latestVersion: '2.0.0'
            });
        });
        it('should handle Docker Hub API error', async ()=>{
            mockEnvironmentGet.mockReturnValue('1.0.0');
            mockHttpClientGet.mockRejectedValue(new Error('API Error'));
            const result = await service.getVersionInfo();
            expect(result).toEqual({
                currentVersion: '1.0.0',
                latestVersion: 'latest'
            });
        });
        it('should handle empty Docker Hub tags', async ()=>{
            mockEnvironmentGet.mockReturnValue('1.0.0');
            mockHttpClientGet.mockResolvedValue({
                data: {
                    results: []
                }
            });
            const result = await service.getVersionInfo();
            expect(result).toEqual({
                currentVersion: '1.0.0',
                latestVersion: 'latest'
            });
        });
        it('should handle invalid semver tags', async ()=>{
            mockEnvironmentGet.mockReturnValue('1.0.0');
            mockHttpClientGet.mockResolvedValue({
                data: {
                    results: [
                        {
                            name: '2.0.0'
                        },
                        {
                            name: 'invalid-version'
                        },
                        {
                            name: 'latest'
                        },
                        {
                            name: '1.0.0'
                        }
                    ]
                }
            });
            const result = await service.getVersionInfo();
            expect(result).toEqual({
                currentVersion: '1.0.0',
                latestVersion: '2.0.0'
            });
        });
    });
    describe('getConfigVariable', ()=>{
        it('should return config variable with all fields', ()=>{
            TwentyConfigServiceGetVariableWithMetadataMock.mockReturnValue({
                value: 'test-value',
                metadata: {
                    group: 'SERVER_CONFIG',
                    description: 'Test description',
                    isSensitive: true,
                    isEnvOnly: true,
                    type: 'string',
                    options: [
                        'option1',
                        'option2'
                    ]
                },
                source: 'env'
            });
            const result = service.getConfigVariable('SERVER_URL');
            expect(result).toEqual({
                name: 'SERVER_URL',
                value: 'test-value',
                description: 'Test description',
                isSensitive: true,
                isEnvOnly: true,
                type: 'string',
                options: [
                    'option1',
                    'option2'
                ],
                source: 'env'
            });
        });
        it('should throw error when variable not found', ()=>{
            TwentyConfigServiceGetVariableWithMetadataMock.mockReturnValue(undefined);
            expect(()=>service.getConfigVariable('INVALID_VAR')).toThrow('Config variable INVALID_VAR not found');
        });
    });
});

//# sourceMappingURL=admin-panel.service.spec.js.map