"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseMetadataPath", {
    enumerable: true,
    get: function() {
        return parseMetadataPath;
    }
});
const _common = require("@nestjs/common");
const getObjectNames = (objectName)=>{
    return {
        objectNameSingular: objectName.substring(0, objectName.length - 1),
        objectNamePlural: objectName
    };
};
const parseMetadataPath = (path)=>{
    const queryAction = path.replace('/rest/metadata/', '').split('/');
    if (queryAction.length >= 3 || queryAction.length === 0) {
        throw new _common.BadRequestException(`Query path '${path}' invalid. Valid examples: /rest/metadata/fields or /rest/metadata/objects/id`);
    }
    if (![
        'fields',
        'objects'
    ].includes(queryAction[0])) {
        throw new _common.BadRequestException(`Query path '${path}' invalid. Metadata path "${queryAction[0]}" does not exist. Valid examples: /rest/metadata/fields or /rest/metadata/objects`);
    }
    const hasId = queryAction.length === 2;
    const { objectNameSingular, objectNamePlural } = getObjectNames(queryAction[0]);
    return {
        objectNameSingular,
        objectNamePlural,
        ...hasId ? {
            id: queryAction[1]
        } : {}
    };
};

//# sourceMappingURL=parse-metadata-path.utils.js.map