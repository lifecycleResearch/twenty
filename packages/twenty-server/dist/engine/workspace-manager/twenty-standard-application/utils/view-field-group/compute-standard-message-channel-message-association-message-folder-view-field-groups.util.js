"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageChannelMessageAssociationMessageFolderViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardMessageChannelMessageAssociationMessageFolderViewFieldGroups;
    }
});
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardMessageChannelMessageAssociationMessageFolderViewFieldGroups = (args)=>{
    return {
        messageChannelMessageAssociationMessageFolderRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociationMessageFolder',
            context: {
                viewName: 'messageChannelMessageAssociationMessageFolderRecordPageFields',
                viewFieldGroupName: 'general',
                name: 'General',
                position: 0,
                isVisible: true
            }
        }),
        messageChannelMessageAssociationMessageFolderRecordPageFieldsOther: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociationMessageFolder',
            context: {
                viewName: 'messageChannelMessageAssociationMessageFolderRecordPageFields',
                viewFieldGroupName: 'other',
                name: 'Other',
                position: 1,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-message-channel-message-association-message-folder-view-field-groups.util.js.map