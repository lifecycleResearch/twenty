"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _generateMessageId = require("../../../../core-modules/i18n/utils/generateMessageId");
const _resolvepagelayouttabtitleutil = require("../resolve-page-layout-tab-title.util");
const _twentystandardapplications = require("../../../../workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
jest.mock('src/engine/core-modules/i18n/utils/generateMessageId');
const mockGenerateMessageId = _generateMessageId.generateMessageId;
describe('resolvePageLayoutTabTitle', ()=>{
    let mockI18n;
    beforeEach(()=>{
        jest.clearAllMocks();
        mockI18n = {
            _: jest.fn()
        };
    });
    it('should return translated title when catalog has a match', ()=>{
        mockGenerateMessageId.mockReturnValue('abc123');
        mockI18n._.mockReturnValue('Accueil');
        const result = (0, _resolvepagelayouttabtitleutil.resolvePageLayoutTabTitle)({
            title: 'Home',
            applicationId: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
            i18nInstance: mockI18n
        });
        expect(mockGenerateMessageId).toHaveBeenCalledWith('Home');
        expect(mockI18n._).toHaveBeenCalledWith('abc123');
        expect(result).toBe('Accueil');
    });
    it('should return original title when catalog returns the hash (no translation found)', ()=>{
        mockGenerateMessageId.mockReturnValue('xyz789');
        mockI18n._.mockReturnValue('xyz789');
        const result = (0, _resolvepagelayouttabtitleutil.resolvePageLayoutTabTitle)({
            title: 'My Custom Tab',
            applicationId: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
            i18nInstance: mockI18n
        });
        expect(mockGenerateMessageId).toHaveBeenCalledWith('My Custom Tab');
        expect(mockI18n._).toHaveBeenCalledWith('xyz789');
        expect(result).toBe('My Custom Tab');
    });
    it('should return original title for empty string', ()=>{
        mockGenerateMessageId.mockReturnValue('empty-hash');
        mockI18n._.mockReturnValue('empty-hash');
        const result = (0, _resolvepagelayouttabtitleutil.resolvePageLayoutTabTitle)({
            title: '',
            applicationId: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
            i18nInstance: mockI18n
        });
        expect(result).toBe('');
    });
    it('should translate standard tab titles', ()=>{
        const standardTabs = [
            {
                source: 'Home',
                translated: 'Accueil'
            },
            {
                source: 'Timeline',
                translated: 'Chronologie'
            },
            {
                source: 'Tasks',
                translated: 'Tâches'
            },
            {
                source: 'Notes',
                translated: 'Notes'
            },
            {
                source: 'Files',
                translated: 'Fichiers'
            },
            {
                source: 'Emails',
                translated: 'E-mails'
            },
            {
                source: 'Calendar',
                translated: 'Calendrier'
            },
            {
                source: 'Note',
                translated: 'Note'
            },
            {
                source: 'Flow',
                translated: 'Flux'
            }
        ];
        standardTabs.forEach(({ source, translated })=>{
            jest.clearAllMocks();
            mockGenerateMessageId.mockReturnValue(`hash-${source}`);
            mockI18n._.mockReturnValue(translated);
            const result = (0, _resolvepagelayouttabtitleutil.resolvePageLayoutTabTitle)({
                title: source,
                applicationId: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
                i18nInstance: mockI18n
            });
            expect(result).toBe(translated);
        });
    });
    it('should not translate title when applicationId is not from standard app', ()=>{
        mockGenerateMessageId.mockReturnValue('abc123');
        mockI18n._.mockReturnValue('Accueil');
        const customAppId = '11111111-1111-1111-1111-111111111111';
        const result = (0, _resolvepagelayouttabtitleutil.resolvePageLayoutTabTitle)({
            title: 'Home',
            applicationId: customAppId,
            i18nInstance: mockI18n
        });
        expect(mockGenerateMessageId).not.toHaveBeenCalled();
        expect(mockI18n._).not.toHaveBeenCalled();
        expect(result).toBe('Home');
    });
});

//# sourceMappingURL=resolve-page-layout-tab-title.util.spec.js.map