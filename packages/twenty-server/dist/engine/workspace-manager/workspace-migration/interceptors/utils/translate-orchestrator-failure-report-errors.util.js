"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "translateOrchestratorFailureReportErrors", {
    enumerable: true,
    get: function() {
        return translateOrchestratorFailureReportErrors;
    }
});
const _utils = require("twenty-shared/utils");
const isMessageDescriptor = (obj)=>(0, _utils.isDefined)(obj) && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, 'id') && Object.prototype.hasOwnProperty.call(obj, 'message') && typeof obj.id === 'string';
const translateUserFriendlyMessageInFlatEntityValidationError = (obj, i18n, parentKey)=>{
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    if (isMessageDescriptor(obj) && (0, _utils.isDefined)(parentKey) && parentKey === 'userFriendlyMessage') {
        return i18n._(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map((item)=>translateUserFriendlyMessageInFlatEntityValidationError(item, i18n, parentKey));
    }
    const result = {};
    for (const [key, value] of Object.entries(obj)){
        result[key] = translateUserFriendlyMessageInFlatEntityValidationError(value, i18n, key);
    }
    return result;
};
const translateOrchestratorFailureReportErrors = (report, i18n)=>{
    return translateUserFriendlyMessageInFlatEntityValidationError(report, i18n);
};

//# sourceMappingURL=translate-orchestrator-failure-report-errors.util.js.map