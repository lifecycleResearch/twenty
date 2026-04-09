"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "objectRecordChangedProperties", {
    enumerable: true,
    get: function() {
        return objectRecordChangedProperties;
    }
});
const _deepequal = /*#__PURE__*/ _interop_require_default(require("deep-equal"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const objectRecordChangedProperties = (oldRecord, newRecord)=>{
    const changedProperties = Object.keys(newRecord).filter(// @ts-expect-error legacy noImplicitAny
    (key)=>!(0, _deepequal.default)(oldRecord[key], newRecord[key]));
    return changedProperties;
};

//# sourceMappingURL=object-record-changed-properties.util.js.map