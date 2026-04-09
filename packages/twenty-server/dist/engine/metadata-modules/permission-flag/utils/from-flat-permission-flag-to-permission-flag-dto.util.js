"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatPermissionFlagToPermissionFlagDto", {
    enumerable: true,
    get: function() {
        return fromFlatPermissionFlagToPermissionFlagDto;
    }
});
const fromFlatPermissionFlagToPermissionFlagDto = (flatPermissionFlag)=>({
        id: flatPermissionFlag.id,
        roleId: flatPermissionFlag.roleId,
        flag: flatPermissionFlag.flag
    });

//# sourceMappingURL=from-flat-permission-flag-to-permission-flag-dto.util.js.map