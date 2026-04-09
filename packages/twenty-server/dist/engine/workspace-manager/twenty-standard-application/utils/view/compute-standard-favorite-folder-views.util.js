"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardFavoriteFolderViews", {
    enumerable: true,
    get: function() {
        return computeStandardFavoriteFolderViews;
    }
});
const _types = require("twenty-shared/types");
const _createstandardviewflatmetadatautil = require("./create-standard-view-flat-metadata.util");
const computeStandardFavoriteFolderViews = (args)=>{
    return {
        allFavoriteFolders: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'favoriteFolder',
            context: {
                viewName: 'allFavoriteFolders',
                name: 'All {objectLabelPlural}',
                type: _types.ViewType.TABLE,
                key: _types.ViewKey.INDEX,
                position: 0,
                icon: 'IconList'
            }
        }),
        favoriteFolderRecordPageFields: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'favoriteFolder',
            context: {
                viewName: 'favoriteFolderRecordPageFields',
                name: 'Favorite Folder Record Page Fields',
                type: _types.ViewType.FIELDS_WIDGET,
                key: null,
                position: 0,
                icon: 'IconList'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-favorite-folder-views.util.js.map