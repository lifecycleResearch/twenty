"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_CONNECTED_ACCOUNT_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_CONNECTED_ACCOUNT_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _pagelayouttypeenum = require("../../../../metadata-modules/page-layout/enums/page-layout-type.enum");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const CONNECTED_ACCOUNT_PAGE_TABS = {
    home: {
        universalIdentifier: '20202020-ab0d-400d-800d-c0aec10d0d01',
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: '20202020-ac0d-400d-800d-c0aec10d0d11',
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            }
        }
    },
    timeline: {
        universalIdentifier: '20202020-ab0d-400d-800d-c0aec10d0d02',
        ..._standardpagelayouttabstemplate.TAB_PROPS.timeline,
        widgets: {
            timeline: {
                universalIdentifier: '20202020-ac0d-400d-800d-c0aec10d0d21',
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.timeline
            }
        }
    }
};
const STANDARD_CONNECTED_ACCOUNT_PAGE_LAYOUT_CONFIG = {
    name: 'Default Connected Account Layout',
    type: _pagelayouttypeenum.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.connectedAccount.universalIdentifier,
    universalIdentifier: '20202020-a10d-400d-800d-c0aec10d0001',
    defaultTabUniversalIdentifier: null,
    tabs: CONNECTED_ACCOUNT_PAGE_TABS
};

//# sourceMappingURL=standard-connected-account-page-layout.config.js.map