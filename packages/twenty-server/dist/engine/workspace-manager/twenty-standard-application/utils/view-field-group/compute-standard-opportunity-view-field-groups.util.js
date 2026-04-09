"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardOpportunityViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardOpportunityViewFieldGroups;
    }
});
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardOpportunityViewFieldGroups = (args)=>{
    return {
        opportunityRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'opportunity',
            context: {
                viewName: 'opportunityRecordPageFields',
                viewFieldGroupName: 'general',
                name: 'General',
                position: 0,
                isVisible: true
            }
        }),
        opportunityRecordPageFieldsAdditional: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'opportunity',
            context: {
                viewName: 'opportunityRecordPageFields',
                viewFieldGroupName: 'additional',
                name: 'Additional',
                position: 1,
                isVisible: true
            }
        }),
        opportunityRecordPageFieldsOther: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'opportunity',
            context: {
                viewName: 'opportunityRecordPageFields',
                viewFieldGroupName: 'other',
                name: 'Other',
                position: 2,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-opportunity-view-field-groups.util.js.map