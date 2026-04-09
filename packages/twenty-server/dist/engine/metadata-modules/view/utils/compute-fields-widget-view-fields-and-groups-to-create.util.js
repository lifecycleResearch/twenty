"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeFieldsWidgetViewFieldsAndGroupsToCreate", {
    enumerable: true,
    get: function() {
        return computeFieldsWidgetViewFieldsAndGroupsToCreate;
    }
});
const _types = require("twenty-shared/types");
const _uuid = require("uuid");
const _defaultviewfieldsizeconstant = require("../../flat-view-field/constants/default-view-field-size.constant");
const computeFieldsWidgetViewFieldsAndGroupsToCreate = ({ objectFlatFieldMetadatas, viewUniversalIdentifier, flatApplication, labelIdentifierFieldMetadataUniversalIdentifier })=>{
    const createdAt = new Date().toISOString();
    const applicationUniversalIdentifier = flatApplication.universalIdentifier;
    const eligibleFields = objectFlatFieldMetadatas.filter((field)=>field.name !== 'deletedAt' && field.type !== _types.FieldMetadataType.TS_VECTOR && field.type !== _types.FieldMetadataType.POSITION && (field.name !== 'id' || field.universalIdentifier === labelIdentifierFieldMetadataUniversalIdentifier));
    const standardFields = eligibleFields.filter((field)=>!field.isCustom);
    const customFields = eligibleFields.filter((field)=>field.isCustom);
    const sortedStandardFields = [
        ...standardFields
    ].sort((a, b)=>{
        const aIsLabel = a.universalIdentifier === labelIdentifierFieldMetadataUniversalIdentifier;
        const bIsLabel = b.universalIdentifier === labelIdentifierFieldMetadataUniversalIdentifier;
        if (aIsLabel && !bIsLabel) return -1;
        if (!aIsLabel && bIsLabel) return 1;
        return 0;
    });
    const flatViewFieldGroupsToCreate = [];
    const flatViewFieldsToCreate = [];
    const generalGroupUniversalIdentifier = (0, _uuid.v4)();
    flatViewFieldGroupsToCreate.push({
        universalIdentifier: generalGroupUniversalIdentifier,
        applicationUniversalIdentifier,
        viewUniversalIdentifier,
        name: 'General',
        position: 0,
        isVisible: true,
        overrides: null,
        viewFieldUniversalIdentifiers: [],
        createdAt,
        updatedAt: createdAt,
        deletedAt: null
    });
    sortedStandardFields.forEach((field, index)=>{
        const isVisible = field.type !== _types.FieldMetadataType.RELATION && field.type !== _types.FieldMetadataType.MORPH_RELATION;
        flatViewFieldsToCreate.push({
            fieldMetadataUniversalIdentifier: field.universalIdentifier,
            viewUniversalIdentifier,
            viewFieldGroupUniversalIdentifier: generalGroupUniversalIdentifier,
            createdAt,
            updatedAt: createdAt,
            deletedAt: null,
            universalIdentifier: (0, _uuid.v4)(),
            isVisible,
            size: _defaultviewfieldsizeconstant.DEFAULT_VIEW_FIELD_SIZE,
            position: index,
            aggregateOperation: null,
            universalOverrides: null,
            applicationUniversalIdentifier
        });
    });
    if (customFields.length > 0) {
        const otherGroupUniversalIdentifier = (0, _uuid.v4)();
        flatViewFieldGroupsToCreate.push({
            universalIdentifier: otherGroupUniversalIdentifier,
            applicationUniversalIdentifier,
            viewUniversalIdentifier,
            name: 'Other',
            position: 1,
            isVisible: true,
            overrides: null,
            viewFieldUniversalIdentifiers: [],
            createdAt,
            updatedAt: createdAt,
            deletedAt: null
        });
        customFields.forEach((field, index)=>{
            const isVisible = field.type !== _types.FieldMetadataType.RELATION && field.type !== _types.FieldMetadataType.MORPH_RELATION;
            flatViewFieldsToCreate.push({
                fieldMetadataUniversalIdentifier: field.universalIdentifier,
                viewUniversalIdentifier,
                viewFieldGroupUniversalIdentifier: otherGroupUniversalIdentifier,
                createdAt,
                updatedAt: createdAt,
                deletedAt: null,
                universalIdentifier: (0, _uuid.v4)(),
                isVisible,
                size: _defaultviewfieldsizeconstant.DEFAULT_VIEW_FIELD_SIZE,
                position: index,
                aggregateOperation: null,
                universalOverrides: null,
                applicationUniversalIdentifier
            });
        });
    }
    return {
        flatViewFieldGroupsToCreate,
        flatViewFieldsToCreate
    };
};

//# sourceMappingURL=compute-fields-widget-view-fields-and-groups-to-create.util.js.map