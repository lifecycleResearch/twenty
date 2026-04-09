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
    get MESSAGE_CHANNEL_DATA_SEEDS () {
        return MESSAGE_CHANNEL_DATA_SEEDS;
    },
    get MESSAGE_CHANNEL_DATA_SEED_COLUMNS () {
        return MESSAGE_CHANNEL_DATA_SEED_COLUMNS;
    },
    get MESSAGE_CHANNEL_DATA_SEED_IDS () {
        return MESSAGE_CHANNEL_DATA_SEED_IDS;
    }
});
const _connectedaccountdataseedsconstant = require("./connected-account-data-seeds.constant");
const _messagechannelworkspaceentity = require("../../../../../modules/messaging/common/standard-objects/message-channel.workspace-entity");
const MESSAGE_CHANNEL_DATA_SEED_COLUMNS = [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'isContactAutoCreationEnabled',
    'type',
    'connectedAccountId',
    'handle',
    'isSyncEnabled',
    'visibility',
    'syncStage'
];
const GENERATE_MESSAGE_CHANNEL_IDS = ()=>{
    const CHANNEL_IDS = {};
    CHANNEL_IDS['TIM'] = '20202020-9b80-4c2c-a597-383db48de1d6';
    CHANNEL_IDS['JONY'] = '20202020-5ffe-4b32-814a-983d5e4911cd';
    CHANNEL_IDS['PHIL'] = '20202020-e2f1-49b5-85d2-5d3a3386990c';
    CHANNEL_IDS['JANE'] = '20202020-8c4d-4e71-a672-2e6a8c9f1b3d';
    CHANNEL_IDS['SUPPORT'] = '20202020-e2f1-49b5-85d2-5d3a3386990d';
    CHANNEL_IDS['SALES'] = '20202020-e2f1-49b5-85d2-5d3a3386990e';
    return CHANNEL_IDS;
};
const MESSAGE_CHANNEL_DATA_SEED_IDS = GENERATE_MESSAGE_CHANNEL_IDS();
const MESSAGE_CHANNEL_DATA_SEEDS = [
    {
        id: MESSAGE_CHANNEL_DATA_SEED_IDS.TIM,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isContactAutoCreationEnabled: true,
        type: _messagechannelworkspaceentity.MessageChannelType.EMAIL,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.TIM,
        handle: 'tim@apple.dev',
        isSyncEnabled: true,
        visibility: _messagechannelworkspaceentity.MessageChannelVisibility.SHARE_EVERYTHING,
        syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING
    },
    {
        id: MESSAGE_CHANNEL_DATA_SEED_IDS.JONY,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isContactAutoCreationEnabled: true,
        type: _messagechannelworkspaceentity.MessageChannelType.EMAIL,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JONY,
        handle: 'jony.ive@apple.dev',
        isSyncEnabled: true,
        visibility: _messagechannelworkspaceentity.MessageChannelVisibility.SHARE_EVERYTHING,
        syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING
    },
    {
        id: MESSAGE_CHANNEL_DATA_SEED_IDS.PHIL,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isContactAutoCreationEnabled: true,
        type: _messagechannelworkspaceentity.MessageChannelType.EMAIL,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.PHIL,
        handle: 'phil.schiler@apple.dev',
        isSyncEnabled: true,
        visibility: _messagechannelworkspaceentity.MessageChannelVisibility.SHARE_EVERYTHING,
        syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING
    },
    {
        id: MESSAGE_CHANNEL_DATA_SEED_IDS.JANE,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isContactAutoCreationEnabled: true,
        type: _messagechannelworkspaceentity.MessageChannelType.EMAIL,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JANE,
        handle: 'jane.austen@apple.dev',
        isSyncEnabled: true,
        visibility: _messagechannelworkspaceentity.MessageChannelVisibility.SHARE_EVERYTHING,
        syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING
    },
    {
        id: MESSAGE_CHANNEL_DATA_SEED_IDS.SUPPORT,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isContactAutoCreationEnabled: true,
        type: _messagechannelworkspaceentity.MessageChannelType.EMAIL,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.TIM,
        handle: 'support@apple.dev',
        isSyncEnabled: true,
        visibility: _messagechannelworkspaceentity.MessageChannelVisibility.SHARE_EVERYTHING,
        syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING
    },
    {
        id: MESSAGE_CHANNEL_DATA_SEED_IDS.SALES,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isContactAutoCreationEnabled: true,
        type: _messagechannelworkspaceentity.MessageChannelType.EMAIL,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.TIM,
        handle: 'sales@apple.dev',
        isSyncEnabled: true,
        visibility: _messagechannelworkspaceentity.MessageChannelVisibility.SHARE_EVERYTHING,
        syncStage: _messagechannelworkspaceentity.MessageChannelSyncStage.MESSAGE_LIST_FETCH_PENDING
    }
];

//# sourceMappingURL=message-channel-data-seeds.constant.js.map