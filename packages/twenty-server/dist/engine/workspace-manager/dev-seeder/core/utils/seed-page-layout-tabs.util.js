"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedPageLayoutTabs", {
    enumerable: true,
    get: function() {
        return seedPageLayoutTabs;
    }
});
const _getpagelayouttabdataseedsutil = require("./get-page-layout-tab-data-seeds.util");
const seedPageLayoutTabs = async ({ applicationId, dataSource, schemaName, workspaceId })=>{
    const pageLayoutTabs = (0, _getpagelayouttabdataseedsutil.getPageLayoutTabDataSeeds)({
        workspaceId,
        applicationId
    });
    if (pageLayoutTabs.length > 0) {
        await dataSource.createQueryBuilder().insert().into(`${schemaName}.pageLayoutTab`, [
            'id',
            'title',
            'position',
            'pageLayoutId',
            'workspaceId',
            'universalIdentifier',
            'applicationId',
            'overrides'
        ]).values(pageLayoutTabs).orIgnore().execute();
    }
};

//# sourceMappingURL=seed-page-layout-tabs.util.js.map