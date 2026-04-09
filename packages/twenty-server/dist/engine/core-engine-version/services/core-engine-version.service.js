"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CoreEngineVersionService", {
    enumerable: true,
    get: function() {
        return CoreEngineVersionService;
    }
});
const _common = require("@nestjs/common");
const _semver = require("semver");
const _utils = require("twenty-shared/utils");
const _upgradecommandsupportedversionsconstant = require("../../constants/upgrade-command-supported-versions.constant");
const _twentyconfigservice = require("../../core-modules/twenty-config/twenty-config.service");
const _getpreviousversion = require("../../../utils/version/get-previous-version");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CoreEngineVersionService = class CoreEngineVersionService {
    getCurrentVersion() {
        const appVersion = this.twentyConfigService.get('APP_VERSION');
        if (!(0, _utils.isDefined)(appVersion)) {
            throw new Error('APP_VERSION is not defined, please double check your env variables');
        }
        try {
            return new _semver.SemVer(appVersion);
        } catch  {
            throw new Error(`APP_VERSION is not a valid semver: "${appVersion}"`);
        }
    }
    getPreviousVersion() {
        const currentAppVersion = this.getCurrentVersion();
        const currentVersionMajorMinor = `${currentAppVersion.major}.${currentAppVersion.minor}.0`;
        const previousVersion = (0, _getpreviousversion.getPreviousVersion)({
            currentVersion: currentVersionMajorMinor,
            versions: [
                ..._upgradecommandsupportedversionsconstant.UPGRADE_COMMAND_SUPPORTED_VERSIONS
            ]
        });
        if (!(0, _utils.isDefined)(previousVersion)) {
            throw new Error(`No previous version found for version ${currentAppVersion}. Available versions: ${_upgradecommandsupportedversionsconstant.UPGRADE_COMMAND_SUPPORTED_VERSIONS.join(', ')}`);
        }
        return previousVersion;
    }
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
    }
};
CoreEngineVersionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], CoreEngineVersionService);

//# sourceMappingURL=core-engine-version.service.js.map