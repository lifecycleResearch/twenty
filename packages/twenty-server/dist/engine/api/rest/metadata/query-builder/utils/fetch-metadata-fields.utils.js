"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchMetadataFields", {
    enumerable: true,
    get: function() {
        return fetchMetadataFields;
    }
});
const _hasselectallfieldsselectorutil = require("./has-select-all-fields-selector.util");
const fetchMetadataFields = (objectNamePlural, selector)=>{
    const defaultFields = `
    id
    type
    name
    label
    description
    icon
    isCustom
    isActive
    isSystem
    isNullable
    createdAt
    updatedAt
    defaultValue
    options
    relation {
      type
      targetObjectMetadata {
        id
        nameSingular
        namePlural
      }
      targetFieldMetadata {
        id
        name
      }
      sourceObjectMetadata {
        id
        nameSingular
        namePlural
      }
      sourceFieldMetadata {
        id
        name
      }
    }
  `;
    const fieldsSelection = (0, _hasselectallfieldsselectorutil.hasSelectAllFieldsSelector)(selector) ? defaultFields : selector?.fields?.join('\n') ?? defaultFields;
    switch(objectNamePlural){
        case 'objects':
            {
                const objectsSelection = selector?.objects?.join('\n') ?? `
        nameSingular
        namePlural
        labelSingular
        labelPlural
        description
        icon
        isCustom
        isActive
        isSystem
        createdAt
        updatedAt
        labelIdentifierFieldMetadataId
        imageIdentifierFieldMetadataId
      `;
                const fieldsPart = selector?.fields ? `
        fields(paging: { first: 1000 }) {
          edges {
            node {
              ${fieldsSelection}
            }
          }
        }
      ` : '';
                return `
        ${objectsSelection}
        ${fieldsPart}
      `;
            }
        case 'fields':
            return fieldsSelection;
    }
};

//# sourceMappingURL=fetch-metadata-fields.utils.js.map