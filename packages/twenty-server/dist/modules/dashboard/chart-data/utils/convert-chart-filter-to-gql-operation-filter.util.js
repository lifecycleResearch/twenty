"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "convertChartFilterToGqlOperationFilter", {
    enumerable: true,
    get: function() {
        return convertChartFilterToGqlOperationFilter;
    }
});
const _utils = require("twenty-shared/utils");
const _findflatentitybyidinflatentitymapsutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const convertChartFilterToGqlOperationFilter = ({ filter, flatObjectMetadata, flatFieldMetadataMaps, userTimezone })=>{
    if (!(0, _utils.isDefined)(filter)) {
        return {};
    }
    const recordFilters = filter.recordFilters ?? [];
    const recordFilterGroups = filter.recordFilterGroups ?? [];
    if (recordFilters.length === 0 && recordFilterGroups.length === 0) {
        return {};
    }
    const fieldIds = flatObjectMetadata.fieldIds ?? [];
    const fields = fieldIds.map((fieldId)=>{
        const field = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: fieldId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(field)) {
            return null;
        }
        return {
            id: field.id,
            name: field.name,
            type: field.type,
            label: field.label,
            options: field.options?.map((opt)=>({
                    id: opt.id ?? '',
                    label: opt.label,
                    value: opt.value,
                    color: 'color' in opt ? opt.color : undefined,
                    position: opt.position
                }))
        };
    }).filter(_utils.isDefined);
    const convertedRecordFilters = recordFilters.map((recordFilter)=>{
        const field = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: recordFilter.fieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        return {
            fieldMetadataId: recordFilter.fieldMetadataId,
            value: recordFilter.value ?? '',
            type: field?.type ?? recordFilter.type ?? '',
            recordFilterGroupId: recordFilter.recordFilterGroupId ?? undefined,
            operand: recordFilter.operand,
            subFieldName: recordFilter.subFieldName ?? undefined
        };
    });
    const convertedRecordFilterGroups = recordFilterGroups.map((recordFilterGroup)=>({
            id: recordFilterGroup.id,
            parentRecordFilterGroupId: recordFilterGroup.parentRecordFilterGroupId ?? undefined,
            logicalOperator: recordFilterGroup.logicalOperator
        }));
    return (0, _utils.computeRecordGqlOperationFilter)({
        fields,
        recordFilters: convertedRecordFilters,
        recordFilterGroups: convertedRecordFilterGroups,
        filterValueDependencies: {
            timeZone: userTimezone
        }
    });
};

//# sourceMappingURL=convert-chart-filter-to-gql-operation-filter.util.js.map