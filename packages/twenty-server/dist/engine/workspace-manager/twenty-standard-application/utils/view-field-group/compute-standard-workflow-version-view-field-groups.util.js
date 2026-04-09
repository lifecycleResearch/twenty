"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardWorkflowVersionViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardWorkflowVersionViewFieldGroups;
    }
});
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardWorkflowVersionViewFieldGroups = (args)=>{
    return {
        workflowVersionRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'workflowVersion',
            context: {
                viewName: 'workflowVersionRecordPageFields',
                viewFieldGroupName: 'general',
                name: 'General',
                position: 0,
                isVisible: true
            }
        }),
        workflowVersionRecordPageFieldsAdditional: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'workflowVersion',
            context: {
                viewName: 'workflowVersionRecordPageFields',
                viewFieldGroupName: 'additional',
                name: 'Additional',
                position: 1,
                isVisible: true
            }
        }),
        workflowVersionRecordPageFieldsOther: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'workflowVersion',
            context: {
                viewName: 'workflowVersionRecordPageFields',
                viewFieldGroupName: 'other',
                name: 'Other',
                position: 2,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-workflow-version-view-field-groups.util.js.map