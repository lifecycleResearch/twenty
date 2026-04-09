"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateFlatIndexMetadataWithNameOrThrow", {
    enumerable: true,
    get: function() {
        return generateFlatIndexMetadataWithNameOrThrow;
    }
});
const _utils = require("twenty-shared/utils");
const _flatentitymapsexception = require("../../flat-entity/exceptions/flat-entity-maps.exception");
const _ismorphorrelationflatfieldmetadatautil = require("../../flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _generatedeterministicindexnamev2 = require("./generate-deterministic-index-name-v2");
const generateFlatIndexMetadataWithNameOrThrow = ({ flatObjectMetadata, objectFlatFieldMetadatas, flatIndex })=>{
    const orderedFlatFields = flatIndex.universalFlatIndexFieldMetadatas.sort((a, b)=>a.order - b.order).map((flatIndexField)=>{
        const relatedFlatFieldMetadata = objectFlatFieldMetadatas.find((flatFieldMetadata)=>flatFieldMetadata.universalIdentifier === flatIndexField.fieldMetadataUniversalIdentifier);
        if (!(0, _utils.isDefined)(relatedFlatFieldMetadata)) {
            throw new _flatentitymapsexception.FlatEntityMapsException('Could not find flat index field related field in cache', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
        }
        const name = (0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationUniversalFlatFieldMetadata)(relatedFlatFieldMetadata) ? relatedFlatFieldMetadata.universalSettings.joinColumnName ?? relatedFlatFieldMetadata.name : relatedFlatFieldMetadata.name;
        return {
            name,
            isUnique: relatedFlatFieldMetadata.isUnique
        };
    });
    const isUnique = orderedFlatFields.some((flatField)=>flatField.isUnique);
    const orderedIndexColumnNames = orderedFlatFields.map((flatField)=>flatField.name);
    const name = (0, _generatedeterministicindexnamev2.generateDeterministicIndexNameV2)({
        flatObjectMetadata,
        orderedIndexColumnNames,
        isUnique
    });
    return {
        ...flatIndex,
        name,
        isUnique
    };
};

//# sourceMappingURL=generate-flat-index.util.js.map