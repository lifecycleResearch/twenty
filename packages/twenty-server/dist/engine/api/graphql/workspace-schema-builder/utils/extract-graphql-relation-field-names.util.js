"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractGraphQLRelationFieldNames", {
    enumerable: true,
    get: function() {
        return extractGraphQLRelationFieldNames;
    }
});
const extractGraphQLRelationFieldNames = (fieldMetadata)=>{
    const settings = fieldMetadata.settings;
    const joinColumnName = settings?.joinColumnName;
    if (!joinColumnName) {
        throw new Error('Join column name is not defined');
    }
    const fieldMetadataName = fieldMetadata.name;
    return {
        joinColumnName,
        fieldMetadataName
    };
};

//# sourceMappingURL=extract-graphql-relation-field-names.util.js.map