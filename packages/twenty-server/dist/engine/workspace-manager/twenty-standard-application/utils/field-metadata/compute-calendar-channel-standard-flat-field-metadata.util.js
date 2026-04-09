"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCalendarChannelStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildCalendarChannelStandardFlatFieldMetadatas;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _types = require("twenty-shared/types");
const _createstandardfieldflatmetadatautil = require("./create-standard-field-flat-metadata.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const _gettsvectorcolumnexpressionutil = require("../../../utils/get-ts-vector-column-expression.util");
const _calendarchannelworkspaceentity = require("../../../../../modules/calendar/common/standard-objects/calendar-channel.workspace-entity");
const buildCalendarChannelStandardFlatFieldMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>({
        id: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'id',
                type: _types.FieldMetadataType.UUID,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "dFb5Nt",
                    message: "Id"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "dFb5Nt",
                    message: "Id"
                }),
                icon: 'Icon123',
                isSystem: true,
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: 'uuid'
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        createdAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'createdAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "wPvFAD",
                    message: "Creation date"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "wPvFAD",
                    message: "Creation date"
                }),
                icon: 'IconCalendar',
                isSystem: true,
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: 'now',
                settings: {
                    displayFormat: _types.DateDisplayFormat.RELATIVE
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        updatedAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'updatedAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "o1zvNS",
                    message: "Last update"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "tGwswq",
                    message: "Last time the record was changed"
                }),
                icon: 'IconCalendarClock',
                isSystem: true,
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: 'now',
                settings: {
                    displayFormat: _types.DateDisplayFormat.RELATIVE
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        deletedAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'deletedAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "QN9ahV",
                    message: "Deleted at"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "1lL5Iu",
                    message: "Date when the record was deleted"
                }),
                icon: 'IconCalendarMinus',
                isSystem: true,
                isNullable: true,
                isUIReadOnly: true,
                settings: {
                    displayFormat: _types.DateDisplayFormat.RELATIVE
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        createdBy: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'createdBy',
                type: _types.FieldMetadataType.ACTOR,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "NCIYDF",
                    message: "Created by"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "zGBDEH",
                    message: "The creator of the record"
                }),
                icon: 'IconCreativeCommonsSa',
                isSystem: true,
                isUIReadOnly: true,
                isNullable: false,
                defaultValue: {
                    source: "'MANUAL'",
                    name: "'System'",
                    workspaceMemberId: null
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        updatedBy: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'updatedBy',
                type: _types.FieldMetadataType.ACTOR,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "KQsreu",
                    message: "Updated by"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "a6NBQe",
                    message: "The workspace member who last updated the record"
                }),
                icon: 'IconUserCircle',
                isSystem: true,
                isUIReadOnly: true,
                isNullable: false,
                defaultValue: {
                    source: "'MANUAL'",
                    name: "'System'",
                    workspaceMemberId: null
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        position: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'position',
                type: _types.FieldMetadataType.POSITION,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "p/78dY",
                    message: "Position"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "fH0CrF",
                    message: "Calendar channel record position"
                }),
                icon: 'IconHierarchy2',
                isSystem: true,
                isNullable: false,
                defaultValue: 0
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        searchVector: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'searchVector',
                type: _types.FieldMetadataType.TS_VECTOR,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "PdVIJC",
                    message: "Search vector"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "J4hC2m",
                    message: "Field used for full-text search"
                }),
                icon: 'IconUser',
                isSystem: true,
                isNullable: true,
                settings: {
                    generatedType: 'STORED',
                    asExpression: (0, _gettsvectorcolumnexpressionutil.getTsVectorColumnExpressionFromFields)(_calendarchannelworkspaceentity.SEARCH_FIELDS_FOR_CALENDAR_CHANNEL)
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        handle: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'handle',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Nf7oXL",
                    message: "Handle"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Nf7oXL",
                    message: "Handle"
                }),
                icon: 'IconAt',
                isNullable: true,
                isUIReadOnly: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        visibility: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'visibility',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "2q/Q7x",
                    message: "Visibility"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "2q/Q7x",
                    message: "Visibility"
                }),
                icon: 'IconEyeglass',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: "'SHARE_EVERYTHING'",
                options: [
                    {
                        id: '20202020-82a0-4859-b356-f5a1d6e3e53d',
                        value: 'METADATA',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "6GBt0m",
                            message: "Metadata"
                        }),
                        position: 0,
                        color: 'green'
                    },
                    {
                        id: '20202020-e5ec-4df5-ba3f-66ca2a79c283',
                        value: 'SHARE_EVERYTHING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "KEdDJc",
                            message: "Share Everything"
                        }),
                        position: 1,
                        color: 'orange'
                    }
                ]
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        isContactAutoCreationEnabled: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'isContactAutoCreationEnabled',
                type: _types.FieldMetadataType.BOOLEAN,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "k+g9Uh",
                    message: "Is Contact Auto Creation Enabled"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "k+g9Uh",
                    message: "Is Contact Auto Creation Enabled"
                }),
                icon: 'IconUserCircle',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        contactAutoCreationPolicy: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'contactAutoCreationPolicy',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bA6O5B",
                    message: "Contact auto creation policy"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "lXxdId",
                    message: "Automatically create records for people you participated with in an event."
                }),
                icon: 'IconUserCircle',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: "'AS_PARTICIPANT_AND_ORGANIZER'",
                options: [
                    {
                        id: '20202020-47c1-4af1-a8a6-540edeafc55e',
                        value: 'AS_PARTICIPANT_AND_ORGANIZER',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "ocyNd7",
                            message: "As Participant and Organizer"
                        }),
                        color: 'green',
                        position: 0
                    },
                    {
                        id: '20202020-b3cc-4248-b0d1-c8d45c2418b3',
                        value: 'AS_PARTICIPANT',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "9PQMwn",
                            message: "As Participant"
                        }),
                        color: 'orange',
                        position: 1
                    },
                    {
                        id: '20202020-84ef-4061-9c22-db596e237ddc',
                        value: 'AS_ORGANIZER',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "KHiv20",
                            message: "As Organizer"
                        }),
                        color: 'blue',
                        position: 2
                    },
                    {
                        id: '20202020-f170-491f-9597-0e5817e46c17',
                        value: 'NONE',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "EdQY6l",
                            message: "None"
                        }),
                        color: 'red',
                        position: 3
                    }
                ]
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        isSyncEnabled: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'isSyncEnabled',
                type: _types.FieldMetadataType.BOOLEAN,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Mqzqb8",
                    message: "Is Sync Enabled"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Mqzqb8",
                    message: "Is Sync Enabled"
                }),
                icon: 'IconRefresh',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        syncCursor: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'syncCursor',
                type: _types.FieldMetadataType.TEXT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "oyJYg7",
                    message: "Sync Cursor"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "awvBUx",
                    message: "Sync Cursor. Used for syncing events from the calendar provider"
                }),
                icon: 'IconReload',
                isNullable: true,
                isUIReadOnly: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        syncStatus: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'syncStatus',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bRUdLR",
                    message: "Sync status"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "bRUdLR",
                    message: "Sync status"
                }),
                icon: 'IconStatusChange',
                isNullable: true,
                isUIReadOnly: true,
                options: [
                    {
                        id: '20202020-ebdc-4fc8-a5c1-4bc6a90fdc3c',
                        value: 'ONGOING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "J6n7sl",
                            message: "Ongoing"
                        }),
                        position: 1,
                        color: 'yellow'
                    },
                    {
                        id: '20202020-7126-4c26-9940-f5807ed87266',
                        value: 'NOT_SYNCED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "swfAWJ",
                            message: "Not Synced"
                        }),
                        position: 2,
                        color: 'blue'
                    },
                    {
                        id: '20202020-0302-4201-bf84-aaa26b7ca94e',
                        value: 'ACTIVE',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "F6pfE9",
                            message: "Active"
                        }),
                        position: 3,
                        color: 'green'
                    },
                    {
                        id: '20202020-6dbb-449d-96b0-092189010f42',
                        value: 'FAILED_INSUFFICIENT_PERMISSIONS',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "0xypR7",
                            message: "Failed Insufficient Permissions"
                        }),
                        position: 4,
                        color: 'red'
                    },
                    {
                        id: '20202020-935c-4333-a614-f49ee2ec6aa7',
                        value: 'FAILED_UNKNOWN',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "ZuOeRA",
                            message: "Failed Unknown"
                        }),
                        position: 5,
                        color: 'red'
                    }
                ]
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        syncStage: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'syncStage',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "dNAbG6",
                    message: "Sync stage"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "dNAbG6",
                    message: "Sync stage"
                }),
                icon: 'IconStatusChange',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: "'PENDING_CONFIGURATION'",
                options: [
                    {
                        id: '20202020-60c1-40a3-90ae-61d9ee1083c1',
                        value: 'CALENDAR_EVENT_LIST_FETCH_PENDING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "rqJQ0G",
                            message: "Calendar event list fetch pending"
                        }),
                        position: 0,
                        color: 'blue'
                    },
                    {
                        id: '20202020-8652-444a-b72e-d4b7112179ca',
                        value: 'CALENDAR_EVENT_LIST_FETCH_SCHEDULED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "+IPrdd",
                            message: "Calendar event list fetch scheduled"
                        }),
                        position: 1,
                        color: 'green'
                    },
                    {
                        id: '20202020-e87c-4cfe-aefc-635ad34ef223',
                        value: 'CALENDAR_EVENT_LIST_FETCH_ONGOING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "25OS5Y",
                            message: "Calendar event list fetch ongoing"
                        }),
                        position: 2,
                        color: 'orange'
                    },
                    {
                        id: '20202020-876f-449d-9f09-de5c369ff95f',
                        value: 'CALENDAR_EVENTS_IMPORT_PENDING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "tXVU5A",
                            message: "Calendar events import pending"
                        }),
                        position: 3,
                        color: 'blue'
                    },
                    {
                        id: '20202020-3d2a-4acd-a0ed-197343b3bf60',
                        value: 'CALENDAR_EVENTS_IMPORT_SCHEDULED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "gn1tDK",
                            message: "Calendar events import scheduled"
                        }),
                        position: 4,
                        color: 'green'
                    },
                    {
                        id: '20202020-e762-4152-bb20-29fdd49e1dff',
                        value: 'CALENDAR_EVENTS_IMPORT_ONGOING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "RyVA/3",
                            message: "Calendar events import ongoing"
                        }),
                        position: 5,
                        color: 'orange'
                    },
                    {
                        id: '20202020-487c-464f-8caa-c6393b82b17c',
                        value: 'FAILED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "7Bj3x9",
                            message: "Failed"
                        }),
                        position: 6,
                        color: 'red'
                    },
                    {
                        id: '20202020-ba03-4221-b186-402662b68493',
                        value: 'PENDING_CONFIGURATION',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "JiePio",
                            message: "Pending configuration"
                        }),
                        position: 9,
                        color: 'gray'
                    }
                ]
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        syncStageStartedAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'syncStageStartedAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "aqNjQE",
                    message: "Sync stage started at"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "aqNjQE",
                    message: "Sync stage started at"
                }),
                icon: 'IconHistory',
                isNullable: true,
                isUIReadOnly: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        syncedAt: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'syncedAt',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Zdx9Qq",
                    message: "Last sync date"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Zdx9Qq",
                    message: "Last sync date"
                }),
                icon: 'IconHistory',
                isNullable: true,
                isUIReadOnly: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        throttleFailureCount: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'throttleFailureCount',
                type: _types.FieldMetadataType.NUMBER,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "sS8v5K",
                    message: "Throttle Failure Count"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "sS8v5K",
                    message: "Throttle Failure Count"
                }),
                icon: 'IconX',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: 0
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        connectedAccount: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'connectedAccount',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "PQ1Dw2",
                    message: "Connected Account"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "PQ1Dw2",
                    message: "Connected Account"
                }),
                icon: 'IconUserCircle',
                isNullable: false,
                isUIReadOnly: true,
                targetObjectName: 'connectedAccount',
                targetFieldName: 'calendarChannels',
                settings: {
                    relationType: _types.RelationType.MANY_TO_ONE,
                    onDelete: _types.RelationOnDeleteAction.CASCADE,
                    joinColumnName: 'connectedAccountId'
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        calendarChannelEventAssociations: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'calendarChannelEventAssociations',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "kYNT3F",
                    message: "Calendar Channel Event Associations"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "kYNT3F",
                    message: "Calendar Channel Event Associations"
                }),
                icon: 'IconCalendar',
                isNullable: false,
                isUIReadOnly: true,
                targetObjectName: 'calendarChannelEventAssociation',
                targetFieldName: 'calendarChannel',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        })
    });

//# sourceMappingURL=compute-calendar-channel-standard-flat-field-metadata.util.js.map