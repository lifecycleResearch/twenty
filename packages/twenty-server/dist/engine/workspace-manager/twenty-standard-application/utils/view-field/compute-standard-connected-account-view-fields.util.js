"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardConnectedAccountViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardConnectedAccountViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardConnectedAccountViewFields = (args)=>{
    return {
        allConnectedAccountsHandle: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'allConnectedAccounts',
                viewFieldName: 'handle',
                fieldName: 'handle',
                position: 0,
                isVisible: true,
                size: 150
            }
        }),
        allConnectedAccountsProvider: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'allConnectedAccounts',
                viewFieldName: 'provider',
                fieldName: 'provider',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        allConnectedAccountsAccountOwner: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'allConnectedAccounts',
                viewFieldName: 'accountOwner',
                fieldName: 'accountOwner',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        allConnectedAccountsAuthFailedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'allConnectedAccounts',
                viewFieldName: 'authFailedAt',
                fieldName: 'authFailedAt',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        allConnectedAccountsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'allConnectedAccounts',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 4,
                isVisible: true,
                size: 150
            }
        }),
        connectedAccountRecordPageFieldsProvider: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'connectedAccountRecordPageFields',
                viewFieldName: 'provider',
                fieldName: 'provider',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        connectedAccountRecordPageFieldsAccountOwner: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'connectedAccountRecordPageFields',
                viewFieldName: 'accountOwner',
                fieldName: 'accountOwner',
                position: 2,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        connectedAccountRecordPageFieldsAuthFailedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'connectedAccountRecordPageFields',
                viewFieldName: 'authFailedAt',
                fieldName: 'authFailedAt',
                position: 3,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        connectedAccountRecordPageFieldsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'connectedAccountRecordPageFields',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        connectedAccountRecordPageFieldsCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'connectedAccount',
            context: {
                viewName: 'connectedAccountRecordPageFields',
                viewFieldName: 'createdBy',
                fieldName: 'createdBy',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-connected-account-view-fields.util.js.map