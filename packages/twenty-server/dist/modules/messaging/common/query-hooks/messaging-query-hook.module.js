"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingQueryHookModule", {
    enumerable: true,
    get: function() {
        return MessagingQueryHookModule;
    }
});
const _common = require("@nestjs/common");
const _connectedaccountdataaccessmodule = require("../../../../engine/metadata-modules/connected-account/data-access/connected-account-data-access.module");
const _messagechanneldataaccessmodule = require("../../../../engine/metadata-modules/message-channel/data-access/message-channel-data-access.module");
const _messagefolderdataaccessmodule = require("../../../../engine/metadata-modules/message-folder/data-access/message-folder-data-access.module");
const _applymessagesvisibilityrestrictionsservice = require("./message/apply-messages-visibility-restrictions.service");
const _messagechannelupdateoneprequeryhook = require("./message/message-channel-update-one.pre-query.hook");
const _messagefindmanypostqueryhook = require("./message/message-find-many.post-query.hook");
const _messagefindonepostqueryhook = require("./message/message-find-one.post-query.hook");
const _messagingimportmanagermodule = require("../../message-import-manager/messaging-import-manager.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MessagingQueryHookModule = class MessagingQueryHookModule {
};
MessagingQueryHookModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _messagingimportmanagermodule.MessagingImportManagerModule,
            _connectedaccountdataaccessmodule.ConnectedAccountDataAccessModule,
            _messagechanneldataaccessmodule.MessageChannelDataAccessModule,
            _messagefolderdataaccessmodule.MessageFolderDataAccessModule
        ],
        providers: [
            _applymessagesvisibilityrestrictionsservice.ApplyMessagesVisibilityRestrictionsService,
            _messagefindonepostqueryhook.MessageFindOnePostQueryHook,
            _messagefindmanypostqueryhook.MessageFindManyPostQueryHook,
            _messagechannelupdateoneprequeryhook.MessageChannelUpdateOnePreQueryHook
        ]
    })
], MessagingQueryHookModule);

//# sourceMappingURL=messaging-query-hook.module.js.map