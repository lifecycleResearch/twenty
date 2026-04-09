"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageChannelViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardMessageChannelViewFieldGroups;
    }
});
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardMessageChannelViewFieldGroups = (args)=>{
    return {
        messageChannelRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'messageChannelRecordPageFields',
                viewFieldGroupName: 'general',
                name: 'General',
                position: 0,
                isVisible: true
            }
        }),
        messageChannelRecordPageFieldsOther: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'messageChannelRecordPageFields',
                viewFieldGroupName: 'other',
                name: 'Other',
                position: 1,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-message-channel-view-field-groups.util.js.map