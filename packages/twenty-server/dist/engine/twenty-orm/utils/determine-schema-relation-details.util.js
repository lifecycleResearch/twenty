"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "determineSchemaRelationDetails", {
    enumerable: true,
    get: function() {
        return determineSchemaRelationDetails;
    }
});
const _relationexception = require("../exceptions/relation.exception");
const _convertrelationtypetotypeormrelationtypeutil = require("./convert-relation-type-to-typeorm-relation-type.util");
function determineSchemaRelationDetails(fieldMetadata, objectMetadataMaps, fieldMetadataMaps) {
    if (!fieldMetadata.settings) {
        throw new Error('Field metadata settings are missing');
    }
    const relationType = (0, _convertrelationtypetotypeormrelationtypeutil.converRelationTypeToTypeORMRelationType)(fieldMetadata.settings.relationType);
    if (!fieldMetadata.relationTargetObjectMetadataId) {
        throw new _relationexception.RelationException('Relation target object metadata ID is missing', _relationexception.RelationExceptionCode.RELATION_OBJECT_METADATA_NOT_FOUND);
    }
    const targetObjectMetadata = objectMetadataMaps.byId[fieldMetadata.relationTargetObjectMetadataId];
    if (!targetObjectMetadata) {
        throw new _relationexception.RelationException(`Object metadata not found for field ${fieldMetadata.id}`, _relationexception.RelationExceptionCode.RELATION_OBJECT_METADATA_NOT_FOUND);
    }
    if (!fieldMetadata.relationTargetFieldMetadataId) {
        throw new _relationexception.RelationException('Relation target field metadata ID is missing', _relationexception.RelationExceptionCode.RELATION_TARGET_FIELD_METADATA_ID_NOT_FOUND);
    }
    const targetFieldMetadata = fieldMetadataMaps.byId[fieldMetadata.relationTargetFieldMetadataId];
    if (!targetFieldMetadata) {
        throw new Error('Target field metadata not found');
    }
    return {
        relationType,
        target: targetObjectMetadata.nameSingular,
        inverseSide: targetFieldMetadata.name,
        joinColumn: fieldMetadata.settings.joinColumnName ? {
            name: fieldMetadata.settings.joinColumnName
        } : undefined
    };
}

//# sourceMappingURL=determine-schema-relation-details.util.js.map