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
    get DataSourceException () {
        return DataSourceException;
    },
    get DataSourceExceptionCode () {
        return DataSourceExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _standarderrormessageconstant = require("../../api/common/common-query-runners/errors/standard-error-message.constant");
const _customexception = require("../../../utils/custom-exception");
var DataSourceExceptionCode = /*#__PURE__*/ function(DataSourceExceptionCode) {
    DataSourceExceptionCode["DATA_SOURCE_NOT_FOUND"] = "DATA_SOURCE_NOT_FOUND";
    return DataSourceExceptionCode;
}({});
const getDataSourceExceptionUserFriendlyMessage = (code)=>{
    switch(code){
        case "DATA_SOURCE_NOT_FOUND":
            return _standarderrormessageconstant.STANDARD_ERROR_MESSAGE;
        default:
            (0, _utils.assertUnreachable)(code);
    }
};
let DataSourceException = class DataSourceException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? getDataSourceExceptionUserFriendlyMessage(code)
        });
    }
};

//# sourceMappingURL=data-source.exception.js.map