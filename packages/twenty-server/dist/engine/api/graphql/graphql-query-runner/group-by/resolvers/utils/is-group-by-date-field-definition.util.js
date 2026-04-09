"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isGroupByDateFieldDefinition", {
    enumerable: true,
    get: function() {
        return isGroupByDateFieldDefinition;
    }
});
const _classvalidator = require("class-validator");
const _types = require("twenty-shared/types");
const isGroupByDateFieldDefinition = (fieldGroupByDefinition)=>{
    if (typeof fieldGroupByDefinition !== 'object' || !(0, _classvalidator.isDefined)(fieldGroupByDefinition)) {
        return false;
    }
    if (!('granularity' in fieldGroupByDefinition)) {
        return false;
    }
    const granularity = fieldGroupByDefinition.granularity;
    return (0, _classvalidator.isDefined)(granularity) && typeof granularity === 'string' && Object.values(_types.ObjectRecordGroupByDateGranularity).includes(granularity);
};

//# sourceMappingURL=is-group-by-date-field-definition.util.js.map