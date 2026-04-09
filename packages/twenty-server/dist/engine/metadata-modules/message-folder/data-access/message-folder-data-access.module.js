"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageFolderDataAccessModule", {
    enumerable: true,
    get: function() {
        return MessageFolderDataAccessModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _featureflagmodule = require("../../../core-modules/feature-flag/feature-flag.module");
const _messagefolderdataaccessservice = require("./services/message-folder-data-access.service");
const _messagefolderentity = require("../entities/message-folder.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MessageFolderDataAccessModule = class MessageFolderDataAccessModule {
};
MessageFolderDataAccessModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _messagefolderentity.MessageFolderEntity
            ]),
            _featureflagmodule.FeatureFlagModule
        ],
        providers: [
            _messagefolderdataaccessservice.MessageFolderDataAccessService
        ],
        exports: [
            _messagefolderdataaccessservice.MessageFolderDataAccessService
        ]
    })
], MessageFolderDataAccessModule);

//# sourceMappingURL=message-folder-data-access.module.js.map