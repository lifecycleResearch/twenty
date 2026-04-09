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
    get ConnectedAccountWorkspaceEntity () {
        return ConnectedAccountWorkspaceEntity;
    },
    get SEARCH_FIELDS_FOR_CONNECTED_ACCOUNT () {
        return SEARCH_FIELDS_FOR_CONNECTED_ACCOUNT;
    }
});
const _types = require("twenty-shared/types");
const _baseworkspaceentity = require("../../../engine/twenty-orm/base.workspace-entity");
const HANDLE_FIELD_NAME = 'handle';
const SEARCH_FIELDS_FOR_CONNECTED_ACCOUNT = [
    {
        name: HANDLE_FIELD_NAME,
        type: _types.FieldMetadataType.TEXT
    }
];
let ConnectedAccountWorkspaceEntity = class ConnectedAccountWorkspaceEntity extends _baseworkspaceentity.BaseWorkspaceEntity {
};

//# sourceMappingURL=connected-account.workspace-entity.js.map