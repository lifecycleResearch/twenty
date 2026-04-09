"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getConflictingFields", {
    enumerable: true,
    get: function() {
        return getConflictingFields;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _getflatfieldsforflatobjectmetadatautil = require("../../../../graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const getConflictingFields = (flatObjectMetadata, flatFieldMetadataMaps)=>{
    return (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(flatObjectMetadata, flatFieldMetadataMaps).filter((field)=>field.isUnique || field.name === 'id').flatMap((field)=>{
        const compositeType = _types.compositeTypeDefinitions.get(field.type);
        if (!compositeType) {
            return [
                {
                    baseField: field.name,
                    fullPath: field.name,
                    column: field.name
                }
            ];
        }
        const property = compositeType.properties.find((prop)=>prop.isIncludedInUniqueConstraint);
        return property ? [
            {
                baseField: field.name,
                fullPath: `${field.name}.${property.name}`,
                column: `${field.name}${(0, _utils.capitalize)(property.name)}`
            }
        ] : [];
    });
};

//# sourceMappingURL=get-conflicting-fields.util.js.map