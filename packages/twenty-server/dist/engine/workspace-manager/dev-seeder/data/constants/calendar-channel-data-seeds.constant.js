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
    get CALENDAR_CHANNEL_DATA_SEEDS () {
        return CALENDAR_CHANNEL_DATA_SEEDS;
    },
    get CALENDAR_CHANNEL_DATA_SEED_COLUMNS () {
        return CALENDAR_CHANNEL_DATA_SEED_COLUMNS;
    },
    get CALENDAR_CHANNEL_DATA_SEED_IDS () {
        return CALENDAR_CHANNEL_DATA_SEED_IDS;
    }
});
const _connectedaccountdataseedsconstant = require("./connected-account-data-seeds.constant");
const _calendarchannelworkspaceentity = require("../../../../../modules/calendar/common/standard-objects/calendar-channel.workspace-entity");
const CALENDAR_CHANNEL_DATA_SEED_COLUMNS = [
    'id',
    'connectedAccountId',
    'handle',
    'visibility',
    'isContactAutoCreationEnabled',
    'isSyncEnabled'
];
const GENERATE_CALENDAR_CHANNEL_IDS = ()=>{
    const CHANNEL_IDS = {};
    CHANNEL_IDS['TIM'] = '20202020-a40f-4faf-bb9f-c6f9945b8203';
    CHANNEL_IDS['JONY'] = '20202020-a40f-4faf-bb9f-c6f9945b8204';
    CHANNEL_IDS['PHIL'] = '20202020-a40f-4faf-bb9f-c6f9945b8205';
    CHANNEL_IDS['JANE'] = '20202020-a40f-4faf-bb9f-c6f9945b8208';
    CHANNEL_IDS['COMPANY_MAIN'] = '20202020-a40f-4faf-bb9f-c6f9945b8206';
    CHANNEL_IDS['TEAM_CALENDAR'] = '20202020-a40f-4faf-bb9f-c6f9945b8207';
    return CHANNEL_IDS;
};
const CALENDAR_CHANNEL_DATA_SEED_IDS = GENERATE_CALENDAR_CHANNEL_IDS();
const CALENDAR_CHANNEL_DATA_SEEDS = [
    {
        id: CALENDAR_CHANNEL_DATA_SEED_IDS.TIM,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.TIM,
        handle: 'tim@apple.dev',
        visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA,
        isContactAutoCreationEnabled: true,
        isSyncEnabled: true
    },
    {
        id: CALENDAR_CHANNEL_DATA_SEED_IDS.JONY,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JONY,
        handle: 'jony@apple.dev',
        visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING,
        isContactAutoCreationEnabled: true,
        isSyncEnabled: true
    },
    {
        id: CALENDAR_CHANNEL_DATA_SEED_IDS.PHIL,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.PHIL,
        handle: 'phil@apple.dev',
        visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.METADATA,
        isContactAutoCreationEnabled: true,
        isSyncEnabled: true
    },
    {
        id: CALENDAR_CHANNEL_DATA_SEED_IDS.JANE,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.JANE,
        handle: 'jane.austen@apple.dev',
        visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING,
        isContactAutoCreationEnabled: true,
        isSyncEnabled: true
    },
    {
        id: CALENDAR_CHANNEL_DATA_SEED_IDS.COMPANY_MAIN,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.TIM,
        handle: 'company-main@apple.dev',
        visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING,
        isContactAutoCreationEnabled: true,
        isSyncEnabled: true
    },
    {
        id: CALENDAR_CHANNEL_DATA_SEED_IDS.TEAM_CALENDAR,
        connectedAccountId: _connectedaccountdataseedsconstant.CONNECTED_ACCOUNT_DATA_SEED_IDS.TIM,
        handle: 'team-calendar@apple.dev',
        visibility: _calendarchannelworkspaceentity.CalendarChannelVisibility.SHARE_EVERYTHING,
        isContactAutoCreationEnabled: true,
        isSyncEnabled: true
    }
];

//# sourceMappingURL=calendar-channel-data-seeds.constant.js.map