"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_CALENDAR_CHANNEL_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_CALENDAR_CHANNEL_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _pagelayouttypeenum = require("../../../../metadata-modules/page-layout/enums/page-layout-type.enum");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const CALENDAR_CHANNEL_PAGE_TABS = {
    home: {
        universalIdentifier: '20202020-ab0a-400a-800a-ca1c4a0a0a01',
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: '20202020-ac0a-400a-800a-ca1c4a0a0a11',
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            }
        }
    },
    timeline: {
        universalIdentifier: '20202020-ab0a-400a-800a-ca1c4a0a0a02',
        ..._standardpagelayouttabstemplate.TAB_PROPS.timeline,
        widgets: {
            timeline: {
                universalIdentifier: '20202020-ac0a-400a-800a-ca1c4a0a0a21',
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.timeline
            }
        }
    }
};
const STANDARD_CALENDAR_CHANNEL_PAGE_LAYOUT_CONFIG = {
    name: 'Default Calendar Channel Layout',
    type: _pagelayouttypeenum.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarChannel.universalIdentifier,
    universalIdentifier: '20202020-a10a-400a-800a-ca1c4a0a0001',
    defaultTabUniversalIdentifier: null,
    tabs: CALENDAR_CHANNEL_PAGE_TABS
};

//# sourceMappingURL=standard-calendar-channel-page-layout.config.js.map