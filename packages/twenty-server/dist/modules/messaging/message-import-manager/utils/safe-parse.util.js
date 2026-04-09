"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get safeParseEmailAddress () {
        return safeParseEmailAddress;
    },
    get safeParseEmailAddressAddress () {
        return safeParseEmailAddressAddress;
    }
});
const _common = require("@nestjs/common");
const _addressparser = /*#__PURE__*/ _interop_require_default(require("addressparser"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const safeParseEmailAddressAddress = (address)=>{
    const logger = new _common.Logger(safeParseEmailAddressAddress.name);
    try {
        return (0, _addressparser.default)(address)[0].address;
    } catch (error) {
        logger.error(`Error parsing address: ${address}`, error);
        return undefined;
    }
};
const safeParseEmailAddress = (emailAddress)=>{
    return {
        address: safeParseEmailAddressAddress(emailAddress.address) || '',
        name: emailAddress.name
    };
};

//# sourceMappingURL=safe-parse.util.js.map