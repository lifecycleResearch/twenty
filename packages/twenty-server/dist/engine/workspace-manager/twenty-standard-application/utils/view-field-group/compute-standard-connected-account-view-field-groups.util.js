"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardConnectedAccountViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardConnectedAccountViewFieldGroups;
    }
});
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardConnectedAccountViewFieldGroups = (args)=>{
    return {
        connectedAccountRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'connectedAccountRecordPageFields',
                viewFieldGroupName: 'general',
                name: 'General',
                position: 0,
                isVisible: true
            }
        }),
        connectedAccountRecordPageFieldsOther: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'connectedAccountRecordPageFields',
                viewFieldGroupName: 'other',
                name: 'Other',
                position: 1,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-connected-account-view-field-groups.util.js.map