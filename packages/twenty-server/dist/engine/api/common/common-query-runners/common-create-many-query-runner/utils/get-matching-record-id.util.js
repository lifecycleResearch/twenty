"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getMatchingRecordId", {
    enumerable: true,
    get: function() {
        return getMatchingRecordId;
    }
});
const _utils = require("twenty-shared/utils");
const _getvaluefrompathutil = require("./get-value-from-path.util");
const _commonqueryrunnerexception = require("../../errors/common-query-runner.exception");
const getMatchingRecordId = (record, conflictingFields, existingRecords)=>{
    const matchingRecordIds = conflictingFields.reduce((acc, field)=>{
        const requestFieldValue = (0, _getvaluefrompathutil.getValueFromPath)(record, field.fullPath);
        const matchingRecord = existingRecords.find((existingRecord)=>{
            const existingFieldValue = (0, _getvaluefrompathutil.getValueFromPath)(existingRecord, field.fullPath);
            return (0, _utils.isDefined)(existingFieldValue) && existingFieldValue === requestFieldValue;
        });
        if ((0, _utils.isDefined)(matchingRecord)) {
            acc.push(matchingRecord.id);
        }
        return acc;
    }, []);
    if ([
        ...new Set(matchingRecordIds)
    ].length > 1) {
        const conflictingFieldsValues = conflictingFields.map((field)=>{
            const value = (0, _getvaluefrompathutil.getValueFromPath)(record, field.fullPath);
            return (0, _utils.isDefined)(value) ? `${field.fullPath}: ${value}` : undefined;
        }).filter(_utils.isDefined).join(', ');
        throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Multiple records found with the same unique field values for ${conflictingFieldsValues}. Cannot determine which record to update.`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.UPSERT_MULTIPLE_MATCHING_RECORDS_CONFLICT, {
            userFriendlyMessage: /*i18n*/ {
                id: "6rLmLu",
                message: "Multiple records found with the same unique field values for {conflictingFieldsValues}. Cannot determine which record to update.",
                values: {
                    conflictingFieldsValues: conflictingFieldsValues
                }
            }
        });
    }
    return matchingRecordIds[0];
};

//# sourceMappingURL=get-matching-record-id.util.js.map