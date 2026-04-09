"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isFavoriteRelatedObject", {
    enumerable: true,
    get: function() {
        return isFavoriteRelatedObject;
    }
});
const _metadata = require("twenty-shared/metadata");
const FAVORITE_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS = [
    _metadata.STANDARD_OBJECTS.favorite.universalIdentifier,
    _metadata.STANDARD_OBJECTS.favoriteFolder.universalIdentifier
];
const isFavoriteRelatedObject = (objectMetadata)=>{
    return FAVORITE_STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.includes(objectMetadata.universalIdentifier);
};

//# sourceMappingURL=is-favorite-related-object.util.js.map