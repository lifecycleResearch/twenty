"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUniversalFlatObjectFieldByNameAndJoinColumnMaps", {
    enumerable: true,
    get: function() {
        return buildUniversalFlatObjectFieldByNameAndJoinColumnMaps;
    }
});
const _utils = require("twenty-shared/utils");
const _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil = require("../../../../metadata-modules/flat-entity/utils/find-many-flat-entity-by-universal-identifier-in-universal-flat-entity-maps-or-throw.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const buildUniversalFlatObjectFieldByNameAndJoinColumnMaps = ({ flatFieldMetadataMaps, flatObjectMetadata })=>{
    const fieldUniversalIdentifierByName = {};
    const fieldUniversalIdentifierByJoinColumnName = {};
    const objectFields = (0, _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsorthrowutil.findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMapsOrThrow)({
        universalIdentifiers: flatObjectMetadata.fieldUniversalIdentifiers,
        flatEntityMaps: flatFieldMetadataMaps
    });
    for (const field of objectFields){
        fieldUniversalIdentifierByName[field.name] = field.universalIdentifier;
        if ((0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(field)) {
            if ((0, _utils.isDefined)(field.universalSettings.joinColumnName)) {
                fieldUniversalIdentifierByJoinColumnName[field.universalSettings.joinColumnName] = field.universalIdentifier;
            }
        }
    }
    return {
        fieldUniversalIdentifierByName,
        fieldUniversalIdentifierByJoinColumnName
    };
};

//# sourceMappingURL=build-universal-flat-object-field-by-name-and-join-column-maps.util.js.map