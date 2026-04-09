"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardNoteViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardNoteViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardNoteViewFields = (args)=>{
    return {
        allNotesTitle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'allNotes',
                viewFieldName: 'title',
                fieldName: 'title',
                position: 0,
                isVisible: true,
                size: 210
            }
        }),
        allNotesNoteTargets: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'allNotes',
                viewFieldName: 'noteTargets',
                fieldName: 'noteTargets',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        allNotesBodyV2: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'allNotes',
                viewFieldName: 'bodyV2',
                fieldName: 'bodyV2',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        allNotesCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'allNotes',
                viewFieldName: 'createdBy',
                fieldName: 'createdBy',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        allNotesCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'allNotes',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 4,
                isVisible: true,
                size: 150
            }
        }),
        // noteRecordPageFields view fields
        noteRecordPageFieldsNoteTargets: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'noteRecordPageFields',
                viewFieldName: 'noteTargets',
                fieldName: 'noteTargets',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        noteRecordPageFieldsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'noteRecordPageFields',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        noteRecordPageFieldsCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'noteRecordPageFields',
                viewFieldName: 'createdBy',
                fieldName: 'createdBy',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        noteRecordPageFieldsBodyV2: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'noteRecordPageFields',
                viewFieldName: 'bodyV2',
                fieldName: 'bodyV2',
                position: 0,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'additional'
            }
        }),
        noteRecordPageFieldsUpdatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'noteRecordPageFields',
                viewFieldName: 'updatedAt',
                fieldName: 'updatedAt',
                position: 2,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        noteRecordPageFieldsUpdatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'noteRecordPageFields',
                viewFieldName: 'updatedBy',
                fieldName: 'updatedBy',
                position: 3,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        noteRecordPageFieldsAttachments: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'noteRecordPageFields',
                viewFieldName: 'attachments',
                fieldName: 'attachments',
                position: 2,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        noteRecordPageFieldsTimelineActivities: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'noteRecordPageFields',
                viewFieldName: 'timelineActivities',
                fieldName: 'timelineActivities',
                position: 3,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        noteRecordPageFieldsFavorites: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'note',
            context: {
                viewName: 'noteRecordPageFields',
                viewFieldName: 'favorites',
                fieldName: 'favorites',
                position: 4,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'general'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-note-view-fields.util.js.map