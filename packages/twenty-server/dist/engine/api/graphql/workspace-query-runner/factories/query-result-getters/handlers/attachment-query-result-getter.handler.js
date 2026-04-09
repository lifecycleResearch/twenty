"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AttachmentQueryResultGetterHandler", {
    enumerable: true,
    get: function() {
        return AttachmentQueryResultGetterHandler;
    }
});
let AttachmentQueryResultGetterHandler = class AttachmentQueryResultGetterHandler {
    async handle(attachment, workspaceId) {
        if (!attachment.id || !attachment?.fullPath) {
            return attachment;
        }
        const signedPath = this.fileService.signFileUrl({
            url: attachment.fullPath,
            workspaceId
        });
        const fullPath = `${process.env.SERVER_URL}/files/${signedPath}`;
        return {
            ...attachment,
            fullPath
        };
    }
    constructor(fileService){
        this.fileService = fileService;
    }
};

//# sourceMappingURL=attachment-query-result-getter.handler.js.map