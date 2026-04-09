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
    get ApplicationException () {
        return ApplicationException;
    },
    get ApplicationExceptionCode () {
        return ApplicationExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../utils/custom-exception");
var ApplicationExceptionCode = /*#__PURE__*/ function(ApplicationExceptionCode) {
    ApplicationExceptionCode["OBJECT_NOT_FOUND"] = "OBJECT_NOT_FOUND";
    ApplicationExceptionCode["FIELD_NOT_FOUND"] = "FIELD_NOT_FOUND";
    ApplicationExceptionCode["LOGIC_FUNCTION_NOT_FOUND"] = "LOGIC_FUNCTION_NOT_FOUND";
    ApplicationExceptionCode["FRONT_COMPONENT_NOT_FOUND"] = "FRONT_COMPONENT_NOT_FOUND";
    ApplicationExceptionCode["ENTITY_NOT_FOUND"] = "ENTITY_NOT_FOUND";
    ApplicationExceptionCode["APPLICATION_NOT_FOUND"] = "APPLICATION_NOT_FOUND";
    ApplicationExceptionCode["APP_NOT_INSTALLED"] = "APP_NOT_INSTALLED";
    ApplicationExceptionCode["FORBIDDEN"] = "FORBIDDEN";
    ApplicationExceptionCode["INVALID_INPUT"] = "INVALID_INPUT";
    ApplicationExceptionCode["SOURCE_CHANNEL_MISMATCH"] = "SOURCE_CHANNEL_MISMATCH";
    ApplicationExceptionCode["PACKAGE_RESOLUTION_FAILED"] = "PACKAGE_RESOLUTION_FAILED";
    ApplicationExceptionCode["TARBALL_EXTRACTION_FAILED"] = "TARBALL_EXTRACTION_FAILED";
    ApplicationExceptionCode["UPGRADE_FAILED"] = "UPGRADE_FAILED";
    return ApplicationExceptionCode;
}({});
const getApplicationExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "OBJECT_NOT_FOUND":
            return /*i18n*/ {
                id: "AKqp4k",
                message: "Object not found."
            };
        case "FIELD_NOT_FOUND":
            return /*i18n*/ {
                id: "Ts+YbB",
                message: "Field not found."
            };
        case "LOGIC_FUNCTION_NOT_FOUND":
            return /*i18n*/ {
                id: "6Rq45N",
                message: "Logic function not found."
            };
        case "FRONT_COMPONENT_NOT_FOUND":
            return /*i18n*/ {
                id: "J+VVwG",
                message: "Front component not found."
            };
        case "ENTITY_NOT_FOUND":
            return /*i18n*/ {
                id: "qpXqpa",
                message: "Entity not found."
            };
        case "APPLICATION_NOT_FOUND":
            return /*i18n*/ {
                id: "ltvmAF",
                message: "Application not found."
            };
        case "APP_NOT_INSTALLED":
            return /*i18n*/ {
                id: "ue106l",
                message: "Application is not installed in this workspace. Install it first."
            };
        case "FORBIDDEN":
            return /*i18n*/ {
                id: "q5OVn+",
                message: "You do not have permission to perform this action."
            };
        case "INVALID_INPUT":
            return /*i18n*/ {
                id: "t7SpQO",
                message: "Invalid input provided."
            };
        case "SOURCE_CHANNEL_MISMATCH":
            return /*i18n*/ {
                id: "Oa7nLQ",
                message: "Source channel mismatch."
            };
        case "PACKAGE_RESOLUTION_FAILED":
            return /*i18n*/ {
                id: "SpmRxi",
                message: "Unable to retrieve the application package."
            };
        case "TARBALL_EXTRACTION_FAILED":
            return /*i18n*/ {
                id: "Ol/51Z",
                message: "Failed to extract tarball."
            };
        case "UPGRADE_FAILED":
            return /*i18n*/ {
                id: "QtRMs/",
                message: "Application upgrade failed."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let ApplicationException = class ApplicationException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getApplicationExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=application.exception.js.map