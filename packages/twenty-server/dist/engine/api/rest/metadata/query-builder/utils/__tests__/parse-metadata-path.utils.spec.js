"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _parsemetadatapathutils = require("../parse-metadata-path.utils");
describe('parseMetadataPath', ()=>{
    it('should parse object from request path with uuid', ()=>{
        const request = {
            path: '/rest/metadata/fields/uuid'
        };
        expect((0, _parsemetadatapathutils.parseMetadataPath)(request.path)).toEqual({
            objectNameSingular: 'field',
            objectNamePlural: 'fields',
            id: 'uuid'
        });
    });
    it('should parse object from request path', ()=>{
        const request = {
            path: '/rest/metadata/fields'
        };
        expect((0, _parsemetadatapathutils.parseMetadataPath)(request.path)).toEqual({
            objectNameSingular: 'field',
            objectNamePlural: 'fields',
            id: undefined
        });
    });
    it('should throw for wrong request path', ()=>{
        const request = {
            path: '/rest/metadata/INVALID'
        };
        expect(()=>(0, _parsemetadatapathutils.parseMetadataPath)(request.path)).toThrow('Query path \'/rest/metadata/INVALID\' invalid. Metadata path "INVALID" does not exist. Valid examples: /rest/metadata/fields or /rest/metadata/objects');
    });
    it('should throw for wrong request path', ()=>{
        const request = {
            path: '/rest/metadata/fields/uuid/toto'
        };
        expect(()=>(0, _parsemetadatapathutils.parseMetadataPath)(request.path)).toThrow("Query path '/rest/metadata/fields/uuid/toto' invalid. Valid examples: /rest/metadata/fields or /rest/metadata/objects/id");
    });
});

//# sourceMappingURL=parse-metadata-path.utils.spec.js.map