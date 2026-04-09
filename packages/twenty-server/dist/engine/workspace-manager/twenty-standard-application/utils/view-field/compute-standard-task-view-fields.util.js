"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardTaskViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardTaskViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardTaskViewFields = (args)=>{
    return {
        // allTasks view fields
        allTasksTitle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'allTasks',
                viewFieldName: 'title',
                fieldName: 'title',
                position: 0,
                isVisible: true,
                size: 210
            }
        }),
        allTasksStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'allTasks',
                viewFieldName: 'status',
                fieldName: 'status',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        allTasksTaskTargets: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'allTasks',
                viewFieldName: 'taskTargets',
                fieldName: 'taskTargets',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        allTasksCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'allTasks',
                viewFieldName: 'createdBy',
                fieldName: 'createdBy',
                position: 4,
                isVisible: true,
                size: 150
            }
        }),
        allTasksDueAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'allTasks',
                viewFieldName: 'dueAt',
                fieldName: 'dueAt',
                position: 5,
                isVisible: true,
                size: 150
            }
        }),
        allTasksAssignee: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'allTasks',
                viewFieldName: 'assignee',
                fieldName: 'assignee',
                position: 6,
                isVisible: true,
                size: 150
            }
        }),
        allTasksBodyV2: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'allTasks',
                viewFieldName: 'bodyV2',
                fieldName: 'bodyV2',
                position: 7,
                isVisible: true,
                size: 150
            }
        }),
        allTasksCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'allTasks',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 8,
                isVisible: true,
                size: 150
            }
        }),
        // byStatus view fields
        byStatusTitle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'byStatus',
                viewFieldName: 'title',
                fieldName: 'title',
                position: 0,
                isVisible: true,
                size: 210
            }
        }),
        byStatusStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'byStatus',
                viewFieldName: 'status',
                fieldName: 'status',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        byStatusDueAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'byStatus',
                viewFieldName: 'dueAt',
                fieldName: 'dueAt',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        byStatusAssignee: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'byStatus',
                viewFieldName: 'assignee',
                fieldName: 'assignee',
                position: 4,
                isVisible: true,
                size: 150
            }
        }),
        byStatusCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'byStatus',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 6,
                isVisible: true,
                size: 150
            }
        }),
        // assignedToMe view fields
        assignedToMeTitle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'assignedToMe',
                viewFieldName: 'title',
                fieldName: 'title',
                position: 0,
                isVisible: true,
                size: 210
            }
        }),
        assignedToMeTaskTargets: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'assignedToMe',
                viewFieldName: 'taskTargets',
                fieldName: 'taskTargets',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        assignedToMeCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'assignedToMe',
                viewFieldName: 'createdBy',
                fieldName: 'createdBy',
                position: 4,
                isVisible: true,
                size: 150
            }
        }),
        assignedToMeDueAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'assignedToMe',
                viewFieldName: 'dueAt',
                fieldName: 'dueAt',
                position: 5,
                isVisible: true,
                size: 150
            }
        }),
        assignedToMeAssignee: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'assignedToMe',
                viewFieldName: 'assignee',
                fieldName: 'assignee',
                position: 6,
                isVisible: true,
                size: 150
            }
        }),
        assignedToMeBodyV2: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'assignedToMe',
                viewFieldName: 'bodyV2',
                fieldName: 'bodyV2',
                position: 7,
                isVisible: true,
                size: 150
            }
        }),
        assignedToMeCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'assignedToMe',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 8,
                isVisible: true,
                size: 150
            }
        }),
        // taskRecordPageFields view fields
        taskRecordPageFieldsDueAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'dueAt',
                fieldName: 'dueAt',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        taskRecordPageFieldsStatus: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'status',
                fieldName: 'status',
                position: 2,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        taskRecordPageFieldsAssignee: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'assignee',
                fieldName: 'assignee',
                position: 3,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        taskRecordPageFieldsTaskTargets: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'taskTargets',
                fieldName: 'taskTargets',
                position: 4,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        taskRecordPageFieldsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        taskRecordPageFieldsCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'createdBy',
                fieldName: 'createdBy',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        taskRecordPageFieldsBodyV2: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'bodyV2',
                fieldName: 'bodyV2',
                position: 0,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'additional'
            }
        }),
        taskRecordPageFieldsUpdatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'updatedAt',
                fieldName: 'updatedAt',
                position: 2,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        taskRecordPageFieldsUpdatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'updatedBy',
                fieldName: 'updatedBy',
                position: 3,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        taskRecordPageFieldsAttachments: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'attachments',
                fieldName: 'attachments',
                position: 5,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        taskRecordPageFieldsTimelineActivities: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'timelineActivities',
                fieldName: 'timelineActivities',
                position: 6,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        taskRecordPageFieldsFavorites: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                viewFieldName: 'favorites',
                fieldName: 'favorites',
                position: 7,
                isVisible: false,
                size: 150,
                viewFieldGroupName: 'general'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-task-view-fields.util.js.map