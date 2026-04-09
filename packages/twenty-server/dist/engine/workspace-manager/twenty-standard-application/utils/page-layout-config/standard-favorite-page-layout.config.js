"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_FAVORITE_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_FAVORITE_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _pagelayouttypeenum = require("../../../../metadata-modules/page-layout/enums/page-layout-type.enum");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const FAVORITE_PAGE_TABS = {
    home: {
        universalIdentifier: '20202020-ab0e-400e-800e-fa0e0b1e0e01',
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: '20202020-ac0e-400e-800e-fa0e0b1e0e11',
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            }
        }
    },
    timeline: {
        universalIdentifier: '20202020-ab0e-400e-800e-fa0e0b1e0e02',
        ..._standardpagelayouttabstemplate.TAB_PROPS.timeline,
        widgets: {
            timeline: {
                universalIdentifier: '20202020-ac0e-400e-800e-fa0e0b1e0e21',
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.timeline
            }
        }
    }
};
const STANDARD_FAVORITE_PAGE_LAYOUT_CONFIG = {
    name: 'Default Favorite Layout',
    type: _pagelayouttypeenum.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.favorite.universalIdentifier,
    universalIdentifier: '20202020-a10e-400e-800e-fa0e0b1e0001',
    defaultTabUniversalIdentifier: null,
    tabs: FAVORITE_PAGE_TABS
};

//# sourceMappingURL=standard-favorite-page-layout.config.js.map