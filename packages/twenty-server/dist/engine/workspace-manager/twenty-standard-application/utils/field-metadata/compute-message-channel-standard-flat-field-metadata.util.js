"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMessageChannelStandardFlatFieldMetadatas", {
    enumerable: true,
    get: function() {
        return buildMessageChannelStandardFlatFieldMetadatas;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _types = require("twenty-shared/types");
const _createstandardfieldflatmetadatautil = require("./create-standard-field-flat-metadata.util");
const _createstandardrelationfieldflatmetadatautil = require("./create-standard-relation-field-flat-metadata.util");
const _gettsvectorcolumnexpressionutil = require("../../../utils/get-ts-vector-column-expression.util");
const _messagechannelworkspaceentity = require("../../../../../modules/messaging/common/standard-objects/message-channel.workspace-entity");
const buildMessageChannelStandardFlatFieldMetadatas = ({ now, objectName, workspaceId, standardObjectMetadataRelatedEntityIds, dependencyFlatEntityMaps, twentyStandardApplicationId })=>({
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
                    id: "Wrf8X3",
                    message: "Message Channel record position"
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
                    asExpression: (0, _gettsvectorcolumnexpressionutil.getTsVectorColumnExpressionFromFields)(_messagechannelworkspaceentity.SEARCH_FIELDS_FOR_MESSAGE_CHANNEL)
                }
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
                        id: '20202020-4548-4830-b3f8-221fd082ebc0',
                        value: 'METADATA',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "6GBt0m",
                            message: "Metadata"
                        }),
                        position: 0,
                        color: 'green'
                    },
                    {
                        id: '20202020-6a42-40a8-b81e-28b7e591c598',
                        value: 'SUBJECT',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "UJmAAK",
                            message: "Subject"
                        }),
                        position: 1,
                        color: 'blue'
                    },
                    {
                        id: '20202020-d520-4cba-8832-5bca315b64f3',
                        value: 'SHARE_EVERYTHING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "KEdDJc",
                            message: "Share Everything"
                        }),
                        position: 2,
                        color: 'orange'
                    }
                ]
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
        type: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'type',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "+zy2Nq",
                    message: "Type"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Ubg/B+",
                    message: "Channel Type"
                }),
                icon: 'IconMessage',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: `'${_messagechannelworkspaceentity.MessageChannelType.EMAIL}'`,
                options: [
                    {
                        id: '20202020-1628-4bc0-aae1-1a46c648cf90',
                        value: _messagechannelworkspaceentity.MessageChannelType.EMAIL,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "O3oNi5",
                            message: "Email"
                        }),
                        position: 0,
                        color: 'green'
                    },
                    {
                        id: '20202020-fb11-4da3-80fd-b291cda8deb1',
                        value: _messagechannelworkspaceentity.MessageChannelType.SMS,
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "TEERTx",
                            message: "SMS"
                        }),
                        position: 1,
                        color: 'blue'
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
                    id: "RpExX0",
                    message: "Automatically create People records when receiving or sending emails"
                }),
                icon: 'IconUserCircle',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: "'SENT'",
                options: [
                    {
                        id: '20202020-1923-4ffd-907d-be8cc37ecee5',
                        value: 'SENT_AND_RECEIVED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "hdVMzO",
                            message: "Sent and Received"
                        }),
                        position: 0,
                        color: 'green'
                    },
                    {
                        id: '20202020-8f6a-44d8-bdbb-90cf8b919467',
                        value: 'SENT',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "h69WC6",
                            message: "Sent"
                        }),
                        position: 1,
                        color: 'blue'
                    },
                    {
                        id: '20202020-b43e-4bc4-840e-d903a69e2ffc',
                        value: 'NONE',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "EdQY6l",
                            message: "None"
                        }),
                        position: 2,
                        color: 'red'
                    }
                ]
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        messageFolderImportPolicy: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'messageFolderImportPolicy',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "XCJIdB",
                    message: "Message folder import policy"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "XCJIdB",
                    message: "Message folder import policy"
                }),
                icon: 'IconFolder',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: "'ALL_FOLDERS'",
                options: [
                    {
                        id: '20202020-140d-4326-978c-83ca0e9a4d8f',
                        value: 'ALL_FOLDERS',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "LOzhoI",
                            message: "All folders"
                        }),
                        position: 0,
                        color: 'green'
                    },
                    {
                        id: '20202020-513a-4b91-9033-5b74b404e2cb',
                        value: 'SELECTED_FOLDERS',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "AM0pWl",
                            message: "Selected folders"
                        }),
                        position: 1,
                        color: 'blue'
                    }
                ]
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        excludeNonProfessionalEmails: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'excludeNonProfessionalEmails',
                type: _types.FieldMetadataType.BOOLEAN,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "kenYGr",
                    message: "Exclude non professional emails"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "kenYGr",
                    message: "Exclude non professional emails"
                }),
                icon: 'IconBriefcase',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        excludeGroupEmails: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'excludeGroupEmails',
                type: _types.FieldMetadataType.BOOLEAN,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "QQlMid",
                    message: "Exclude group emails"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "QQlMid",
                    message: "Exclude group emails"
                }),
                icon: 'IconUsersGroup',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: true
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        pendingGroupEmailsAction: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'pendingGroupEmailsAction',
                type: _types.FieldMetadataType.SELECT,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "5aGQev",
                    message: "Pending group emails action"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "ttZgHv",
                    message: "Pending action for group emails"
                }),
                icon: 'IconUsersGroup',
                isNullable: false,
                isUIReadOnly: true,
                defaultValue: "'NONE'",
                options: [
                    {
                        id: '20202020-2ead-4bd1-aa5d-5005c7a956b4',
                        value: 'GROUP_EMAILS_DELETION',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "eBU3Ir",
                            message: "Group emails deletion"
                        }),
                        position: 0,
                        color: 'red'
                    },
                    {
                        id: '20202020-155d-447d-a36e-6ecbb30fc37c',
                        value: 'GROUP_EMAILS_IMPORT',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "J5NMR0",
                            message: "Group emails import"
                        }),
                        position: 1,
                        color: 'green'
                    },
                    {
                        id: '20202020-fe98-4018-9f94-f878c22b8ece',
                        value: 'NONE',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "EdQY6l",
                            message: "None"
                        }),
                        position: 2,
                        color: 'blue'
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
                    id: "Y60/DC",
                    message: "Last sync cursor"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "Y60/DC",
                    message: "Last sync cursor"
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
                        id: '20202020-046b-4bc2-b085-bd69aaa8e577',
                        value: 'ONGOING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "J6n7sl",
                            message: "Ongoing"
                        }),
                        position: 1,
                        color: 'yellow'
                    },
                    {
                        id: '20202020-09ec-4ea6-9a8a-bf48211b67e2',
                        value: 'NOT_SYNCED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "swfAWJ",
                            message: "Not Synced"
                        }),
                        position: 2,
                        color: 'blue'
                    },
                    {
                        id: '20202020-2d1b-4d74-9689-9bd28fd3c3f9',
                        value: 'ACTIVE',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "F6pfE9",
                            message: "Active"
                        }),
                        position: 3,
                        color: 'green'
                    },
                    {
                        id: '20202020-0fb2-4a8b-9f9b-569144a45193',
                        value: 'FAILED_INSUFFICIENT_PERMISSIONS',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "0xypR7",
                            message: "Failed Insufficient Permissions"
                        }),
                        position: 4,
                        color: 'red'
                    },
                    {
                        id: '20202020-bde3-415a-a8ac-55ced6014364',
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
                        id: '20202020-1f62-4d79-a633-33a0e4fce9a6',
                        value: 'MESSAGE_LIST_FETCH_PENDING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "dvds2r",
                            message: "Messages list fetch pending"
                        }),
                        position: 0,
                        color: 'blue'
                    },
                    {
                        id: '20202020-d24f-4c3d-94a6-86c42e0f51d7',
                        value: 'MESSAGE_LIST_FETCH_SCHEDULED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "jSR/1n",
                            message: "Messages list fetch scheduled"
                        }),
                        position: 1,
                        color: 'green'
                    },
                    {
                        id: '20202020-8751-408a-ae46-21a51b76be28',
                        value: 'MESSAGE_LIST_FETCH_ONGOING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "YsufJO",
                            message: "Messages list fetch ongoing"
                        }),
                        position: 2,
                        color: 'orange'
                    },
                    {
                        id: '20202020-1cfa-4a7d-a82d-93c8e29d0671',
                        value: 'MESSAGES_IMPORT_PENDING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "XD38FT",
                            message: "Messages import pending"
                        }),
                        position: 3,
                        color: 'blue'
                    },
                    {
                        id: '20202020-341e-4fbd-9dbf-30a70828ca69',
                        value: 'MESSAGES_IMPORT_SCHEDULED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "/b03nd",
                            message: "Messages import scheduled"
                        }),
                        position: 4,
                        color: 'green'
                    },
                    {
                        id: '20202020-e944-4594-ab81-fdbc53a85026',
                        value: 'MESSAGES_IMPORT_ONGOING',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "S/5Wl+",
                            message: "Messages import ongoing"
                        }),
                        position: 5,
                        color: 'orange'
                    },
                    {
                        id: '20202020-f7c5-4756-9084-02f6a0b1a5f8',
                        value: 'FAILED',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "7Bj3x9",
                            message: "Failed"
                        }),
                        position: 6,
                        color: 'red'
                    },
                    {
                        id: '20202020-0ede-4c75-84f1-29c8309829ec',
                        value: 'PENDING_CONFIGURATION',
                        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                            id: "JiePio",
                            message: "Pending configuration"
                        }),
                        position: 7,
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
        throttleRetryAfter: (0, _createstandardfieldflatmetadatautil.createStandardFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                fieldName: 'throttleRetryAfter',
                type: _types.FieldMetadataType.DATE_TIME,
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JRq1S9",
                    message: "Throttle Retry After"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JRq1S9",
                    message: "Throttle Retry After"
                }),
                icon: 'IconClock',
                isNullable: true,
                isUIReadOnly: true
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
                targetFieldName: 'messageChannels',
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
        messageChannelMessageAssociations: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'messageChannelMessageAssociations',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "DzU4a3",
                    message: "Message Channel Association"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "WoWdku",
                    message: "Messages from the channel."
                }),
                icon: 'IconMessage',
                isNullable: true,
                isUIReadOnly: true,
                targetObjectName: 'messageChannelMessageAssociation',
                targetFieldName: 'messageChannel',
                settings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            },
            standardObjectMetadataRelatedEntityIds,
            dependencyFlatEntityMaps,
            twentyStandardApplicationId,
            now
        }),
        messageFolders: (0, _createstandardrelationfieldflatmetadatautil.createStandardRelationFieldFlatMetadata)({
            objectName,
            workspaceId,
            context: {
                type: _types.FieldMetadataType.RELATION,
                morphId: null,
                fieldName: 'messageFolders',
                label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "p4ANpY",
                    message: "Message Folders"
                }),
                description: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "p4ANpY",
                    message: "Message Folders"
                }),
                icon: 'IconFolder',
                isNullable: true,
                isUIReadOnly: true,
                targetObjectName: 'messageFolder',
                targetFieldName: 'messageChannel',
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

//# sourceMappingURL=compute-message-channel-standard-flat-field-metadata.util.js.map