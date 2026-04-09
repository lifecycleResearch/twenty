"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getFirstNameAndLastNameFromHandleAndDisplayName", {
    enumerable: true,
    get: function() {
        return getFirstNameAndLastNameFromHandleAndDisplayName;
    }
});
const _utils = require("twenty-shared/utils");
function getFirstNameAndLastNameFromHandleAndDisplayName(handle, displayName) {
    const firstName = displayName.split(' ')[0];
    const lastName = displayName.split(' ')[1];
    const contactFullNameFromHandle = handle.split('@')[0];
    const firstNameFromHandle = contactFullNameFromHandle.split('.')[0];
    const lastNameFromHandle = contactFullNameFromHandle.split('.')[1];
    return {
        firstName: (0, _utils.capitalize)(firstName || firstNameFromHandle || ''),
        lastName: (0, _utils.capitalize)(lastName || lastNameFromHandle || '')
    };
}

//# sourceMappingURL=get-first-name-and-last-name-from-handle-and-display-name.util.js.map