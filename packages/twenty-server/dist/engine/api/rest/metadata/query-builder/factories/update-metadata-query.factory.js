"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdateMetadataQueryFactory", {
    enumerable: true,
    get: function() {
        return UpdateMetadataQueryFactory;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _fetchmetadatafieldsutils = require("../utils/fetch-metadata-fields.utils");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UpdateMetadataQueryFactory = class UpdateMetadataQueryFactory {
    create(objectNameSingular, objectNamePlural, selectors) {
        const objectNameCapitalized = (0, _utils.capitalize)(objectNameSingular);
        const fields = (0, _fetchmetadatafieldsutils.fetchMetadataFields)(objectNamePlural, selectors);
        return `
      mutation Update${objectNameCapitalized}($input: UpdateOne${objectNameCapitalized}${objectNameSingular === 'field' ? 'Metadata' : ''}Input!) {
        updateOne${objectNameCapitalized}(input: $input) {
          id
          ${fields}
        }
      }
    `;
    }
};
UpdateMetadataQueryFactory = _ts_decorate([
    (0, _common.Injectable)()
], UpdateMetadataQueryFactory);

//# sourceMappingURL=update-metadata-query.factory.js.map