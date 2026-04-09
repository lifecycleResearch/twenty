"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageFolderViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardMessageFolderViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardMessageFolderViewFields = (args)=>{
    return {
        allMessageFoldersName: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'allMessageFolders',
                viewFieldName: 'name',
                fieldName: 'name',
                position: 0,
                isVisible: true,
                size: 150
            }
        }),
        allMessageFoldersMessageChannel: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'allMessageFolders',
                viewFieldName: 'messageChannel',
                fieldName: 'messageChannel',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        allMessageFoldersIsSentFolder: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'allMessageFolders',
                viewFieldName: 'isSentFolder',
                fieldName: 'isSentFolder',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        allMessageFoldersIsSynced: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'allMessageFolders',
                viewFieldName: 'isSynced',
                fieldName: 'isSynced',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        allMessageFoldersCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'allMessageFolders',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 4,
                isVisible: true,
                size: 150
            }
        }),
        messageFolderRecordPageFieldsMessageChannel: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'messageFolderRecordPageFields',
                viewFieldName: 'messageChannel',
                fieldName: 'messageChannel',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        messageFolderRecordPageFieldsIsSentFolder: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'messageFolderRecordPageFields',
                viewFieldName: 'isSentFolder',
                fieldName: 'isSentFolder',
                position: 2,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        messageFolderRecordPageFieldsIsSynced: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'messageFolderRecordPageFields',
                viewFieldName: 'isSynced',
                fieldName: 'isSynced',
                position: 3,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        messageFolderRecordPageFieldsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'messageFolderRecordPageFields',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        messageFolderRecordPageFieldsCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageFolder',
            context: {
                viewName: 'messageFolderRecordPageFields',
                viewFieldName: 'createdBy',
                fieldName: 'createdBy',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-message-folder-view-fields.util.js.map