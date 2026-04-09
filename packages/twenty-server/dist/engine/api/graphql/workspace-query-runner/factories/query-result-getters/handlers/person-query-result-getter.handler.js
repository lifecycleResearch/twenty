"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PersonQueryResultGetterHandler", {
    enumerable: true,
    get: function() {
        return PersonQueryResultGetterHandler;
    }
});
let PersonQueryResultGetterHandler = class PersonQueryResultGetterHandler {
    async handle(person, workspaceId) {
        if (!person.id || !person?.avatarUrl) {
            return person;
        }
        const signedPath = this.fileService.signFileUrl({
            url: person.avatarUrl,
            workspaceId
        });
        return {
            ...person,
            avatarUrl: signedPath
        };
    }
    constructor(fileService){
        this.fileService = fileService;
    }
};

//# sourceMappingURL=person-query-result-getter.handler.js.map