"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageChannelMessageAssociationMessageFolderViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardMessageChannelMessageAssociationMessageFolderViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardMessageChannelMessageAssociationMessageFolderViewFields = (args)=>{
    return {
        allMessageChannelMessageAssociationMessageFoldersMessageChannelMessageAssociation: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociationMessageFolder',
            context: {
                viewName: 'allMessageChannelMessageAssociationMessageFolders',
                viewFieldName: 'messageChannelMessageAssociation',
                fieldName: 'messageChannelMessageAssociation',
                position: 0,
                isVisible: true,
                size: 150
            }
        }),
        allMessageChannelMessageAssociationMessageFoldersMessageFolder: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociationMessageFolder',
            context: {
                viewName: 'allMessageChannelMessageAssociationMessageFolders',
                viewFieldName: 'messageFolder',
                fieldName: 'messageFolder',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        allMessageChannelMessageAssociationMessageFoldersCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociationMessageFolder',
            context: {
                viewName: 'allMessageChannelMessageAssociationMessageFolders',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        messageChannelMessageAssociationMessageFolderRecordPageFieldsMessageChannelMessageAssociation: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociationMessageFolder',
            context: {
                viewName: 'messageChannelMessageAssociationMessageFolderRecordPageFields',
                viewFieldName: 'messageChannelMessageAssociation',
                fieldName: 'messageChannelMessageAssociation',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        messageChannelMessageAssociationMessageFolderRecordPageFieldsMessageFolder: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociationMessageFolder',
            context: {
                viewName: 'messageChannelMessageAssociationMessageFolderRecordPageFields',
                viewFieldName: 'messageFolder',
                fieldName: 'messageFolder',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        messageChannelMessageAssociationMessageFolderRecordPageFieldsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociationMessageFolder',
            context: {
                viewName: 'messageChannelMessageAssociationMessageFolderRecordPageFields',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        messageChannelMessageAssociationMessageFolderRecordPageFieldsCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannelMessageAssociationMessageFolder',
            context: {
                viewName: 'messageChannelMessageAssociationMessageFolderRecordPageFields',
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

//# sourceMappingURL=compute-standard-message-channel-message-association-message-folder-view-fields.util.js.map