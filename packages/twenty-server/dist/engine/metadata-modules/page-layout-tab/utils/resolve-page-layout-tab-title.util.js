"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolvePageLayoutTabTitle", {
    enumerable: true,
    get: function() {
        return resolvePageLayoutTabTitle;
    }
});
const _generateMessageId = require("../../../core-modules/i18n/utils/generateMessageId");
const _twentystandardapplications = require("../../../workspace-manager/twenty-standard-application/constants/twenty-standard-applications");
const resolvePageLayoutTabTitle = ({ title, applicationId, i18nInstance })=>{
    if (applicationId !== _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier) {
        return title;
    }
    const messageId = (0, _generateMessageId.generateMessageId)(title);
    const translatedMessage = i18nInstance._(messageId);
    if (translatedMessage === messageId) {
        return title;
    }
    return translatedMessage;
};

//# sourceMappingURL=resolve-page-layout-tab-title.util.js.map