"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardFavoriteViewFields", {
    enumerable: true,
    get: function() {
        return computeStandardFavoriteViewFields;
    }
});
const _createstandardviewfieldflatmetadatautil = require("./create-standard-view-field-flat-metadata.util");
const computeStandardFavoriteViewFields = (args)=>{
    return {
        allFavoritesForWorkspaceMember: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'allFavorites',
                viewFieldName: 'forWorkspaceMember',
                fieldName: 'forWorkspaceMember',
                position: 0,
                isVisible: true,
                size: 150
            }
        }),
        allFavoritesPerson: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'allFavorites',
                viewFieldName: 'person',
                fieldName: 'person',
                position: 1,
                isVisible: true,
                size: 150
            }
        }),
        allFavoritesCompany: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'allFavorites',
                viewFieldName: 'company',
                fieldName: 'company',
                position: 2,
                isVisible: true,
                size: 150
            }
        }),
        allFavoritesOpportunity: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'allFavorites',
                viewFieldName: 'opportunity',
                fieldName: 'opportunity',
                position: 3,
                isVisible: true,
                size: 150
            }
        }),
        allFavoritesTask: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'allFavorites',
                viewFieldName: 'task',
                fieldName: 'task',
                position: 4,
                isVisible: true,
                size: 150
            }
        }),
        allFavoritesNote: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'allFavorites',
                viewFieldName: 'note',
                fieldName: 'note',
                position: 5,
                isVisible: true,
                size: 150
            }
        }),
        allFavoritesDashboard: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'allFavorites',
                viewFieldName: 'dashboard',
                fieldName: 'dashboard',
                position: 6,
                isVisible: true,
                size: 150
            }
        }),
        allFavoritesFavoriteFolder: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'allFavorites',
                viewFieldName: 'favoriteFolder',
                fieldName: 'favoriteFolder',
                position: 7,
                isVisible: true,
                size: 150
            }
        }),
        allFavoritesCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'allFavorites',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 8,
                isVisible: true,
                size: 150
            }
        }),
        favoriteRecordPageFieldsForWorkspaceMember: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'favoriteRecordPageFields',
                viewFieldName: 'forWorkspaceMember',
                fieldName: 'forWorkspaceMember',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        favoriteRecordPageFieldsPerson: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'favoriteRecordPageFields',
                viewFieldName: 'person',
                fieldName: 'person',
                position: 1,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        favoriteRecordPageFieldsCompany: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'favoriteRecordPageFields',
                viewFieldName: 'company',
                fieldName: 'company',
                position: 2,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        favoriteRecordPageFieldsOpportunity: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'favoriteRecordPageFields',
                viewFieldName: 'opportunity',
                fieldName: 'opportunity',
                position: 3,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        favoriteRecordPageFieldsTask: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'favoriteRecordPageFields',
                viewFieldName: 'task',
                fieldName: 'task',
                position: 4,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        favoriteRecordPageFieldsNote: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'favoriteRecordPageFields',
                viewFieldName: 'note',
                fieldName: 'note',
                position: 5,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        favoriteRecordPageFieldsDashboard: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'favoriteRecordPageFields',
                viewFieldName: 'dashboard',
                fieldName: 'dashboard',
                position: 6,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        favoriteRecordPageFieldsFavoriteFolder: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'favoriteRecordPageFields',
                viewFieldName: 'favoriteFolder',
                fieldName: 'favoriteFolder',
                position: 7,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'general'
            }
        }),
        favoriteRecordPageFieldsCreatedAt: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'favoriteRecordPageFields',
                viewFieldName: 'createdAt',
                fieldName: 'createdAt',
                position: 0,
                isVisible: true,
                size: 150,
                viewFieldGroupName: 'other'
            }
        }),
        favoriteRecordPageFieldsCreatedBy: (0, _createstandardviewfieldflatmetadatautil.createStandardViewFieldFlatMetadata)({
            ...args,
            objectName: 'favorite',
            context: {
                viewName: 'favoriteRecordPageFields',
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

//# sourceMappingURL=compute-standard-favorite-view-fields.util.js.map