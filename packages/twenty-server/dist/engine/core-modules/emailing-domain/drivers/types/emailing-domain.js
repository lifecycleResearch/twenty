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
    get EmailingDomainDriver () {
        return EmailingDomainDriver;
    },
    get EmailingDomainStatus () {
        return EmailingDomainStatus;
    }
});
var EmailingDomainDriver = /*#__PURE__*/ function(EmailingDomainDriver) {
    EmailingDomainDriver["AWS_SES"] = "AWS_SES";
    return EmailingDomainDriver;
}({});
var EmailingDomainStatus = /*#__PURE__*/ function(EmailingDomainStatus) {
    EmailingDomainStatus["PENDING"] = "PENDING";
    EmailingDomainStatus["VERIFIED"] = "VERIFIED";
    EmailingDomainStatus["FAILED"] = "FAILED";
    EmailingDomainStatus["TEMPORARY_FAILURE"] = "TEMPORARY_FAILURE";
    return EmailingDomainStatus;
}({});

//# sourceMappingURL=emailing-domain.js.map