"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedMetadataEntities", {
    enumerable: true,
    get: function() {
        return seedMetadataEntities;
    }
});
const _types = require("twenty-shared/types");
const _seederworkspacesconstant = require("../constants/seeder-workspaces.constant");
const _seeduserworkspacesutil = require("./seed-user-workspaces.util");
const _calendarchanneldataseedsconstant = require("../../data/constants/calendar-channel-data-seeds.constant");
const _connectedaccountdataseedsconstant = require("../../data/constants/connected-account-data-seeds.constant");
const _messagechanneldataseedsconstant = require("../../data/constants/message-channel-data-seeds.constant");
const _messagefolderdataseedsconstant = require("../../data/constants/message-folder-data-seeds.constant");
const seedMetadataEntities = async ({ queryRunner, schemaName, workspaceId })=>{
    if (workspaceId !== _seederworkspacesconstant.SEED_APPLE_WORKSPACE_ID && workspaceId !== _seederworkspacesconstant.SEED_YCOMBINATOR_WORKSPACE_ID) {
        return;
    }
    if (workspaceId === _seederworkspacesconstant.SEED_YCOMBINATOR_WORKSPACE_ID) {
        return;
    }
    await seedConnectedAccounts({
        queryRunner,
        schemaName,
        workspaceId
    });
    await seedMessageChannels({
        queryRunner,
        schemaName,
        workspaceId
    });
    await seedCalendarChannels({
        queryRunner,
        schemaName,
        workspaceId
    });
    await seedMessageFolders({
        queryRunner,
        schemaName,
        workspaceId
    });
};
const seedConnectedAccounts = async ({ queryRunner, schemaName, workspaceId })=>{
    const connectedAccounts = [
        {
            id: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.TIM,
            handle: 'tim@apple.dev',
            provider: 'google',
            userWorkspaceId: _seeduserworkspacesutil.USER_WORKSPACE_DATA_SEED_IDS.TIM,
            workspaceId
        },
        {
            id: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JONY,
            handle: 'jony.ive@apple.dev',
            provider: 'google',
            userWorkspaceId: _seeduserworkspacesutil.USER_WORKSPACE_DATA_SEED_IDS.JONY,
            workspaceId
        },
        {
            id: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.PHIL,
            handle: 'phil.schiler@apple.dev',
            provider: 'google',
            userWorkspaceId: _seeduserworkspacesutil.USER_WORKSPACE_DATA_SEED_IDS.PHIL,
            workspaceId
        },
        {
            id: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JANE,
            handle: 'jane.austen@apple.dev',
            provider: 'google',
            userWorkspaceId: _seeduserworkspacesutil.USER_WORKSPACE_DATA_SEED_IDS.JANE,
            workspaceId
        },
        {
            id: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JANE_DELETABLE,
            handle: 'jane-deletable@apple.dev',
            provider: 'google',
            userWorkspaceId: _seeduserworkspacesutil.USER_WORKSPACE_DATA_SEED_IDS.JANE,
            workspaceId
        }
    ];
    await queryRunner.manager.createQueryBuilder().insert().into(`${schemaName}.connectedAccount`, [
        'id',
        'handle',
        'provider',
        'userWorkspaceId',
        'workspaceId'
    ]).orIgnore().values(connectedAccounts).execute();
};
const seedMessageChannels = async ({ queryRunner, schemaName, workspaceId })=>{
    const messageChannels = [
        {
            id: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.TIM,
            handle: 'tim@apple.dev',
            visibility: _types.MessageChannelVisibility.SHARE_EVERYTHING,
            type: _types.MessageChannelType.EMAIL,
            syncStage: _types.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
            isContactAutoCreationEnabled: true,
            contactAutoCreationPolicy: 'SENT_AND_RECEIVED',
            messageFolderImportPolicy: 'ALL_FOLDERS',
            excludeNonProfessionalEmails: false,
            excludeGroupEmails: false,
            pendingGroupEmailsAction: 'NONE',
            isSyncEnabled: true,
            connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.TIM,
            workspaceId
        },
        {
            id: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.JONY,
            handle: 'jony.ive@apple.dev',
            visibility: _types.MessageChannelVisibility.SHARE_EVERYTHING,
            type: _types.MessageChannelType.EMAIL,
            syncStage: _types.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
            isContactAutoCreationEnabled: true,
            contactAutoCreationPolicy: 'SENT_AND_RECEIVED',
            messageFolderImportPolicy: 'ALL_FOLDERS',
            excludeNonProfessionalEmails: false,
            excludeGroupEmails: false,
            pendingGroupEmailsAction: 'NONE',
            isSyncEnabled: true,
            connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JONY,
            workspaceId
        },
        {
            id: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.JANE,
            handle: 'jane.austen@apple.dev',
            visibility: _types.MessageChannelVisibility.SHARE_EVERYTHING,
            type: _types.MessageChannelType.EMAIL,
            syncStage: _types.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING,
            isContactAutoCreationEnabled: true,
            contactAutoCreationPolicy: 'SENT_AND_RECEIVED',
            messageFolderImportPolicy: 'ALL_FOLDERS',
            excludeNonProfessionalEmails: false,
            excludeGroupEmails: false,
            pendingGroupEmailsAction: 'NONE',
            isSyncEnabled: true,
            connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JANE,
            workspaceId
        }
    ];
    await queryRunner.manager.createQueryBuilder().insert().into(`${schemaName}.messageChannel`, [
        'id',
        'handle',
        'visibility',
        'type',
        'syncStage',
        'isContactAutoCreationEnabled',
        'contactAutoCreationPolicy',
        'messageFolderImportPolicy',
        'excludeNonProfessionalEmails',
        'excludeGroupEmails',
        'pendingGroupEmailsAction',
        'isSyncEnabled',
        'connectedAccountId',
        'workspaceId'
    ]).orIgnore().values(messageChannels).execute();
};
const seedCalendarChannels = async ({ queryRunner, schemaName, workspaceId })=>{
    const calendarChannels = [
        {
            id: _calendarchanneldataseedsconstant.CALENDAR_CHANNEL_DATA_SEED_IDS.TIM,
            handle: 'tim@apple.dev',
            visibility: _types.CalendarChannelVisibility.METADATA,
            syncStage: 'CALENDAR_EVENT_LIST_FETCH_PENDING',
            isContactAutoCreationEnabled: true,
            contactAutoCreationPolicy: 'NONE',
            isSyncEnabled: true,
            connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.TIM,
            workspaceId
        },
        {
            id: _calendarchanneldataseedsconstant.CALENDAR_CHANNEL_DATA_SEED_IDS.JONY,
            handle: 'jony@apple.dev',
            visibility: _types.CalendarChannelVisibility.SHARE_EVERYTHING,
            syncStage: 'CALENDAR_EVENT_LIST_FETCH_PENDING',
            isContactAutoCreationEnabled: true,
            contactAutoCreationPolicy: 'NONE',
            isSyncEnabled: true,
            connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JONY,
            workspaceId
        },
        {
            id: _calendarchanneldataseedsconstant.CALENDAR_CHANNEL_DATA_SEED_IDS.JANE,
            handle: 'jane.austen@apple.dev',
            visibility: _types.CalendarChannelVisibility.SHARE_EVERYTHING,
            syncStage: 'CALENDAR_EVENT_LIST_FETCH_PENDING',
            isContactAutoCreationEnabled: true,
            contactAutoCreationPolicy: 'NONE',
            isSyncEnabled: true,
            connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JANE,
            workspaceId
        }
    ];
    await queryRunner.manager.createQueryBuilder().insert().into(`${schemaName}.calendarChannel`, [
        'id',
        'handle',
        'visibility',
        'syncStage',
        'isContactAutoCreationEnabled',
        'contactAutoCreationPolicy',
        'isSyncEnabled',
        'connectedAccountId',
        'workspaceId'
    ]).orIgnore().values(calendarChannels).execute();
};
const seedMessageFolders = async ({ queryRunner, schemaName, workspaceId })=>{
    const messageFolders = [
        {
            id: _messagefolderdataseedsconstant.MESSAGE_FOLDER_DATA_SEED_IDS.TIM_INBOX,
            name: 'INBOX',
            isSynced: true,
            isSentFolder: false,
            messageChannelId: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.TIM,
            workspaceId,
            pendingSyncAction: _types.MessageFolderPendingSyncAction.NONE
        },
        {
            id: _messagefolderdataseedsconstant.MESSAGE_FOLDER_DATA_SEED_IDS.JONY_INBOX,
            name: 'INBOX',
            isSynced: true,
            isSentFolder: false,
            messageChannelId: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.JONY,
            workspaceId,
            pendingSyncAction: _types.MessageFolderPendingSyncAction.NONE
        },
        {
            id: _messagefolderdataseedsconstant.MESSAGE_FOLDER_DATA_SEED_IDS.JANE_INBOX,
            name: 'INBOX',
            isSynced: true,
            isSentFolder: false,
            messageChannelId: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.JANE,
            workspaceId,
            pendingSyncAction: _types.MessageFolderPendingSyncAction.NONE
        },
        {
            id: _messagefolderdataseedsconstant.MESSAGE_FOLDER_DATA_SEED_IDS.JANE_SENT,
            name: 'Sent',
            isSynced: true,
            isSentFolder: true,
            messageChannelId: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.JANE,
            workspaceId,
            pendingSyncAction: _types.MessageFolderPendingSyncAction.NONE
        }
    ];
    await queryRunner.manager.createQueryBuilder().insert().into(`${schemaName}.messageFolder`, [
        'id',
        'name',
        'isSynced',
        'isSentFolder',
        'messageChannelId',
        'workspaceId',
        'pendingSyncAction'
    ]).orIgnore().values(messageFolders).execute();
};

//# sourceMappingURL=seed-metadata-entities.util.js.map