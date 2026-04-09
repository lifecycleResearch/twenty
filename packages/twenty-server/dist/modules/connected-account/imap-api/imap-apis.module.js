"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IMAPAPIsModule", {
    enumerable: true,
    get: function() {
        return IMAPAPIsModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _authmodule = require("../../../engine/core-modules/auth/auth.module");
const _featureflagmodule = require("../../../engine/core-modules/feature-flag/feature-flag.module");
const _messagequeuemodule = require("../../../engine/core-modules/message-queue/message-queue.module");
const _twentyconfigmodule = require("../../../engine/core-modules/twenty-config/twenty-config.module");
const _calendarchanneldataaccessmodule = require("../../../engine/metadata-modules/calendar-channel/data-access/calendar-channel-data-access.module");
const _connectedaccountdataaccessmodule = require("../../../engine/metadata-modules/connected-account/data-access/connected-account-data-access.module");
const _messagechanneldataaccessmodule = require("../../../engine/metadata-modules/message-channel/data-access/message-channel-data-access.module");
const _objectmetadataentity = require("../../../engine/metadata-modules/object-metadata/object-metadata.entity");
const _twentyormmodule = require("../../../engine/twenty-orm/twenty-orm.module");
const _workspaceeventemittermodule = require("../../../engine/workspace-event-emitter/workspace-event-emitter.module");
const _imapsmtpcaldavapisservice = require("../services/imap-smtp-caldav-apis.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let IMAPAPIsModule = class IMAPAPIsModule {
};
IMAPAPIsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _objectmetadataentity.ObjectMetadataEntity
            ]),
            _messagequeuemodule.MessageQueueModule,
            _workspaceeventemittermodule.WorkspaceEventEmitterModule,
            _twentyconfigmodule.TwentyConfigModule,
            _twentyormmodule.TwentyORMModule,
            _featureflagmodule.FeatureFlagModule,
            _authmodule.AuthModule,
            _calendarchanneldataaccessmodule.CalendarChannelDataAccessModule,
            _connectedaccountdataaccessmodule.ConnectedAccountDataAccessModule,
            _messagechanneldataaccessmodule.MessageChannelDataAccessModule
        ],
        providers: [
            _imapsmtpcaldavapisservice.ImapSmtpCalDavAPIService
        ],
        exports: [
            _imapsmtpcaldavapisservice.ImapSmtpCalDavAPIService
        ]
    })
], IMAPAPIsModule);

//# sourceMappingURL=imap-apis.module.js.map