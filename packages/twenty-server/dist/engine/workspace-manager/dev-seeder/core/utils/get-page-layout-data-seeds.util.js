"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPageLayoutDataSeeds", {
    enumerable: true,
    get: function() {
        return getPageLayoutDataSeeds;
    }
});
const _uuid = require("uuid");
const _pagelayouttypeenum = require("../../../../metadata-modules/page-layout/enums/page-layout-type.enum");
const _pagelayoutseedsconstant = require("../constants/page-layout-seeds.constant");
const _generateseedidutil = require("./generate-seed-id.util");
const getPageLayoutDataSeeds = (workspaceId, applicationId)=>[
        {
            id: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayoutseedsconstant.PAGE_LAYOUT_SEEDS.SALES_DASHBOARD),
            name: 'Sales Dashboard Layout',
            type: _pagelayouttypeenum.PageLayoutType.DASHBOARD,
            objectMetadataId: null,
            workspaceId,
            universalIdentifier: (0, _uuid.v4)(),
            applicationId
        },
        {
            id: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayoutseedsconstant.PAGE_LAYOUT_SEEDS.CUSTOMER_DASHBOARD),
            name: 'Customer Dashboard Layout',
            type: _pagelayouttypeenum.PageLayoutType.DASHBOARD,
            objectMetadataId: null,
            workspaceId,
            universalIdentifier: (0, _uuid.v4)(),
            applicationId
        },
        {
            id: (0, _generateseedidutil.generateSeedId)(workspaceId, _pagelayoutseedsconstant.PAGE_LAYOUT_SEEDS.TEAM_DASHBOARD),
            name: 'Team Dashboard Layout',
            type: _pagelayouttypeenum.PageLayoutType.DASHBOARD,
            objectMetadataId: null,
            workspaceId,
            universalIdentifier: (0, _uuid.v4)(),
            applicationId
        }
    ];

//# sourceMappingURL=get-page-layout-data-seeds.util.js.map