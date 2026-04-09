"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardBlocklistViewFieldGroups", {
    enumerable: true,
    get: function() {
        return computeStandardBlocklistViewFieldGroups;
    }
});
const _createstandardviewfieldgroupflatmetadatautil = require("./create-standard-view-field-group-flat-metadata.util");
const computeStandardBlocklistViewFieldGroups = (args)=>{
    return {
        blocklistRecordPageFieldsGeneral: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'blocklist',
            context: {
                viewName: 'blocklistRecordPageFields',
                viewFieldGroupName: 'general',
                name: 'General',
                position: 0,
                isVisible: true
            }
        }),
        blocklistRecordPageFieldsOther: (0, _createstandardviewfieldgroupflatmetadatautil.createStandardViewFieldGroupFlatMetadata)({
            ...args,
            objectName: 'blocklist',
            context: {
                viewName: 'blocklistRecordPageFields',
                viewFieldGroupName: 'other',
                name: 'Other',
                position: 1,
                isVisible: true
            }
        })
    };
};

//# sourceMappingURL=compute-standard-blocklist-view-field-groups.util.js.map