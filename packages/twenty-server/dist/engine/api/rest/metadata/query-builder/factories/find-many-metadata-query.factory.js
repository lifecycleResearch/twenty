"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FindManyMetadataQueryFactory", {
    enumerable: true,
    get: function() {
        return FindManyMetadataQueryFactory;
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
let FindManyMetadataQueryFactory = class FindManyMetadataQueryFactory {
    create(objectNamePlural, selectors) {
        const fields = (0, _fetchmetadatafieldsutils.fetchMetadataFields)(objectNamePlural, selectors);
        return `
      query FindMany${(0, _utils.capitalize)(objectNamePlural)}(
        $paging: CursorPaging!
      ) {
        ${objectNamePlural}(
          paging: $paging
        ) {
          edges {
            node {
              id
              ${fields}
            }
          }
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
        }
      }
    `;
    }
};
FindManyMetadataQueryFactory = _ts_decorate([
    (0, _common.Injectable)()
], FindManyMetadataQueryFactory);

//# sourceMappingURL=find-many-metadata-query.factory.js.map