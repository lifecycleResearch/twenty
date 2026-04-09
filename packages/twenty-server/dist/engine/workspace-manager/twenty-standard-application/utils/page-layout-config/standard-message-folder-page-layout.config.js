"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_MESSAGE_FOLDER_PAGE_LAYOUT_CONFIG", {
    enumerable: true,
    get: function() {
        return STANDARD_MESSAGE_FOLDER_PAGE_LAYOUT_CONFIG;
    }
});
const _metadata = require("twenty-shared/metadata");
const _pagelayouttypeenum = require("../../../../metadata-modules/page-layout/enums/page-layout-type.enum");
const _standardpagelayouttabstemplate = require("../../constants/standard-page-layout-tabs.template");
const MESSAGE_FOLDER_PAGE_TABS = {
    home: {
        universalIdentifier: '20202020-ab13-4013-8013-a5efd1131301',
        ..._standardpagelayouttabstemplate.TAB_PROPS.home,
        widgets: {
            fields: {
                universalIdentifier: '20202020-ac13-4013-8013-a5efd1131311',
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.fields
            }
        }
    },
    timeline: {
        universalIdentifier: '20202020-ab13-4013-8013-a5efd1131302',
        ..._standardpagelayouttabstemplate.TAB_PROPS.timeline,
        widgets: {
            timeline: {
                universalIdentifier: '20202020-ac13-4013-8013-a5efd1131321',
                ..._standardpagelayouttabstemplate.WIDGET_PROPS.timeline
            }
        }
    }
};
const STANDARD_MESSAGE_FOLDER_PAGE_LAYOUT_CONFIG = {
    name: 'Default Message Folder Layout',
    type: _pagelayouttypeenum.PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageFolder.universalIdentifier,
    universalIdentifier: '20202020-a113-4013-8013-a5efd1130001',
    defaultTabUniversalIdentifier: null,
    tabs: MESSAGE_FOLDER_PAGE_TABS
};

//# sourceMappingURL=standard-message-folder-page-layout.config.js.map