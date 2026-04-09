"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageFolderViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardMessageFolderViewFieldGroups;
    }
});
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardMessageFolderViewFieldGroups = (args)=>{
    return {
        messageFolderRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'messageFolderRecordPageFields',
                viewFieldGroupName: 'general',
                name: 'General',
                position: 0,
                isVisible: true
            }
        }),
        messageFolderRecordPageFieldsOther: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'messageFolderRecordPageFields',
                viewFieldGroupName: 'other',
                name: 'Other',
                position: 1,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-message-folder-view-field-groups.util.js.map