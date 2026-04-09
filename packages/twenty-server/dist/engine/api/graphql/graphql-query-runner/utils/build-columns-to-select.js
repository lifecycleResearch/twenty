"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildColumnsToSelect", {
    enumerable: true,
    get: function() {
        return buildColumnsToSelect;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _querytimingcontextstorage = require("../../../../core-modules/graphql/storage/query-timing-context.storage");
const _relationtypeinterface = require("../../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _findflatentitybyidinflatentitymapsutil = require("../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _isflatfieldmetadataoftypeutil = require("../../../../metadata-modules/flat-field-metadata/utils/is-flat-field-metadata-of-type.util");
const logger = new _common.Logger('buildColumnsToSelect');
const buildColumnsToSelect = ({ select, relations, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps })=>{
    const timingEnabled = (0, _querytimingcontextstorage.isQueryTimingEnabled)();
    const startTime = timingEnabled ? performance.now() : 0;
    const requiredRelationColumns = getRequiredRelationColumns(relations, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps);
    const fieldsToSelect = Object.entries(select).filter(([_columnName, value])=>value === true && typeof value !== 'object').reduce((acc, [columnName])=>({
            ...acc,
            [columnName]: true
        }), {});
    for (const columnName of requiredRelationColumns){
        fieldsToSelect[columnName] = true;
    }
    const result = {
        ...fieldsToSelect,
        id: true
    };
    if (timingEnabled) {
        const durationMs = (performance.now() - startTime).toFixed(2);
        logger.log(`${flatObjectMetadata.nameSingular} — ${durationMs}ms (${Object.keys(select).length} select, ${flatObjectMetadata.fieldIds.length} fields)`);
    }
    return result;
};
const getRequiredRelationColumns = (relations, flatObjectMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps)=>{
    const requiredColumns = [];
    for (const fieldId of flatObjectMetadata.fieldIds){
        const fieldMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: fieldId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if ((0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(fieldMetadata, _types.FieldMetadataType.RELATION)) {
            const relationValue = relations[fieldMetadata.name];
            if (!(0, _utils.isDefined)(relationValue) || !(0, _utils.isDefined)(fieldMetadata?.settings?.joinColumnName) || fieldMetadata.settings?.relationType !== _relationtypeinterface.RelationType.MANY_TO_ONE) {
                continue;
            }
            requiredColumns.push(fieldMetadata.settings.joinColumnName);
        }
        if ((0, _isflatfieldmetadataoftypeutil.isFlatFieldMetadataOfType)(fieldMetadata, _types.FieldMetadataType.MORPH_RELATION)) {
            const targetObjectMetadata = fieldMetadata.relationTargetObjectMetadataId ? (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: fieldMetadata.relationTargetObjectMetadataId,
                flatEntityMaps: flatObjectMetadataMaps
            }) : undefined;
            if (!fieldMetadata.settings?.relationType || !(0, _utils.isDefined)(targetObjectMetadata)) {
                continue;
            }
            const relationValue = relations[fieldMetadata.name];
            if (!(0, _utils.isDefined)(relationValue) || !(0, _utils.isDefined)(fieldMetadata?.settings?.joinColumnName)) {
                continue;
            }
            requiredColumns.push(fieldMetadata.settings.joinColumnName);
        }
    }
    return requiredColumns;
};

//# sourceMappingURL=build-columns-to-select.js.map