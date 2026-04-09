"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseGroupByRelationField", {
    enumerable: true,
    get: function() {
        return parseGroupByRelationField;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _standarderrormessageconstant = require("../../../../../common/common-query-runners/errors/standard-error-message.constant");
const _graphqlqueryrunnerexception = require("../../../errors/graphql-query-runner.exception");
const _isgroupbydatefielddefinitionutil = require("./is-group-by-date-field-definition.util");
const _validatesinglekeyforgroupbyorthrowutil = require("./validate-single-key-for-group-by-or-throw.util");
const _graphqlerrorsutil = require("../../../../../../core-modules/graphql/utils/graphql-errors.util");
const _iscompositefieldmetadatatypeutil = require("../../../../../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../../../../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const getNestedFieldMetadataDetails = ({ fieldNames, fieldName, fieldMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps })=>{
    const nestedFieldGroupByDefinitions = fieldNames[fieldName];
    if (!(0, _utils.isDefined)(fieldMetadata.relationTargetObjectMetadataId)) {
        throw new _graphqlerrorsutil.UserInputError(`Relation target object metadata id not found for field ${fieldMetadata.name}`);
    }
    const targetObjectMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
        flatEntityId: fieldMetadata.relationTargetObjectMetadataId,
        flatEntityMaps: flatObjectMetadataMaps
    });
    const nestedFieldNames = Object.keys(nestedFieldGroupByDefinitions);
    (0, _validatesinglekeyforgroupbyorthrowutil.validateSingleKeyForGroupByOrThrow)({
        groupByKeys: nestedFieldNames,
        errorMessage: 'You cannot provide multiple nested fields in one relation GroupByInput, split them into multiple GroupByInput'
    });
    const nestedFieldName = nestedFieldNames[0];
    const { fieldIdByName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, targetObjectMetadata);
    const nestedFieldMetadataId = fieldIdByName[nestedFieldName];
    const nestedFieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
        flatEntityId: nestedFieldMetadataId,
        flatEntityMaps: flatFieldMetadataMaps
    });
    if (!(0, _utils.isDefined)(nestedFieldMetadata) || !(0, _utils.isDefined)(nestedFieldMetadataId)) {
        throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Nested field "${nestedFieldName}" not found in target object "${targetObjectMetadata.nameSingular}"`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.FIELD_NOT_FOUND, {
            userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
        });
    }
    if (nestedFieldMetadata.type === _types.FieldMetadataType.RELATION) {
        throw new _graphqlerrorsutil.UserInputError(`Cannot group by a relation field of the relation field: "${nestedFieldName}" is a relation field of "${targetObjectMetadata.nameSingular}"`);
    }
    const nestedFieldGroupByDefinition = nestedFieldGroupByDefinitions[nestedFieldName];
    return {
        nestedFieldGroupByDefinition,
        nestedFieldMetadata,
        nestedFieldName
    };
};
const handleNestedCompositeField = ({ nestedFieldGroupByDefinition, nestedFieldName, fieldMetadata, nestedFieldMetadata, groupByFields })=>{
    if (typeof nestedFieldGroupByDefinition === 'object' && nestedFieldGroupByDefinition !== null) {
        const compositeSubFields = Object.keys(nestedFieldGroupByDefinition);
        (0, _validatesinglekeyforgroupbyorthrowutil.validateSingleKeyForGroupByOrThrow)({
            groupByKeys: compositeSubFields,
            errorMessage: 'You cannot provide multiple composite subfields in one GroupByInput, split them into multiple GroupByInput'
        });
        const nestedSubFieldName = compositeSubFields[0];
        if (nestedFieldGroupByDefinition[nestedSubFieldName] === true) {
            groupByFields.push({
                fieldMetadata,
                nestedFieldMetadata,
                nestedSubFieldName
            });
            return;
        }
    }
    throw new _graphqlqueryrunnerexception.GraphqlQueryRunnerException(`Composite field "${nestedFieldName}" requires a subfield to be specified`, _graphqlqueryrunnerexception.GraphqlQueryRunnerExceptionCode.INVALID_QUERY_INPUT, {
        userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
    });
};
const parseGroupByRelationField = ({ fieldNames, fieldName, fieldMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps, groupByFields })=>{
    const { nestedFieldGroupByDefinition, nestedFieldMetadata, nestedFieldName } = getNestedFieldMetadataDetails({
        fieldNames,
        fieldName,
        fieldMetadata,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps
    });
    // Handle date fields in nested relations
    if ((nestedFieldMetadata.type === _types.FieldMetadataType.DATE || nestedFieldMetadata.type === _types.FieldMetadataType.DATE_TIME) && (0, _isgroupbydatefielddefinitionutil.isGroupByDateFieldDefinition)(nestedFieldGroupByDefinition)) {
        const dateFieldDefinition = nestedFieldGroupByDefinition;
        groupByFields.push({
            fieldMetadata,
            nestedFieldMetadata,
            dateGranularity: dateFieldDefinition.granularity,
            weekStartDay: dateFieldDefinition.weekStartDay,
            timeZone: dateFieldDefinition.timeZone
        });
        return;
    }
    // Handle composite fields in nested relations
    if ((0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(nestedFieldMetadata.type)) {
        handleNestedCompositeField({
            nestedFieldGroupByDefinition: nestedFieldGroupByDefinition,
            nestedFieldName,
            fieldMetadata,
            nestedFieldMetadata,
            groupByFields
        });
    }
    // Handle regular nested fields
    if (nestedFieldGroupByDefinition === true) {
        groupByFields.push({
            fieldMetadata,
            nestedFieldMetadata
        });
        return;
    }
};

//# sourceMappingURL=parse-group-by-relation-field.util.js.map