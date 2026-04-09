"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _types = require("twenty-shared/types");
const _connectedaccountdataaccessservice = require("../../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _googleemailaliasmanagerservice = require("../drivers/google/services/google-email-alias-manager.service");
const _microsoftapiexamples = require("../drivers/microsoft/mocks/microsoft-api-examples");
const _microsoftemailaliasmanagerservice = require("../drivers/microsoft/services/microsoft-email-alias-manager.service");
const _oauth2clientmanagerservice = require("../../oauth2-client-manager/services/oauth2-client-manager.service");
const _emailaliasmanagerservice = require("./email-alias-manager.service");
describe('Email Alias Manager Service', ()=>{
    let emailAliasManagerService;
    let microsoftEmailAliasManagerService;
    const mockConnectedAccountDataAccessService = {
        // @ts-expect-error legacy noImplicitAny
        update: jest.fn().mockResolvedValue((arg)=>arg)
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                {
                    provide: _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
                    useValue: {
                        executeInWorkspaceContext: jest.fn().mockImplementation((fn, _authContext)=>fn())
                    }
                },
                _emailaliasmanagerservice.EmailAliasManagerService,
                {
                    provide: _connectedaccountdataaccessservice.ConnectedAccountDataAccessService,
                    useValue: mockConnectedAccountDataAccessService
                },
                {
                    provide: _googleemailaliasmanagerservice.GoogleEmailAliasManagerService,
                    useValue: {}
                },
                _microsoftemailaliasmanagerservice.MicrosoftEmailAliasManagerService,
                {
                    provide: _oauth2clientmanagerservice.OAuth2ClientManagerService,
                    useValue: {
                        getMicrosoftOAuth2Client: jest.fn().mockResolvedValue({
                            api: jest.fn().mockReturnValue({
                                get: jest.fn().mockResolvedValue(_microsoftapiexamples.microsoftGraphMeResponseWithProxyAddresses)
                            })
                        })
                    }
                }
            ]
        }).compile();
        emailAliasManagerService = module.get(_emailaliasmanagerservice.EmailAliasManagerService);
        microsoftEmailAliasManagerService = module.get(_microsoftemailaliasmanagerservice.MicrosoftEmailAliasManagerService);
    });
    it('Service should be defined', ()=>{
        expect(emailAliasManagerService).toBeDefined();
    });
    describe('Refresh handle aliases for Microsoft', ()=>{
        it('Should refresh Microsoft handle aliases successfully', async ()=>{
            const mockConnectedAccount = {
                id: 'test-id',
                provider: _types.ConnectedAccountProvider.MICROSOFT,
                refreshToken: 'test-refresh-token'
            };
            const expectedAliases = 'bertrand2@domain.onmicrosoft.com,bertrand3@otherdomain.com';
            jest.spyOn(microsoftEmailAliasManagerService, 'getHandleAliases');
            await emailAliasManagerService.refreshHandleAliases(mockConnectedAccount, 'test-workspace-id');
            expect(microsoftEmailAliasManagerService.getHandleAliases).toHaveBeenCalledWith(mockConnectedAccount);
            expect(mockConnectedAccountDataAccessService.update).toHaveBeenCalledWith('test-workspace-id', {
                id: mockConnectedAccount.id
            }, {
                handleAliases: expectedAliases
            });
        });
    });
});

//# sourceMappingURL=email-alias-manager.service.spec.js.map