import{g7 as t}from"./index-Dbs2BKyJ.js";const c=t`
  query MyCalendarChannels($connectedAccountId: UUID) {
    myCalendarChannels(connectedAccountId: $connectedAccountId) {
      id
      handle
      visibility
      syncStatus
      syncStage
      syncStageStartedAt
      isContactAutoCreationEnabled
      contactAutoCreationPolicy
      isSyncEnabled
      connectedAccountId
      createdAt
      updatedAt
    }
  }
`;export{c as G};
