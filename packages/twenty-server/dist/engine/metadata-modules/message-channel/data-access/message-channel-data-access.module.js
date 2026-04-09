"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageChannelDataAccessModule", {
    enumerable: true,
    get: function() {
        return MessageChannelDataAccessModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _featureflagmodule = require("../../../core-modules/feature-flag/feature-flag.module");
const _connectedaccountdataaccessmodule = require("../../connected-account/data-access/connected-account-data-access.module");
const _messagechanneldataaccessservice = require("./services/message-channel-data-access.service");
const _messagechannelentity = require("../entities/message-channel.entity");
const _messagefolderdataaccessmodule = require("../../message-folder/data-access/message-folder-data-access.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MessageChannelDataAccessModule = class MessageChannelDataAccessModule {
};
MessageChannelDataAccessModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _messagechannelentity.MessageChannelEntity
            ]),
            _featureflagmodule.FeatureFlagModule,
            _connectedaccountdataaccessmodule.ConnectedAccountDataAccessModule,
            _messagefolderdataaccessmodule.MessageFolderDataAccessModule
        ],
        providers: [
            _messagechanneldataaccessservice.MessageChannelDataAccessService
        ],
        exports: [
            _messagechanneldataaccessservice.MessageChannelDataAccessService
        ]
    })
], MessageChannelDataAccessModule);

//# sourceMappingURL=message-channel-data-access.module.js.map