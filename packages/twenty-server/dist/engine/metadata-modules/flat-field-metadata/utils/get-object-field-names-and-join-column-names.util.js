"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getObjectFieldNamesAndJoinColumnNames", {
    enumerable: true,
    get: function() {
        return getObjectFieldNamesAndJoinColumnNames;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsutil = require("../../flat-entity/utils/find-many-flat-entity-by-universal-identifier-in-universal-flat-entity-maps.util");
const _ismorphorrelationflatfieldmetadatautil = require("./is-morph-or-relation-flat-field-metadata.util");
const getObjectFieldNamesAndJoinColumnNames = ({ universalFlatFieldMetadataMaps, universalFlatObjectMetadata })=>{
    const objectUniversalFlatFieldMetadatas = (0, _findmanyflatentitybyuniversalidentifierinuniversalflatentitymapsutil.findManyFlatEntityByUniversalIdentifierInUniversalFlatEntityMaps)({
        flatEntityMaps: universalFlatFieldMetadataMaps,
        universalIdentifiers: universalFlatObjectMetadata.fieldUniversalIdentifiers
    });
    const initialAccumulator = {
        joinColumnNames: [],
        fieldNames: []
    };
    const objectFieldNamesAndJoinColumnNames = objectUniversalFlatFieldMetadatas.reduce((acc, universalFlatFieldMetadata)=>{
        if ((0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(universalFlatFieldMetadata) && universalFlatFieldMetadata.universalSettings.relationType === _types.RelationType.MANY_TO_ONE && (0, _utils.isDefined)(universalFlatFieldMetadata.universalSettings.joinColumnName)) {
            return {
                ...acc,
                fieldNames: [
                    ...acc.fieldNames,
                    universalFlatFieldMetadata.name
                ],
                joinColumnNames: [
                    ...acc.joinColumnNames,
                    universalFlatFieldMetadata.universalSettings.joinColumnName
                ]
            };
        }
        return {
            ...acc,
            fieldNames: [
                ...acc.fieldNames,
                universalFlatFieldMetadata.name
            ]
        };
    }, initialAccumulator);
    return {
        objectFieldNamesAndJoinColumnNames
    };
};

//# sourceMappingURL=get-object-field-names-and-join-column-names.util.js.map