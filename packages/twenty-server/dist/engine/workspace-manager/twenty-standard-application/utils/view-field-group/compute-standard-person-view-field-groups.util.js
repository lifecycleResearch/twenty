"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardPersonViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardPersonViewFieldGroups;
    }
});
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardPersonViewFieldGroups = (args)=>{
    return {
        personRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'person',
            context: {
                viewName: 'personRecordPageFields',
                viewFieldGroupName: 'general',
                name: 'General',
                position: 0,
                isVisible: true
            }
        }),
        personRecordPageFieldsAdditional: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'person',
            context: {
                viewName: 'personRecordPageFields',
                viewFieldGroupName: 'additional',
                name: 'Additional',
                position: 1,
                isVisible: true
            }
        }),
        personRecordPageFieldsOther: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'person',
            context: {
                viewName: 'personRecordPageFields',
                viewFieldGroupName: 'other',
                name: 'Other',
                position: 2,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-person-view-field-groups.util.js.map