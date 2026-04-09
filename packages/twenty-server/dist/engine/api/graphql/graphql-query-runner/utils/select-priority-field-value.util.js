"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "selectPriorityFieldValue", {
    enumerable: true,
    get: function() {
        return selectPriorityFieldValue;
    }
});
const _utils = require("twenty-shared/utils");
const _hasrecordfieldvalueutil = require("./has-record-field-value.util");
const selectPriorityFieldValue = (recordsWithValues, priorityRecordId)=>{
    const priorityRecord = recordsWithValues.find((record)=>record.recordId === priorityRecordId);
    if (!(0, _utils.isDefined)(priorityRecord)) {
        throw new Error(`Priority record with ID ${priorityRecordId} not found in merge candidates`);
    }
    if ((0, _hasrecordfieldvalueutil.hasRecordFieldValue)(priorityRecord.value)) {
        return priorityRecord.value;
    }
    return null;
};

//# sourceMappingURL=select-priority-field-value.util.js.map