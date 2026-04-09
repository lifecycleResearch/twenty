"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldSyncFolderByDefault", {
    enumerable: true,
    get: function() {
        return shouldSyncFolderByDefault;
    }
});
const _messagechannelworkspaceentity = require("../../common/standard-objects/message-channel.workspace-entity");
const shouldSyncFolderByDefault = (messageFolderImportPolicy)=>{
    return messageFolderImportPolicy === _messagechannelworkspaceentity.MessageFolderImportPolicy.ALL_FOLDERS;
};

//# sourceMappingURL=should-sync-folder-by-default.util.js.map