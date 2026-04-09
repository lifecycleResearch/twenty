"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_FAVORITE_FOLDER_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_FAVORITE_FOLDER_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _pagelayouttypeenum = require("../../../../metadata-modules/page-layout/enums/page-layout-type.enum");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const FAVORITE_FOLDER_PAGE_TABS = {
    home: {
        universalIdentifier: '20202020-ab0f-400f-800f-fa0efd0f0f01',
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: '20202020-ac0f-400f-800f-fa0efd0f0f11',
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            }
        }
    },
    timeline: {
        universalIdentifier: '20202020-ab0f-400f-800f-fa0efd0f0f02',
        ..._standardpagelayouttabstemplate.TAB_PROPS.timeline,
        widgets: {
            timeline: {
                universalIdentifier: '20202020-ac0f-400f-800f-fa0efd0f0f21',
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.timeline
            }
        }
    }
};
const STANDARD_FAVORITE_FOLDER_PAGE_LAYOUT_CONFIG = {
    name: 'Default Favorite Folder Layout',
    type: _pagelayouttypeenum.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.favoriteFolder.universalIdentifier,
    universalIdentifier: '20202020-a10f-400f-800f-fa0efd0f0001',
    defaultTabUniversalIdentifier: null,
    tabs: FAVORITE_FOLDER_PAGE_TABS
};

//# sourceMappingURL=standard-favorite-folder-page-layout.config.js.map