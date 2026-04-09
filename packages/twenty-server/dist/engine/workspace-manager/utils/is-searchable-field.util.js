"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isSearchableFieldType", {
    enumerable: true,
    get: function() {
        return isSearchableFieldType;
    }
});
const _types = require("twenty-shared/types");
const SEARCHABLE_FIELD_TYPES = [
    _types.FieldMetadataType.TEXT,
    _types.FieldMetadataType.FULL_NAME,
    _types.FieldMetadataType.EMAILS,
    _types.FieldMetadataType.ADDRESS,
    _types.FieldMetadataType.LINKS,
    _types.FieldMetadataType.PHONES,
    _types.FieldMetadataType.RICH_TEXT,
    _types.FieldMetadataType.UUID
];
const isSearchableFieldType = (type)=>{
    return SEARCHABLE_FIELD_TYPES.includes(type);
};

//# sourceMappingURL=is-searchable-field.util.js.map