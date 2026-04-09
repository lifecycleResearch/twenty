"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CalDavDriverModule", {
    enumerable: true,
    get: function() {
        return CalDavDriverModule;
    }
});
const _common = require("@nestjs/common");
const _securehttpclientmodule = require("../../../../../engine/core-modules/secure-http-client/secure-http-client.module");
const _twentyconfigmodule = require("../../../../../engine/core-modules/twenty-config/twenty-config.module");
const _caldavprovider = require("./providers/caldav.provider");
const _caldavgeteventsservice = require("./services/caldav-get-events.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CalDavDriverModule = class CalDavDriverModule {
};
CalDavDriverModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _securehttpclientmodule.SecureHttpClientModule,
            _twentyconfigmodule.TwentyConfigModule
        ],
        providers: [
            _caldavprovider.CalDavClientProvider,
            _caldavgeteventsservice.CalDavGetEventsService
        ],
        exports: [
            _caldavgeteventsservice.CalDavGetEventsService
        ]
    })
], CalDavDriverModule);

//# sourceMappingURL=caldav-driver.module.js.map