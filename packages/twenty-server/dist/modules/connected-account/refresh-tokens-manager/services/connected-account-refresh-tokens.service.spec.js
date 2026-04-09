"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _types = require("twenty-shared/types");
const _connectedaccountdataaccessservice = require("../../../../engine/metadata-modules/connected-account/data-access/services/connected-account-data-access.service");
const _globalworkspaceormmanager = require("../../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _googleapirefreshtokensservice = require("../drivers/google/services/google-api-refresh-tokens.service");
const _microsoftapirefreshtokensservice = require("../drivers/microsoft/services/microsoft-api-refresh-tokens.service");
const _connectedaccountrefreshtokensexception = require("../exceptions/connected-account-refresh-tokens.exception");
const _connectedaccountrefreshtokensservice = require("./connected-account-refresh-tokens.service");
describe('ConnectedAccountRefreshTokensService', ()=>{
    let service;
    let googleAPIRefreshAccessTokenService;
    let microsoftAPIRefreshAccessTokenService;
    let connectedAccountDataAccessService;
    const mockWorkspaceId = 'workspace-123';
    const mockConnectedAccountId = 'account-456';
    const mockAccessToken = 'valid-access-token';
    const mockRefreshToken = 'valid-refresh-token';
    const mockNewAccessToken = 'new-access-token';
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _connectedaccountrefreshtokensservice.ConnectedAccountRefreshTokensService,
                {
                    provide: _googleapirefreshtokensservice.GoogleAPIRefreshAccessTokenService,
                    useValue: {
                        refreshTokens: jest.fn()
                    }
                },
                {
                    provide: _microsoftapirefreshtokensservice.MicrosoftAPIRefreshAccessTokenService,
                    useValue: {
                        refreshTokens: jest.fn()
                    }
                },
                {
                    provide: _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
                    useValue: {
                        executeInWorkspaceContext: jest.fn().mockImplementation((fn, _authContext)=>fn())
                    }
                },
                {
                    provide: _connectedaccountdataaccessservice.ConnectedAccountDataAccessService,
                    useValue: {
                        update: jest.fn()
                    }
                }
            ]
        }).compile();
        service = module.get(_connectedaccountrefreshtokensservice.ConnectedAccountRefreshTokensService);
        googleAPIRefreshAccessTokenService = module.get(_googleapirefreshtokensservice.GoogleAPIRefreshAccessTokenService);
        microsoftAPIRefreshAccessTokenService = module.get(_microsoftapirefreshtokensservice.MicrosoftAPIRefreshAccessTokenService);
        connectedAccountDataAccessService = module.get(_connectedaccountdataaccessservice.ConnectedAccountDataAccessService);
    });
    afterEach(()=>{
        jest.clearAllMocks();
    });
    describe('refreshAndSaveTokens', ()=>{
        it('should reuse valid access token without refreshing when lastCredentialsRefreshedAt is recent', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.MICROSOFT,
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken,
                lastCredentialsRefreshedAt: new Date(Date.now() - 30 * 60 * 1000)
            };
            const result = await service.refreshAndSaveTokens(connectedAccount, mockWorkspaceId);
            expect(result).toEqual({
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken
            });
            expect(microsoftAPIRefreshAccessTokenService.refreshTokens).not.toHaveBeenCalled();
            expect(connectedAccountDataAccessService.update).not.toHaveBeenCalled();
        });
        it('should refresh and save new Microsoft token when expired (lastCredentialsRefreshedAt is old)', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.MICROSOFT,
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken,
                lastCredentialsRefreshedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            };
            const newTokens = {
                accessToken: mockNewAccessToken,
                refreshToken: mockRefreshToken
            };
            jest.spyOn(microsoftAPIRefreshAccessTokenService, 'refreshTokens').mockResolvedValue(newTokens);
            const result = await service.refreshAndSaveTokens(connectedAccount, mockWorkspaceId);
            expect(result).toEqual(newTokens);
            expect(microsoftAPIRefreshAccessTokenService.refreshTokens).toHaveBeenCalledWith(mockRefreshToken);
            expect(connectedAccountDataAccessService.update).toHaveBeenCalledWith(mockWorkspaceId, {
                id: mockConnectedAccountId
            }, expect.objectContaining({
                ...newTokens,
                lastCredentialsRefreshedAt: expect.any(Date)
            }));
        });
        it('should refresh and save new Google token when expired (lastCredentialsRefreshedAt is old)', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.GOOGLE,
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken,
                lastCredentialsRefreshedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            };
            const newTokens = {
                accessToken: mockNewAccessToken,
                refreshToken: mockRefreshToken
            };
            jest.spyOn(googleAPIRefreshAccessTokenService, 'refreshTokens').mockResolvedValue(newTokens);
            const result = await service.refreshAndSaveTokens(connectedAccount, mockWorkspaceId);
            expect(result).toEqual(newTokens);
            expect(googleAPIRefreshAccessTokenService.refreshTokens).toHaveBeenCalledWith(mockRefreshToken);
            expect(connectedAccountDataAccessService.update).toHaveBeenCalledWith(mockWorkspaceId, {
                id: mockConnectedAccountId
            }, expect.objectContaining({
                ...newTokens,
                lastCredentialsRefreshedAt: expect.any(Date)
            }));
        });
        it('should refresh token when lastCredentialsRefreshedAt is null', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.MICROSOFT,
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken,
                lastCredentialsRefreshedAt: null
            };
            const newTokens = {
                accessToken: mockNewAccessToken,
                refreshToken: mockRefreshToken
            };
            jest.spyOn(microsoftAPIRefreshAccessTokenService, 'refreshTokens').mockResolvedValue(newTokens);
            const result = await service.refreshAndSaveTokens(connectedAccount, mockWorkspaceId);
            expect(result).toEqual(newTokens);
            expect(microsoftAPIRefreshAccessTokenService.refreshTokens).toHaveBeenCalledWith(mockRefreshToken);
            expect(connectedAccountDataAccessService.update).toHaveBeenCalledWith(mockWorkspaceId, {
                id: mockConnectedAccountId
            }, expect.objectContaining({
                ...newTokens,
                lastCredentialsRefreshedAt: expect.any(Date)
            }));
        });
        it('should throw when refresh token is missing', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.GOOGLE,
                accessToken: mockAccessToken,
                refreshToken: null,
                lastCredentialsRefreshedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            };
            await expect(service.refreshAndSaveTokens(connectedAccount, mockWorkspaceId)).rejects.toThrow(new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException(`No refresh token found for connected account ${mockConnectedAccountId} in workspace ${mockWorkspaceId}`, _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.REFRESH_TOKEN_NOT_FOUND));
        });
        it('should throw exception when Microsoft refresh fails with invalid_grant', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.MICROSOFT,
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken,
                lastCredentialsRefreshedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            };
            const invalidGrantError = new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException('Microsoft OAuth error: invalid_grant - Token has been revoked', _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.INVALID_REFRESH_TOKEN);
            jest.spyOn(microsoftAPIRefreshAccessTokenService, 'refreshTokens').mockRejectedValue(invalidGrantError);
            await expect(service.refreshAndSaveTokens(connectedAccount, mockWorkspaceId)).rejects.toMatchObject({
                message: expect.stringContaining('Microsoft OAuth error: invalid_grant - Token has been revoked'),
                code: _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.INVALID_REFRESH_TOKEN
            });
        });
        it('should throw TEMPORARY_NETWORK_ERROR when refresh fails with network error', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.GOOGLE,
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken,
                lastCredentialsRefreshedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            };
            const networkError = new _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenException('Google refresh token network error: ECONNRESET - Network error', _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.TEMPORARY_NETWORK_ERROR);
            jest.spyOn(googleAPIRefreshAccessTokenService, 'refreshTokens').mockRejectedValue(networkError);
            await expect(service.refreshAndSaveTokens(connectedAccount, mockWorkspaceId)).rejects.toMatchObject({
                code: _connectedaccountrefreshtokensexception.ConnectedAccountRefreshAccessTokenExceptionCode.TEMPORARY_NETWORK_ERROR
            });
        });
    });
    describe('isAccessTokenStillValid', ()=>{
        it('should return true when lastCredentialsRefreshedAt is within the valid window (30 minutes ago)', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.MICROSOFT,
                lastCredentialsRefreshedAt: new Date(Date.now() - 30 * 60 * 1000)
            };
            const result = await service.isAccessTokenStillValid(connectedAccount);
            expect(result).toBe(true);
        });
        it('should return false when lastCredentialsRefreshedAt is outside the valid window (2 hours ago)', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.GOOGLE,
                lastCredentialsRefreshedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            };
            const result = await service.isAccessTokenStillValid(connectedAccount);
            expect(result).toBe(false);
        });
        it('should return false when lastCredentialsRefreshedAt is null', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.MICROSOFT,
                lastCredentialsRefreshedAt: null
            };
            const result = await service.isAccessTokenStillValid(connectedAccount);
            expect(result).toBe(false);
        });
        it('should return true for IMAP_SMTP_CALDAV provider regardless of lastCredentialsRefreshedAt', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV,
                lastCredentialsRefreshedAt: null
            };
            const result = await service.isAccessTokenStillValid(connectedAccount);
            expect(result).toBe(true);
        });
        it('should return true for OIDC provider regardless of lastCredentialsRefreshedAt', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.OIDC,
                lastCredentialsRefreshedAt: null
            };
            const result = await service.isAccessTokenStillValid(connectedAccount);
            expect(result).toBe(true);
        });
        it('should return true for SAML provider regardless of lastCredentialsRefreshedAt', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.SAML,
                lastCredentialsRefreshedAt: null
            };
            const result = await service.isAccessTokenStillValid(connectedAccount);
            expect(result).toBe(true);
        });
    });
    describe('refreshAndSaveTokens - OIDC/SAML', ()=>{
        it('should reuse existing tokens for OIDC without attempting a refresh', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.OIDC,
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken,
                lastCredentialsRefreshedAt: null
            };
            const result = await service.refreshAndSaveTokens(connectedAccount, mockWorkspaceId);
            expect(result).toEqual({
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken
            });
            expect(googleAPIRefreshAccessTokenService.refreshTokens).not.toHaveBeenCalled();
            expect(microsoftAPIRefreshAccessTokenService.refreshTokens).not.toHaveBeenCalled();
            expect(connectedAccountDataAccessService.update).not.toHaveBeenCalled();
        });
        it('should reuse existing tokens for SAML without attempting a refresh', async ()=>{
            const connectedAccount = {
                id: mockConnectedAccountId,
                provider: _types.ConnectedAccountProvider.SAML,
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken,
                lastCredentialsRefreshedAt: null
            };
            const result = await service.refreshAndSaveTokens(connectedAccount, mockWorkspaceId);
            expect(result).toEqual({
                accessToken: mockAccessToken,
                refreshToken: mockRefreshToken
            });
            expect(googleAPIRefreshAccessTokenService.refreshTokens).not.toHaveBeenCalled();
            expect(microsoftAPIRefreshAccessTokenService.refreshTokens).not.toHaveBeenCalled();
            expect(connectedAccountDataAccessService.update).not.toHaveBeenCalled();
        });
    });
});

//# sourceMappingURL=connected-account-refresh-tokens.service.spec.js.map