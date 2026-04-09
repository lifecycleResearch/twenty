"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageThreadViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardMessageThreadViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardMessageThreadViewFields = (args)=>{
    return {
        allMessageThreadsMessages: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageThread',
            context: {
                viewName: 'allMessageThreads',
                viewFieldName: 'messages',
                fieldName: 'messages',
                position: 0,
                isVisible: true,
                size: 180
            }
        }),
        allMessageThreadsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageThread',
            context: {
                viewName: 'allMessageThreads',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 1,
                isVisible: true,
                size: 150
            }
        })
    };
};

//# sourceMappingURL=compute-standard-message-thread-view-fields.util.js.map