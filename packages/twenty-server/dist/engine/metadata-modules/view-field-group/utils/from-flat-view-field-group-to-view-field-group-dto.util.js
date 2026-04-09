"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatViewFieldGroupToViewFieldGroupDto", {
    enumerable: true,
    get: function() {
        return fromFlatViewFieldGroupToViewFieldGroupDto;
    }
});
const _utils = require("twenty-shared/utils");
const fromFlatViewFieldGroupToViewFieldGroupDto = (flatViewFieldGroup)=>{
    const { createdAt, updatedAt, deletedAt, ...rest } = flatViewFieldGroup;
    return {
        ...rest,
        isOverridden: (0, _utils.isDefined)(rest.overrides) && Object.keys(rest.overrides).length > 0,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        deletedAt: deletedAt ? new Date(deletedAt) : null
    };
};

//# sourceMappingURL=from-flat-view-field-group-to-view-field-group-dto.util.js.map