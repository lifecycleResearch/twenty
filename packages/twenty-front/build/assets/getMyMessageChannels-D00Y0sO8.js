import{g7 as N}from"./index-Dbs2BKyJ.js";var _=function(E){return E.SENT_AND_RECEIVED="SENT_AND_RECEIVED",E.SENT="SENT",E.NONE="NONE",E}({}),S=function(E){return E.ALL_FOLDERS="ALL_FOLDERS",E.SELECTED_FOLDERS="SELECTED_FOLDERS",E}({}),G=function(E){return E.NOT_SYNCED="NOT_SYNCED",E.ONGOING="ONGOING",E.ACTIVE="ACTIVE",E.FAILED_INSUFFICIENT_PERMISSIONS="FAILED_INSUFFICIENT_PERMISSIONS",E.FAILED_UNKNOWN="FAILED_UNKNOWN",E}({}),A=function(E){return E.PENDING_CONFIGURATION="PENDING_CONFIGURATION",E.MESSAGE_LIST_FETCH_PENDING="MESSAGE_LIST_FETCH_PENDING",E.MESSAGE_LIST_FETCH_SCHEDULED="MESSAGE_LIST_FETCH_SCHEDULED",E.MESSAGE_LIST_FETCH_ONGOING="MESSAGE_LIST_FETCH_ONGOING",E.MESSAGES_IMPORT_PENDING="MESSAGES_IMPORT_PENDING",E.MESSAGES_IMPORT_SCHEDULED="MESSAGES_IMPORT_SCHEDULED",E.MESSAGES_IMPORT_ONGOING="MESSAGES_IMPORT_ONGOING",E.FAILED="FAILED",E}({});const O=N`
  query MyMessageChannels($connectedAccountId: UUID) {
    myMessageChannels(connectedAccountId: $connectedAccountId) {
      id
      handle
      visibility
      type
      isContactAutoCreationEnabled
      contactAutoCreationPolicy
      messageFolderImportPolicy
      excludeNonProfessionalEmails
      excludeGroupEmails
      isSyncEnabled
      syncStatus
      syncStage
      syncStageStartedAt
      connectedAccountId
      createdAt
      updatedAt
    }
  }
`;export{O as G,A as M,G as a,_ as b,S as c};
