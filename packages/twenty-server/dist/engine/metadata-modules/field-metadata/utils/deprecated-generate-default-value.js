"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "deprecatedGenerateDefaultValue", {
    enumerable: true,
    get: function() {
        return deprecatedGenerateDefaultValue;
    }
});
const _types = require("twenty-shared/types");
function deprecatedGenerateDefaultValue(type) {
    switch(type){
        case _types.FieldMetadataType.TEXT:
            return "''";
        case _types.FieldMetadataType.EMAILS:
            return {
                primaryEmail: "''",
                additionalEmails: null
            };
        case _types.FieldMetadataType.FULL_NAME:
            return {
                firstName: "''",
                lastName: "''"
            };
        case _types.FieldMetadataType.ADDRESS:
            return {
                addressStreet1: "''",
                addressStreet2: "''",
                addressCity: "''",
                addressState: "''",
                addressCountry: "''",
                addressPostcode: "''",
                addressLat: null,
                addressLng: null
            };
        case _types.FieldMetadataType.CURRENCY:
            return {
                amountMicros: null,
                currencyCode: "''"
            };
        case _types.FieldMetadataType.LINKS:
            return {
                primaryLinkLabel: "''",
                primaryLinkUrl: "''",
                secondaryLinks: null
            };
        case _types.FieldMetadataType.PHONES:
            return {
                primaryPhoneNumber: "''",
                primaryPhoneCountryCode: "''",
                primaryPhoneCallingCode: "''",
                additionalPhones: null
            };
        case _types.FieldMetadataType.ACTOR:
            return {
                source: `'${_types.FieldActorSource.MANUAL}'`,
                name: "'System'",
                workspaceMemberId: null
            };
        default:
            return null;
    }
}

//# sourceMappingURL=deprecated-generate-default-value.js.map