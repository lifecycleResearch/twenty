"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get MESSAGE_FOLDER_DATA_SEEDS () {
        return MESSAGE_FOLDER_DATA_SEEDS;
    },
    get MESSAGE_FOLDER_DATA_SEED_COLUMNS () {
        return MESSAGE_FOLDER_DATA_SEED_COLUMNS;
    },
    get MESSAGE_FOLDER_DATA_SEED_IDS () {
        return MESSAGE_FOLDER_DATA_SEED_IDS;
    }
});
const _types = require("twenty-shared/types");
const _messagechanneldataseedsconstant = require("./message-channel-data-seeds.constant");
const MESSAGE_FOLDER_DATA_SEED_COLUMNS = [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'name',
    'isSynced',
    'isSentFolder',
    'messageChannelId',
    'pendingSyncAction'
];
const MESSAGE_FOLDER_DATA_SEED_IDS = {
    TIM_INBOX: '20202020-f1a2-4b3c-8d4e-5f6a7b8c9d0e',
    TIM_SENT: '20202020-f1a2-4b3c-8d4e-5f6a7b8c9d1e',
    JONY_INBOX: '20202020-f1a2-4b3c-8d4e-5f6a7b8c9d2e',
    JANE_INBOX: '20202020-f1a2-4b3c-8d4e-5f6a7b8c9d3e',
    JANE_SENT: '20202020-f1a2-4b3c-8d4e-5f6a7b8c9d4e'
};
const MESSAGE_FOLDER_DATA_SEEDS = [
    {
        id: MESSAGE_FOLDER_DATA_SEED_IDS.TIM_INBOX,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        name: 'INBOX',
        isSynced: true,
        isSentFolder: false,
        messageChannelId: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.TIM,
        pendingSyncAction: _types.MessageFolderPendingSyncAction.NONE
    },
    {
        id: MESSAGE_FOLDER_DATA_SEED_IDS.TIM_SENT,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        name: 'Sent',
        isSynced: true,
        isSentFolder: true,
        messageChannelId: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.TIM,
        pendingSyncAction: _types.MessageFolderPendingSyncAction.NONE
    },
    {
        id: MESSAGE_FOLDER_DATA_SEED_IDS.JONY_INBOX,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        name: 'INBOX',
        isSynced: true,
        isSentFolder: false,
        messageChannelId: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.JONY,
        pendingSyncAction: _types.MessageFolderPendingSyncAction.NONE
    },
    {
        id: MESSAGE_FOLDER_DATA_SEED_IDS.JANE_INBOX,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        name: 'INBOX',
        isSynced: true,
        isSentFolder: false,
        messageChannelId: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.JANE,
        pendingSyncAction: _types.MessageFolderPendingSyncAction.NONE
    },
    {
        id: MESSAGE_FOLDER_DATA_SEED_IDS.JANE_SENT,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        name: 'Sent',
        isSynced: true,
        isSentFolder: true,
        messageChannelId: _messagechanneldataseedsconstant.MESSAGE_CHANNEL_DATA_SEED_IDS.JANE,
        pendingSyncAction: _types.MessageFolderPendingSyncAction.NONE
    }
];

//# sourceMappingURL=message-folder-data-seeds.constant.js.map