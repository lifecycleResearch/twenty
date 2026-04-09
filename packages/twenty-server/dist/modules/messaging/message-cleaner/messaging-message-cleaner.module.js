"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingMessageCleanerModule", {
    enumerable: true,
    get: function() {
        return MessagingMessageCleanerModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceentity = require("../../../engine/core-modules/workspace/workspace.entity");
const _datasourcemodule = require("../../../engine/metadata-modules/data-source/data-source.module");
const _messagechanneldataaccessmodule = require("../../../engine/metadata-modules/message-channel/data-access/message-channel-data-access.module");
const _messagingcommonmodule = require("../common/messaging-common.module");
const _messagingmessageclearnerremoveorphanscommand = require("./commands/messaging-message-clearner-remove-orphans.command");
const _messagingresetchannelcommand = require("./commands/messaging-reset-channel.command");
const _messagingconnectedaccountdeletioncleanupjob = require("./jobs/messaging-connected-account-deletion-cleanup.job");
const _messagingmessagecleanerconnectedaccountlistener = require("./listeners/messaging-message-cleaner-connected-account.listener");
const _messagingmessagecleanerservice = require("./services/messaging-message-cleaner.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MessagingMessageCleanerModule = class MessagingMessageCleanerModule {
};
MessagingMessageCleanerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity
            ]),
            _datasourcemodule.DataSourceModule,
            _messagingcommonmodule.MessagingCommonModule,
            _messagechanneldataaccessmodule.MessageChannelDataAccessModule
        ],
        providers: [
            _messagingconnectedaccountdeletioncleanupjob.MessagingConnectedAccountDeletionCleanupJob,
            _messagingmessagecleanerconnectedaccountlistener.MessagingMessageCleanerConnectedAccountListener,
            _messagingmessageclearnerremoveorphanscommand.MessagingMessageCleanerRemoveOrphansCommand,
            _messagingresetchannelcommand.MessagingResetChannelCommand,
            _messagingmessagecleanerservice.MessagingMessageCleanerService
        ],
        exports: [
            _messagingmessagecleanerservice.MessagingMessageCleanerService
        ]
    })
], MessagingMessageCleanerModule);

//# sourceMappingURL=messaging-message-cleaner.module.js.map