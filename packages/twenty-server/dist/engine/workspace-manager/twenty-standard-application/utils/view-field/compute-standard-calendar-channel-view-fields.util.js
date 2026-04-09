"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardCalendarChannelViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardCalendarChannelViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardCalendarChannelViewFields = (args)=>{
    return {
        allCalendarChannelsHandle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'allCalendarChannels',
                viewFieldName: 'handle',
                fieldName: 'handle',
                position: 0,
                isVisible: true,
                size: 150
            }
        }),
        allCalendarChannelsConnectedAccount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'allCalendarChannels',
                viewFieldName: 'connectedAccount',
                fieldName: 'connectedAccount',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        allCalendarChannelsVisibility: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'allCalendarChannels',
                viewFieldName: 'visibility',
                fieldName: 'visibility',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        allCalendarChannelsIsSyncEnabled: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'allCalendarChannels',
                viewFieldName: 'isSyncEnabled',
                fieldName: 'isSyncEnabled',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        allCalendarChannelsSyncStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'allCalendarChannels',
                viewFieldName: 'syncStatus',
                fieldName: 'syncStatus',
                position: 4,
                isVisible: true,
                size: 150
            }
        }),
        allCalendarChannelsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'allCalendarChannels',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 5,
                isVisible: true,
                size: 150
            }
        }),
        calendarChannelRecordPageFieldsConnectedAccount: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'calendarChannelRecordPageFields',
                viewFieldName: 'connectedAccount',
                fieldName: 'connectedAccount',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        calendarChannelRecordPageFieldsVisibility: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'calendarChannelRecordPageFields',
                viewFieldName: 'visibility',
                fieldName: 'visibility',
                position: 2,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        calendarChannelRecordPageFieldsIsSyncEnabled: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'calendarChannelRecordPageFields',
                viewFieldName: 'isSyncEnabled',
                fieldName: 'isSyncEnabled',
                position: 3,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        calendarChannelRecordPageFieldsSyncStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'calendarChannelRecordPageFields',
                viewFieldName: 'syncStatus',
                fieldName: 'syncStatus',
                position: 4,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        calendarChannelRecordPageFieldsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'calendarChannelRecordPageFields',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        calendarChannelRecordPageFieldsCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'calendarChannel',
            context: {
                viewName: 'calendarChannelRecordPageFields',
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

//# sourceMappingURL=compute-standard-calendar-channel-view-fields.util.js.map