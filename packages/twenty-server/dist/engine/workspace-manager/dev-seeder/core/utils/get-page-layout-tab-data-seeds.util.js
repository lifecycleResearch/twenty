"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPageLayoutTabDataSeeds", {
    enumerable: true,
    get: function() {
        return getPageLayoutTabDataSeeds;
    }
});
const _uuid = require("uuid");
const _pagelayoutseedsconstant = require("../constants/page-layout-seeds.constant");
const _pagelayouttabseedsconstant = require("../constants/page-layout-tab-seeds.constant");
const _generateseedidutil = require("./generate-seed-id.util");
const getPageLayoutTabDataSeeds = ({ applicationId, workspaceId })=>[
        {
            id: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayouttabseedsconstant.PAGE_LAYOUT_TAB_SEEDS.SALES_OVERVIEW),
            title: 'Overview',
            position: 0,
            pageLayoutId: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayoutseedsconstant.PAGE_LAYOUT_SEEDS.SALES_DASHBOARD),
            workspaceId,
            universalIdentifier: (0, _uuid.v4)(),
            applicationId,
            overrides: null
        },
        {
            id: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayouttabseedsconstant.PAGE_LAYOUT_TAB_SEEDS.SALES_DETAILS),
            title: 'Details',
            position: 1,
            pageLayoutId: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayoutseedsconstant.PAGE_LAYOUT_SEEDS.SALES_DASHBOARD),
            workspaceId,
            universalIdentifier: (0, _uuid.v4)(),
            applicationId,
            overrides: null
        },
        {
            id: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayouttabseedsconstant.PAGE_LAYOUT_TAB_SEEDS.CUSTOMER_OVERVIEW),
            title: 'Overview',
            position: 0,
            pageLayoutId: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayoutseedsconstant.PAGE_LAYOUT_SEEDS.CUSTOMER_DASHBOARD),
            workspaceId,
            universalIdentifier: (0, _uuid.v4)(),
            applicationId,
            overrides: null
        },
        {
            id: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayouttabseedsconstant.PAGE_LAYOUT_TAB_SEEDS.CUSTOMER_ANALYTICS),
            title: 'Analytics',
            position: 1,
            pageLayoutId: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayoutseedsconstant.PAGE_LAYOUT_SEEDS.CUSTOMER_DASHBOARD),
            workspaceId,
            universalIdentifier: (0, _uuid.v4)(),
            applicationId,
            overrides: null
        },
        {
            id: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayouttabseedsconstant.PAGE_LAYOUT_TAB_SEEDS.TEAM_OVERVIEW),
            title: 'Team & People',
            position: 0,
            pageLayoutId: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayoutseedsconstant.PAGE_LAYOUT_SEEDS.TEAM_DASHBOARD),
            workspaceId,
            universalIdentifier: (0, _uuid.v4)(),
            applicationId,
            overrides: null
        },
        {
            id: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayouttabseedsconstant.PAGE_LAYOUT_TAB_SEEDS.TEAM_METRICS),
            title: 'Tasks & Activity',
            position: 1,
            pageLayoutId: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayoutseedsconstant.PAGE_LAYOUT_SEEDS.TEAM_DASHBOARD),
            workspaceId,
            universalIdentifier: (0, _uuid.v4)(),
            applicationId,
            overrides: null
        }
    ];

//# sourceMappingURL=get-page-layout-tab-data-seeds.util.js.map