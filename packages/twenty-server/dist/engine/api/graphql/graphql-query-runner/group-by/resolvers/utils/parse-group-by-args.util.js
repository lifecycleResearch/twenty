"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseGroupByArgs", {
    enumerable: true,
    get: function() {
        return parseGroupByArgs;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _isgroupbydatefielddefinitionutil = require("./is-group-by-date-field-definition.util");
const _parsegroupbyrelationfieldutil = require("./parse-group-by-relation-field.util");
const _validatesinglekeyforgroupbyorthrowutil = require("./validate-single-key-for-group-by-or-throw.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../../../../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const parseGroupByArgs = (args, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps)=>{
    const groupByFieldNames = args.groupBy;
    const groupByFields = [];
    const { fieldIdByName, fieldIdByJoinColumnName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, flatObjectMetadata);
    for (const fieldNames of groupByFieldNames){
        (0, _validatesinglekeyforgroupbyorthrowutil.validateSingleKeyForGroupByOrThrow)({
            groupByKeys: Object.keys(fieldNames),
            errorMessage: 'You cannot provide multiple fields in one GroupByInput, split them into multiple GroupByInput'
        });
        for (const fieldName of Object.keys(fieldNames)){
            const fieldMetadataId = fieldIdByName[fieldName] || fieldIdByJoinColumnName[fieldName];
            const fieldMetadata = fieldMetadataId ? (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: fieldMetadataId,
                flatEntityMaps: flatFieldMetadataMaps
            }) : undefined;
            if (!(0, _utils.isDefined)(fieldMetadata) || !(0, _utils.isDefined)(fieldMetadataId)) {
                throw new Error(`Unidentified field in groupBy: ${fieldName}`);
            }
            const isGroupByRelationField = (0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(fieldMetadata) && typeof fieldNames[fieldName] === 'object' && fieldNames[fieldName] !== null && !(0, _isgroupbydatefielddefinitionutil.isGroupByDateFieldDefinition)(fieldNames[fieldName]);
            // Handle relation fields
            if (isGroupByRelationField) {
                (0, _parsegroupbyrelationfieldutil.parseGroupByRelationField)({
                    fieldNames,
                    fieldName,
                    fieldMetadata,
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                    groupByFields
                });
                continue;
            }
            // Handle date fields
            if (fieldMetadata.type === _types.FieldMetadataType.DATE || fieldMetadata.type === _types.FieldMetadataType.DATE_TIME) {
                const fieldGroupByDefinition = fieldNames[fieldName];
                const shouldGroupByDateGranularity = (0, _isgroupbydatefielddefinitionutil.isGroupByDateFieldDefinition)(fieldGroupByDefinition);
                if (shouldGroupByDateGranularity) {
                    groupByFields.push({
                        fieldMetadata,
                        dateGranularity: fieldGroupByDefinition.granularity,
                        weekStartDay: fieldGroupByDefinition.weekStartDay,
                        timeZone: fieldGroupByDefinition.timeZone
                    });
                    continue;
                }
            }
            // Handle array unnest fields
            if (typeof fieldNames[fieldName] === 'object' && fieldNames[fieldName] !== null && 'unnest' in fieldNames[fieldName]) {
                groupByFields.push({
                    fieldMetadata,
                    subFieldName: undefined,
                    shouldUnnest: true
                });
                continue;
            }
            // Handle regular fields and composite fields
            if (fieldNames[fieldName] === true) {
                groupByFields.push({
                    fieldMetadata,
                    subFieldName: undefined
                });
                continue;
            } else if (typeof fieldNames[fieldName] === 'object') {
                (0, _validatesinglekeyforgroupbyorthrowutil.validateSingleKeyForGroupByOrThrow)({
                    groupByKeys: Object.keys(fieldNames[fieldName]),
                    errorMessage: 'You cannot provide multiple subfields in one GroupByInput, split them into multiple GroupByInput'
                });
                for (const subFieldName of Object.keys(fieldNames[fieldName])){
                    if (fieldNames[fieldName][subFieldName] === true) {
                        groupByFields.push({
                            fieldMetadata,
                            subFieldName
                        });
                        continue;
                    }
                }
            }
        }
    }
    return groupByFields;
};

//# sourceMappingURL=parse-group-by-args.util.js.map