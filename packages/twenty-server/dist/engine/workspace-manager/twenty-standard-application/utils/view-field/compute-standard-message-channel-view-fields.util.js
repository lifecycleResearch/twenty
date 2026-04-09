"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardMessageChannelViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardMessageChannelViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardMessageChannelViewFields = (args)=>{
    return {
        allMessageChannelsHandle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'allMessageChannels',
                viewFieldName: 'handle',
                fieldName: 'handle',
                position: 0,
                isVisible: true,
                size: 150
            }
        }),
        allMessageChannelsConnectedAccount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'allMessageChannels',
                viewFieldName: 'connectedAccount',
                fieldName: 'connectedAccount',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        allMessageChannelsType: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'allMessageChannels',
                viewFieldName: 'type',
                fieldName: 'type',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        allMessageChannelsVisibility: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'allMessageChannels',
                viewFieldName: 'visibility',
                fieldName: 'visibility',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        allMessageChannelsIsSyncEnabled: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'allMessageChannels',
                viewFieldName: 'isSyncEnabled',
                fieldName: 'isSyncEnabled',
                position: 4,
                isVisible: true,
                size: 150
            }
        }),
        allMessageChannelsSyncStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'allMessageChannels',
                viewFieldName: 'syncStatus',
                fieldName: 'syncStatus',
                position: 5,
                isVisible: true,
                size: 150
            }
        }),
        allMessageChannelsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'allMessageChannels',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 6,
                isVisible: true,
                size: 150
            }
        }),
        messageChannelRecordPageFieldsConnectedAccount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'messageChannelRecordPageFields',
                viewFieldName: 'connectedAccount',
                fieldName: 'connectedAccount',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        messageChannelRecordPageFieldsType: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'messageChannelRecordPageFields',
                viewFieldName: 'type',
                fieldName: 'type',
                position: 2,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        messageChannelRecordPageFieldsVisibility: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'messageChannelRecordPageFields',
                viewFieldName: 'visibility',
                fieldName: 'visibility',
                position: 3,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        messageChannelRecordPageFieldsIsSyncEnabled: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'messageChannelRecordPageFields',
                viewFieldName: 'isSyncEnabled',
                fieldName: 'isSyncEnabled',
                position: 4,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        messageChannelRecordPageFieldsSyncStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'messageChannelRecordPageFields',
                viewFieldName: 'syncStatus',
                fieldName: 'syncStatus',
                position: 5,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        messageChannelRecordPageFieldsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'messageChannelRecordPageFields',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        messageChannelRecordPageFieldsCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'messageChannel',
            context: {
                viewName: 'messageChannelRecordPageFields',
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

//# sourceMappingURL=compute-standard-message-channel-view-fields.util.js.map