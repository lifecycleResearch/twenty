"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _typeorm = require("@nestjs/typeorm");
const _testing1 = require("twenty-shared/testing");
const _upgradecommandrunner = require("../upgrade.command-runner");
const _coremigrationrunnerservice = require("../../core-migration-runner/services/core-migration-runner.service");
const _upgradecommandsupportedversionsconstant = require("../../../../engine/constants/upgrade-command-supported-versions.constant");
const _coreengineversionservice = require("../../../../engine/core-engine-version/services/core-engine-version.service");
const _twentyconfigservice = require("../../../../engine/core-modules/twenty-config/twenty-config.service");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../../engine/metadata-modules/data-source/data-source.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _workspaceversionservice = require("../../../../engine/workspace-manager/workspace-version/services/workspace-version.service");
const CURRENT_VERSION = _upgradecommandsupportedversionsconstant.UPGRADE_COMMAND_SUPPORTED_VERSIONS[_upgradecommandsupportedversionsconstant.UPGRADE_COMMAND_SUPPORTED_VERSIONS.length - 1];
const PREVIOUS_VERSION = _upgradecommandsupportedversionsconstant.UPGRADE_COMMAND_SUPPORTED_VERSIONS[_upgradecommandsupportedversionsconstant.UPGRADE_COMMAND_SUPPORTED_VERSIONS.length - 2];
let BasicUpgradeCommandRunner = class BasicUpgradeCommandRunner extends _upgradecommandrunner.UpgradeCommandRunner {
    constructor(...args){
        super(...args), this.allCommands = Object.fromEntries(_upgradecommandsupportedversionsconstant.UPGRADE_COMMAND_SUPPORTED_VERSIONS.map((version)=>[
                version,
                []
            ]));
    }
};
const generateMockWorkspace = (overrides)=>({
        id: 'workspace-id',
        version: PREVIOUS_VERSION,
        createdAt: new Date(),
        updatedAt: new Date(),
        allowImpersonation: false,
        isPublicInviteLinkEnabled: false,
        displayName: 'Test Workspace',
        domainName: 'test',
        inviteHash: 'hash',
        logo: null,
        deletedAt: null,
        activationStatus: 'active',
        workspaceMembersCount: 1,
        ...overrides
    });
const buildUpgradeCommandModule = async ({ workspaces, appVersion, commandRunner })=>{
    const mockDataSourceService = {
        getLastDataSourceMetadataFromWorkspaceId: jest.fn()
    };
    const module = await _testing.Test.createTestingModule({
        providers: [
            {
                provide: commandRunner,
                useFactory: (workspaceRepository, twentyConfigService, globalWorkspaceOrmManager, dataSourceService, coreEngineVersionService, workspaceVersionService, coreMigrationRunnerService)=>{
                    return new commandRunner(workspaceRepository, twentyConfigService, globalWorkspaceOrmManager, dataSourceService, coreEngineVersionService, workspaceVersionService, coreMigrationRunnerService);
                },
                inject: [
                    (0, _typeorm.getRepositoryToken)(_workspaceentity.WorkspaceEntity),
                    _twentyconfigservice.TwentyConfigService,
                    _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
                    _datasourceservice.DataSourceService,
                    _coreengineversionservice.CoreEngineVersionService,
                    _workspaceversionservice.WorkspaceVersionService,
                    _coremigrationrunnerservice.CoreMigrationRunnerService
                ]
            },
            {
                provide: (0, _typeorm.getRepositoryToken)(_workspaceentity.WorkspaceEntity),
                useValue: {
                    findOneByOrFail: jest.fn().mockImplementation((args)=>workspaces.find((el)=>el.id === args.id)),
                    update: jest.fn(),
                    find: jest.fn().mockResolvedValue(workspaces),
                    exists: jest.fn().mockResolvedValue(workspaces.length > 0)
                }
            },
            {
                provide: _twentyconfigservice.TwentyConfigService,
                useValue: {
                    get: jest.fn().mockImplementation((key)=>{
                        switch(key){
                            case 'APP_VERSION':
                                {
                                    return appVersion;
                                }
                            default:
                                {
                                    return;
                                }
                        }
                    })
                }
            },
            {
                provide: _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
                useValue: {
                    connect: jest.fn(),
                    destroyDataSourceForWorkspace: jest.fn(),
                    getDataSourceForWorkspace: jest.fn(),
                    executeInWorkspaceContext: jest.fn().mockImplementation((fn, _authContext)=>fn())
                }
            },
            {
                provide: _datasourceservice.DataSourceService,
                useValue: mockDataSourceService
            },
            _coreengineversionservice.CoreEngineVersionService,
            _workspaceversionservice.WorkspaceVersionService,
            {
                provide: _coremigrationrunnerservice.CoreMigrationRunnerService,
                useValue: {
                    run: jest.fn().mockResolvedValue(undefined)
                }
            }
        ]
    }).compile();
    return module;
};
describe('UpgradeCommandRunner', ()=>{
    let upgradeCommandRunner;
    let workspaceRepository;
    let coreMigrationRunnerService;
    const buildModuleAndSetupSpies = async ({ numberOfWorkspace = 1, workspaceOverride, workspaces, commandRunner = BasicUpgradeCommandRunner, appVersion = CURRENT_VERSION })=>{
        const generatedWorkspaces = Array.from({
            length: numberOfWorkspace
        }, (_v, index)=>generateMockWorkspace({
                id: `workspace_${index}`,
                ...workspaceOverride
            }));
        const module = await buildUpgradeCommandModule({
            commandRunner,
            appVersion,
            workspaces: [
                ...generatedWorkspaces,
                ...workspaces ?? []
            ]
        });
        upgradeCommandRunner = module.get(commandRunner);
        jest.spyOn(upgradeCommandRunner['logger'], 'log').mockImplementation();
        jest.spyOn(upgradeCommandRunner['logger'], 'error').mockImplementation();
        jest.spyOn(upgradeCommandRunner['logger'], 'warn').mockImplementation();
        jest.spyOn(upgradeCommandRunner, 'runOnWorkspace');
        coreMigrationRunnerService = module.get(_coremigrationrunnerservice.CoreMigrationRunnerService);
        workspaceRepository = module.get((0, _typeorm.getRepositoryToken)(_workspaceentity.WorkspaceEntity));
    };
    it('should ignore and list as succesfull upgrade on workspace with higher version', async ()=>{
        const higherVersionWorkspace = generateMockWorkspace({
            id: 'higher_version_workspace',
            version: '42.42.42'
        });
        await buildModuleAndSetupSpies({
            numberOfWorkspace: 0,
            workspaces: [
                higherVersionWorkspace
            ]
        });
        // @ts-expect-error legacy noImplicitAny
        const passedParams = [];
        const options = {};
        // @ts-expect-error legacy noImplicitAny
        await upgradeCommandRunner.run(passedParams, options);
        const { fail: failReport, success: successReport } = upgradeCommandRunner.migrationReport;
        expect(successReport.length).toBe(1);
        expect(failReport.length).toBe(0);
        [
            upgradeCommandRunner.runOnWorkspace
        ].forEach((fn)=>expect(fn).toHaveBeenCalledTimes(1));
        [
            workspaceRepository.update
        ].forEach((fn)=>expect(fn).not.toHaveBeenCalled());
    });
    it('should run upgrade over several workspaces', async ()=>{
        const numberOfWorkspace = 42;
        await buildModuleAndSetupSpies({
            numberOfWorkspace
        });
        // @ts-expect-error legacy noImplicitAny
        const passedParams = [];
        const options = {};
        // @ts-expect-error legacy noImplicitAny
        await upgradeCommandRunner.run(passedParams, options);
        [
            upgradeCommandRunner.runOnWorkspace
        ].forEach((fn)=>expect(fn).toHaveBeenCalledTimes(numberOfWorkspace));
        expect(workspaceRepository.update).toHaveBeenNthCalledWith(numberOfWorkspace, {
            id: expect.any(String)
        }, {
            version: CURRENT_VERSION
        });
        expect(upgradeCommandRunner.migrationReport.success.length).toBe(42);
        expect(upgradeCommandRunner.migrationReport.fail.length).toBe(0);
    });
    describe('Workspace upgrade should succeed ', ()=>{
        const successfulTestUseCases = [
            {
                title: 'even if workspace version and app version differ in patch',
                context: {
                    input: {
                        appVersion: `v${CURRENT_VERSION}`,
                        workspaceOverride: {
                            version: `v${PREVIOUS_VERSION.replace('.0', '.12')}`
                        }
                    }
                }
            },
            {
                title: 'even if workspace version and app version differ in patch and semantic',
                context: {
                    input: {
                        appVersion: `v${CURRENT_VERSION}`,
                        workspaceOverride: {
                            version: PREVIOUS_VERSION.replace('.0', '.12')
                        }
                    }
                }
            },
            {
                title: 'even if app version contains a patch value',
                context: {
                    input: {
                        appVersion: CURRENT_VERSION.replace('.0', '.24'),
                        workspaceOverride: {
                            version: PREVIOUS_VERSION.replace('.0', '.12')
                        }
                    }
                }
            }
        ];
        it.each((0, _testing1.eachTestingContextFilter)(successfulTestUseCases))('$title', async ({ context: { input } })=>{
            await buildModuleAndSetupSpies(input);
            // @ts-expect-error legacy noImplicitAny
            const passedParams = [];
            const options = {};
            // @ts-expect-error legacy noImplicitAny
            await upgradeCommandRunner.run(passedParams, options);
            const { fail: failReport, success: successReport } = upgradeCommandRunner.migrationReport;
            expect(failReport.length).toBe(0);
            expect(successReport.length).toBe(1);
            expect(coreMigrationRunnerService.run).toHaveBeenCalledTimes(1);
            const { workspaceId } = successReport[0];
            expect(workspaceId).toBe('workspace_0');
        });
    });
    describe('Workspace upgrade should fail', ()=>{
        const failingTestUseCases = [
            {
                title: 'when workspace version is not equal to fromVersion',
                context: {
                    input: {
                        workspaceOverride: {
                            version: '0.1.0'
                        }
                    },
                    output: {
                        failReportWorkspaceId: 'workspace_0',
                        expectedErrorMessage: `Unable to run the upgrade command. Aborting the upgrade process.\nPlease ensure that all workspaces are on at least the previous minor version (${PREVIOUS_VERSION}).\nIf any workspaces are not on the previous minor version, roll back to that version and run the upgrade command again.`
                    }
                }
            },
            {
                title: 'when workspace version is not defined',
                context: {
                    input: {
                        workspaceOverride: {
                            version: null
                        }
                    },
                    output: {
                        failReportWorkspaceId: 'workspace_0',
                        expectedErrorMessage: `Unable to run the upgrade command. Aborting the upgrade process.\nPlease ensure that all workspaces are on at least the previous minor version (${PREVIOUS_VERSION}).\nIf any workspaces are not on the previous minor version, roll back to that version and run the upgrade command again.`
                    }
                }
            },
            {
                title: 'when APP_VERSION is not defined',
                context: {
                    input: {
                        appVersion: null
                    },
                    output: {
                        failReportWorkspaceId: 'global',
                        expectedErrorMessage: 'APP_VERSION is not defined, please double check your env variables'
                    }
                }
            },
            {
                title: 'when current version commands are not found',
                context: {
                    input: {
                        appVersion: '42.0.0'
                    },
                    output: {
                        failReportWorkspaceId: 'global',
                        expectedErrorMessage: 'No command found for version 42.0.0. Please check the commands record.'
                    }
                }
            },
            {
                title: 'when previous version is not found',
                context: {
                    input: {
                        appVersion: _upgradecommandsupportedversionsconstant.UPGRADE_COMMAND_SUPPORTED_VERSIONS[0]
                    },
                    output: {
                        failReportWorkspaceId: 'global',
                        expectedErrorMessage: `No previous version found for version ${_upgradecommandsupportedversionsconstant.UPGRADE_COMMAND_SUPPORTED_VERSIONS[0]}. Available versions: ${_upgradecommandsupportedversionsconstant.UPGRADE_COMMAND_SUPPORTED_VERSIONS.join(', ')}`
                    }
                }
            }
        ];
        it.each((0, _testing1.eachTestingContextFilter)(failingTestUseCases))('$title', async ({ context: { input, output } })=>{
            await buildModuleAndSetupSpies(input);
            const passedParams = [];
            const options = {};
            await upgradeCommandRunner.run(passedParams, options);
            const { fail: failReport, success: successReport } = upgradeCommandRunner.migrationReport;
            expect(successReport.length).toBe(0);
            expect(failReport.length).toBe(1);
            const { workspaceId, error } = failReport[0];
            expect(workspaceId).toBe(output?.failReportWorkspaceId ?? 'global');
            expect(error).toEqual(new Error(output?.expectedErrorMessage ?? ''));
        });
    });
});

//# sourceMappingURL=upgrade.command-runner.spec.js.map