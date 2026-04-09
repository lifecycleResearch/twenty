"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GetMetadataVariablesFactory", {
    enumerable: true,
    get: function() {
        return GetMetadataVariablesFactory;
    }
});
const _common = require("@nestjs/common");
const _parseendingbeforerestrequestutil = require("../../../input-request-parsers/ending-before-parser-utils/parse-ending-before-rest-request.util");
const _parselimitrestrequestutil = require("../../../input-request-parsers/limit-parser-utils/parse-limit-rest-request.util");
const _parsestartingafterrestrequestutil = require("../../../input-request-parsers/starting-after-parser-utils/parse-starting-after-rest-request.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let GetMetadataVariablesFactory = class GetMetadataVariablesFactory {
    create(id, requestContext) {
        if (id) {
            return {
                id
            };
        }
        const limit = (0, _parselimitrestrequestutil.parseLimitRestRequest)(requestContext, 1000);
        const before = (0, _parseendingbeforerestrequestutil.parseEndingBeforeRestRequest)(requestContext);
        const after = (0, _parsestartingafterrestrequestutil.parseStartingAfterRestRequest)(requestContext);
        if (before && after) {
            throw new _common.BadRequestException(`Only one of 'endingBefore' and 'startingAfter' may be provided`);
        }
        return {
            paging: {
                first: !before ? limit : undefined,
                last: before ? limit : undefined,
                after,
                before
            }
        };
    }
};
GetMetadataVariablesFactory = _ts_decorate([
    (0, _common.Injectable)()
], GetMetadataVariablesFactory);

//# sourceMappingURL=get-metadata-variables.factory.js.map