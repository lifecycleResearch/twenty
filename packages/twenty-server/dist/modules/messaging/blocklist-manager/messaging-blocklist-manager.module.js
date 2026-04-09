"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingBlocklistManagerModule", {
    enumerable: true,
    get: function() {
        return MessagingBlocklistManagerModule;
    }
});
const _common = require("@nestjs/common");
const _messagechanneldataaccessmodule = require("../../../engine/metadata-modules/message-channel/data-access/message-channel-data-access.module");
const _messagingblocklistitemdeletemessagesjob = require("./jobs/messaging-blocklist-item-delete-messages.job");
const _messagingblocklistreimportmessagesjob = require("./jobs/messaging-blocklist-reimport-messages.job");
const _messagingblocklistlistener = require("./listeners/messaging-blocklist.listener");
const _messagingcommonmodule = require("../common/messaging-common.module");
const _messagingmessagecleanermodule = require("../message-cleaner/messaging-message-cleaner.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MessagingBlocklistManagerModule = class MessagingBlocklistManagerModule {
};
MessagingBlocklistManagerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _messagingcommonmodule.MessagingCommonModule,
            _messagingmessagecleanermodule.MessagingMessageCleanerModule,
            _messagechanneldataaccessmodule.MessageChannelDataAccessModule
        ],
        providers: [
            _messagingblocklistlistener.MessagingBlocklistListener,
            _messagingblocklistitemdeletemessagesjob.BlocklistItemDeleteMessagesJob,
            _messagingblocklistreimportmessagesjob.BlocklistReimportMessagesJob
        ],
        exports: []
    })
], MessagingBlocklistManagerModule);

//# sourceMappingURL=messaging-blocklist-manager.module.js.map