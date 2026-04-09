"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasSelectAllFieldsSelector", {
    enumerable: true,
    get: function() {
        return hasSelectAllFieldsSelector;
    }
});
const hasSelectAllFieldsSelector = (selector)=>{
    return selector?.fields?.length && selector?.fields.length === 1 && selector?.fields.includes('*');
};

//# sourceMappingURL=has-select-all-fields-selector.util.js.map