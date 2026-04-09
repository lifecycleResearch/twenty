"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SecretEncryptionService", {
    enumerable: true,
    get: function() {
        return SecretEncryptionService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _authutil = require("../auth/auth.util");
const _environmentconfigdriver = require("../twenty-config/drivers/environment-config.driver");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SecretEncryptionService = class SecretEncryptionService {
    getAppSecret() {
        return this.environmentConfigDriver.get('APP_SECRET');
    }
    encrypt(value) {
        if (!(0, _utils.isDefined)(value)) {
            return value;
        }
        const appSecret = this.getAppSecret();
        return (0, _authutil.encryptText)(value, appSecret);
    }
    decrypt(value) {
        if (!(0, _utils.isDefined)(value)) {
            return value;
        }
        const appSecret = this.getAppSecret();
        return (0, _authutil.decryptText)(value, appSecret);
    }
    decryptAndMask({ value, mask }) {
        if (!(0, _utils.isDefined)(value)) {
            return value;
        }
        const decryptedValue = this.decrypt(value);
        const visibleCharsCount = Math.min(5, Math.floor(decryptedValue.length / 10));
        return `${decryptedValue.slice(0, visibleCharsCount)}${mask}`;
    }
    constructor(environmentConfigDriver){
        this.environmentConfigDriver = environmentConfigDriver;
    }
};
SecretEncryptionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _environmentconfigdriver.EnvironmentConfigDriver === "undefined" ? Object : _environmentconfigdriver.EnvironmentConfigDriver
    ])
], SecretEncryptionService);

//# sourceMappingURL=secret-encryption.service.js.map