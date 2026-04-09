"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromFlatPageLayoutWidgetToPageLayoutWidgetDto", {
    enumerable: true,
    get: function() {
        return fromFlatPageLayoutWidgetToPageLayoutWidgetDto;
    }
});
const _utils = require("twenty-shared/utils");
const fromFlatPageLayoutWidgetToPageLayoutWidgetDto = (flatPageLayoutWidget)=>{
    const { createdAt, updatedAt, deletedAt, objectMetadataId, ...rest } = flatPageLayoutWidget;
    return {
        ...rest,
        isOverridden: (0, _utils.isDefined)(rest.overrides) && Object.keys(rest.overrides).length > 0,
        objectMetadataId: objectMetadataId ?? undefined,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        deletedAt: deletedAt ? new Date(deletedAt) : undefined
    };
};

//# sourceMappingURL=from-flat-page-layout-widget-to-page-layout-widget-dto.util.js.map