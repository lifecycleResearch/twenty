"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeUpdatedFolders", {
    enumerable: true,
    get: function() {
        return computeUpdatedFolders;
    }
});
const _messagefolderworkspaceentity = require("../../common/standard-objects/message-folder.workspace-entity");
const computeUpdatedFolders = ({ existingFolders, foldersToUpdate, folderIdsToDelete })=>{
    return existingFolders.map((existingFolder)=>{
        const update = foldersToUpdate.get(existingFolder.id);
        const isMarkedForDeletion = folderIdsToDelete.includes(existingFolder.id);
        const pendingSyncAction = isMarkedForDeletion ? _messagefolderworkspaceentity.MessageFolderPendingSyncAction.FOLDER_DELETION : _messagefolderworkspaceentity.MessageFolderPendingSyncAction.NONE;
        if (update) {
            return {
                ...existingFolder,
                ...update,
                pendingSyncAction
            };
        }
        return {
            ...existingFolder,
            pendingSyncAction
        };
    });
};

//# sourceMappingURL=compute-updated-folders.util.js.map