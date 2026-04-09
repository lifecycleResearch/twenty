"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _fromviewmanifesttouniversalflatviewutil = require("../from-view-manifest-to-universal-flat-view.util");
describe('fromViewManifestToUniversalFlatView', ()=>{
    const now = '2026-01-01T00:00:00.000Z';
    const applicationUniversalIdentifier = 'app-uuid-1';
    it('should convert a minimal view manifest to universal flat view', ()=>{
        const result = (0, _fromviewmanifesttouniversalflatviewutil.fromViewManifestToUniversalFlatView)({
            viewManifest: {
                universalIdentifier: 'view-uuid-1',
                name: 'All Records',
                objectUniversalIdentifier: 'object-uuid-1',
                key: _types.ViewKey.INDEX
            },
            applicationUniversalIdentifier,
            now
        });
        expect(result.universalIdentifier).toBe('view-uuid-1');
        expect(result.applicationUniversalIdentifier).toBe(applicationUniversalIdentifier);
        expect(result.name).toBe('All Records');
        expect(result.objectMetadataUniversalIdentifier).toBe('object-uuid-1');
        expect(result.type).toBe(_types.ViewType.TABLE);
        expect(result.icon).toBe('IconList');
        expect(result.position).toBe(0);
        expect(result.isCompact).toBe(false);
        expect(result.isCustom).toBe(true);
        expect(result.visibility).toBe(_types.ViewVisibility.WORKSPACE);
        expect(result.openRecordIn).toBe(_types.ViewOpenRecordIn.SIDE_PANEL);
        expect(result.key).toBe(_types.ViewKey.INDEX);
        expect(result.createdAt).toBe(now);
        expect(result.updatedAt).toBe(now);
    });
    it('should respect explicit values from the manifest', ()=>{
        const result = (0, _fromviewmanifesttouniversalflatviewutil.fromViewManifestToUniversalFlatView)({
            viewManifest: {
                universalIdentifier: 'view-uuid-2',
                name: 'Kanban Board',
                objectUniversalIdentifier: 'object-uuid-1',
                type: _types.ViewType.KANBAN,
                icon: 'IconLayoutKanban',
                position: 3,
                isCompact: true,
                visibility: _types.ViewVisibility.UNLISTED,
                openRecordIn: _types.ViewOpenRecordIn.RECORD_PAGE
            },
            applicationUniversalIdentifier,
            now
        });
        expect(result.type).toBe(_types.ViewType.KANBAN);
        expect(result.icon).toBe('IconLayoutKanban');
        expect(result.position).toBe(3);
        expect(result.isCompact).toBe(true);
        expect(result.visibility).toBe(_types.ViewVisibility.UNLISTED);
        expect(result.openRecordIn).toBe(_types.ViewOpenRecordIn.RECORD_PAGE);
    });
});

//# sourceMappingURL=from-view-manifest-to-universal-flat-view.util.spec.js.map