"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "transformArrayField", {
    enumerable: true,
    get: function() {
        return transformArrayField;
    }
});
const _isnullequivalentarrayfieldvalueutil = require("../utils/is-null-equivalent-array-field-value.util");
const transformArrayField = (value)=>{
    if (typeof value === 'string') return [
        value
    ];
    return (0, _isnullequivalentarrayfieldvalueutil.isNullEquivalentArrayFieldValue)(value) ? null : value;
};

//# sourceMappingURL=transform-array-field.util.js.map