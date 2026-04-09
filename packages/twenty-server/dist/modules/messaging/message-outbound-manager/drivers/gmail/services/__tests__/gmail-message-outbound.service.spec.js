"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _googleapis = require("googleapis");
const _types = require("twenty-shared/types");
const _oauth2clientmanagerservice = require("../../../../../../connected-account/oauth2-client-manager/services/oauth2-client-manager.service");
const _gmailmessageoutboundservice = require("../gmail-message-outbound.service");
jest.mock('nodemailer/lib/mail-composer', ()=>{
    return jest.fn().mockImplementation(()=>({
            compile: jest.fn().mockReturnValue({
                build: jest.fn().mockResolvedValue(Buffer.from('mocked-email-content'))
            })
        }));
});
describe('GmailMessageOutboundService', ()=>{
    let service;
    const mockSend = jest.fn().mockResolvedValue({
        data: {
            id: 'message-id'
        }
    });
    const mockGmailClient = {
        users: {
            messages: {
                send: mockSend
            },
            getProfile: jest.fn().mockResolvedValue({
                data: {
                    emailAddress: 'test@example.com'
                }
            })
        }
    };
    const mockPeopleClient = {
        people: {
            get: jest.fn().mockResolvedValue({
                data: {
                    names: [
                        {
                            displayName: 'Test User'
                        }
                    ]
                }
            })
        }
    };
    const mockOAuth2Client = {};
    beforeEach(async ()=>{
        jest.spyOn(_googleapis.google, 'gmail').mockReturnValue(mockGmailClient);
        jest.spyOn(_googleapis.google, 'people').mockReturnValue(mockPeopleClient);
        const module = await _testing.Test.createTestingModule({
            providers: [
                _gmailmessageoutboundservice.GmailMessageOutboundService,
                {
                    provide: _oauth2clientmanagerservice.OAuth2ClientManagerService,
                    useValue: {
                        getGoogleOAuth2Client: jest.fn().mockResolvedValue(mockOAuth2Client)
                    }
                }
            ]
        }).compile();
        service = module.get(_gmailmessageoutboundservice.GmailMessageOutboundService);
    });
    afterEach(()=>{
        mockSend.mockClear();
        jest.restoreAllMocks();
    });
    it('should send multipart/alternative email with both text and HTML parts via Gmail', async ()=>{
        const sendMessageInput = {
            to: 'recipient@example.com',
            subject: 'Test HTML Email',
            body: 'This is plain text content',
            html: '<p>This is <strong>HTML</strong> content</p>',
            attachments: []
        };
        const connectedAccount = {
            provider: _types.ConnectedAccountProvider.GOOGLE,
            accessToken: 'access-token',
            refreshToken: 'refresh-token'
        };
        await service.sendMessage(sendMessageInput, connectedAccount);
        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith({
            userId: 'me',
            requestBody: {
                raw: Buffer.from('mocked-email-content').toString('base64url')
            }
        });
    });
    it('should send email with attachments via Gmail', async ()=>{
        const sendMessageInput = {
            to: 'recipient@example.com',
            subject: 'Test Email with Attachments',
            body: 'Plain text',
            html: '<p>HTML content</p>',
            attachments: [
                {
                    filename: 'test.pdf',
                    content: Buffer.from('test-pdf-content'),
                    contentType: 'application/pdf'
                }
            ]
        };
        const connectedAccount = {
            provider: _types.ConnectedAccountProvider.GOOGLE,
            accessToken: 'access-token',
            refreshToken: 'refresh-token'
        };
        await service.sendMessage(sendMessageInput, connectedAccount);
        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockSend).toHaveBeenCalledWith({
            userId: 'me',
            requestBody: {
                raw: Buffer.from('mocked-email-content').toString('base64url')
            }
        });
    });
});

//# sourceMappingURL=gmail-message-outbound.service.spec.js.map