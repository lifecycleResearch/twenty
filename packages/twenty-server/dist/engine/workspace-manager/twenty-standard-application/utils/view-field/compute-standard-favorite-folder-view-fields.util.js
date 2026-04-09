"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardFavoriteFolderViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardFavoriteFolderViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardFavoriteFolderViewFields = (args)=>{
    return {
        allFavoriteFoldersName: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favoriteFolder',
            context: {
                viewName: 'allFavoriteFolders',
                viewFieldName: 'name',
                fieldName: 'name',
                position: 0,
                isVisible: true,
                size: 150
            }
        }),
        allFavoriteFoldersCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favoriteFolder',
            context: {
                viewName: 'allFavoriteFolders',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        favoriteFolderRecordPageFieldsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favoriteFolder',
            context: {
                viewName: 'favoriteFolderRecordPageFields',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        favoriteFolderRecordPageFieldsCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favoriteFolder',
            context: {
                viewName: 'favoriteFolderRecordPageFields',
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

//# sourceMappingURL=compute-standard-favorite-folder-view-fields.util.js.map