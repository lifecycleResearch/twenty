"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedPageLayouts", {
    enumerable: true,
    get: function() {
        return seedPageLayouts;
    }
});
const _getpagelayoutdataseedsutil = require("./get-page-layout-data-seeds.util");
const seedPageLayouts = async (dataSource, schemaName, workspaceId, applicationId)=>{
    const pageLayouts = (0, _getpagelayoutdataseedsutil.getPageLayoutDataSeeds)(workspaceId, applicationId);
    if (pageLayouts.length > 0) {
        await dataSource.createQueryBuilder().insert().into(`${schemaName}.pageLayout`, [
            'id',
            'name',
            'type',
            'objectMetadataId',
            'workspaceId',
            'universalIdentifier',
            'applicationId'
        ]).values(pageLayouts).orIgnore().execute();
    }
};

//# sourceMappingURL=seed-page-layouts.util.js.map