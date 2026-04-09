"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatColumnNameForRelationField", {
    enumerable: true,
    get: function() {
        return formatColumnNameForRelationField;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const formatColumnNameForRelationField = (fieldName, fieldMetadataSettings)=>{
    if (fieldMetadataSettings.relationType === _types.RelationType.ONE_TO_MANY) {
        throw new Error('No column exists for one to many relation fields');
    }
    if (fieldMetadataSettings.relationType === _types.RelationType.MANY_TO_ONE) {
        if (!(0, _utils.isDefined)(fieldMetadataSettings.joinColumnName)) {
            throw new Error(`Join column name is not defined for field ${fieldName}`);
        }
        return fieldMetadataSettings.joinColumnName;
    }
    return fieldName;
};

//# sourceMappingURL=format-column-name-for-relation-field.util.js.map