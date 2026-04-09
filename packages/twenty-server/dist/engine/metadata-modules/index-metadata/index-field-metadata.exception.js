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
    get IndexMetadataException () {
        return IndexMetadataException;
    },
    get IndexMetadataExceptionCode () {
        return IndexMetadataExceptionCode;
    }
});
const _customexception = require("../../../utils/custom-exception");
let IndexMetadataException = class IndexMetadataException extends _customexception.CustomException {
    constructor(message, code, { userFriendlyMessage } = {}){
        super(message, code, {
            userFriendlyMessage: userFriendlyMessage ?? /*i18n*/ {
                id: "P/8dT5",
                message: "An index metadata error occurred."
            }
        });
    }
};
var IndexMetadataExceptionCode = /*#__PURE__*/ function(IndexMetadataExceptionCode) {
    IndexMetadataExceptionCode["INDEX_CREATION_FAILED"] = "INDEX_CREATION_FAILED";
    IndexMetadataExceptionCode["INDEX_NOT_SUPPORTED_FOR_COMPOSITE_FIELD"] = "INDEX_NOT_SUPPORTED_FOR_COMPOSITE_FIELD";
    IndexMetadataExceptionCode["INDEX_NOT_SUPPORTED_FOR_MORH_RELATION_FIELD_AND_RELATION_FIELD"] = "INDEX_NOT_SUPPORTED_FOR_MORH_RELATION_FIELD_AND_RELATION_FIELD";
    return IndexMetadataExceptionCode;
}({});

//# sourceMappingURL=index-field-metadata.exception.js.map