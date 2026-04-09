"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatPageLayoutTabToPageLayoutTabDto", {
    enumerable: true,
    get: function() {
        return fromFlatPageLayoutTabToPageLayoutTabDto;
    }
});
const _utils = require("twenty-shared/utils");
const fromFlatPageLayoutTabToPageLayoutTabDto = (flatPageLayoutTab)=>{
    const { createdAt, updatedAt, deletedAt, widgetIds: _widgetIds, ...rest } = flatPageLayoutTab;
    return {
        ...rest,
        isOverridden: (0, _utils.isDefined)(rest.overrides) && Object.keys(rest.overrides).length > 0,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        deletedAt: deletedAt ? new Date(deletedAt) : null
    };
};

//# sourceMappingURL=from-flat-page-layout-tab-to-page-layout-tab-dto.util.js.map