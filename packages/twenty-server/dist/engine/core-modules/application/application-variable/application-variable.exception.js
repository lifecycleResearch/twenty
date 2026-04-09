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
    get ApplicationVariableEntityException () {
        return ApplicationVariableEntityException;
    },
    get ApplicationVariableEntityExceptionCode () {
        return ApplicationVariableEntityExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _customexception = require("../../../../utils/custom-exception");
var ApplicationVariableEntityExceptionCode = /*#__PURE__*/ function(ApplicationVariableEntityExceptionCode) {
    ApplicationVariableEntityExceptionCode["APPLICATION_VARIABLE_NOT_FOUND"] = "APPLICATION_VARIABLE_NOT_FOUND";
    return ApplicationVariableEntityExceptionCode;
}({});
const getApplicationVariableEntityExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "APPLICATION_VARIABLE_NOT_FOUND":
            return /*i18n*/ {
                id: "9qtW5o",
                message: "Application variable not found."
            };
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let ApplicationVariableEntityException = class ApplicationVariableEntityException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getApplicationVariableEntityExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=application-variable.exception.js.map