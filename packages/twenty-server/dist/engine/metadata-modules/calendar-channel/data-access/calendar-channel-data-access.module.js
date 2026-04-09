"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalendarChannelDataAccessModule", {
    enumerable: true,
    get: function() {
        return CalendarChannelDataAccessModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _featureflagmodule = require("../../../core-modules/feature-flag/feature-flag.module");
const _calendarchanneldataaccessservice = require("./services/calendar-channel-data-access.service");
const _calendarchannelentity = require("../entities/calendar-channel.entity");
const _connectedaccountdataaccessmodule = require("../../connected-account/data-access/connected-account-data-access.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CalendarChannelDataAccessModule = class CalendarChannelDataAccessModule {
};
CalendarChannelDataAccessModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _calendarchannelentity.CalendarChannelEntity
            ]),
            _featureflagmodule.FeatureFlagModule,
            _connectedaccountdataaccessmodule.ConnectedAccountDataAccessModule
        ],
        providers: [
            _calendarchanneldataaccessservice.CalendarChannelDataAccessService
        ],
        exports: [
            _calendarchanneldataaccessservice.CalendarChannelDataAccessService
        ]
    })
], CalendarChannelDataAccessModule);

//# sourceMappingURL=calendar-channel-data-access.module.js.map