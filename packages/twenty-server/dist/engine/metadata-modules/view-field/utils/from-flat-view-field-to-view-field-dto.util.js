"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatViewFieldToViewFieldDto", {
    enumerable: true,
    get: function() {
        return fromFlatViewFieldToViewFieldDto;
    }
});
const _utils = require("twenty-shared/utils");
const fromFlatViewFieldToViewFieldDto = (flatViewField)=>{
    const { createdAt, updatedAt, deletedAt, ...rest } = flatViewField;
    return {
        ...rest,
        isOverridden: (0, _utils.isDefined)(rest.overrides) && Object.keys(rest.overrides).length > 0,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        deletedAt: deletedAt ? new Date(deletedAt) : null
    };
};

//# sourceMappingURL=from-flat-view-field-to-view-field-dto.util.js.map