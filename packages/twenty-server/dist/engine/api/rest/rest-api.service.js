"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get GraphqlApiType () {
        return GraphqlApiType;
    },
    get RestApiService () {
        return RestApiService;
    }
});
const _common = require("@nestjs/common");
const _RestApiException = require("./errors/RestApiException");
const _securehttpclientservice = require("../../core-modules/secure-http-client/secure-http-client.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var GraphqlApiType = /*#__PURE__*/ function(GraphqlApiType) {
    GraphqlApiType["CORE"] = "core";
    GraphqlApiType["METADATA"] = "metadata";
    return GraphqlApiType;
}({});
let RestApiService = class RestApiService {
    async call(graphqlApiType, requestContext, data) {
        let response;
        const url = `${requestContext.baseUrl}/${graphqlApiType === "core" ? 'graphql' : "metadata"}`;
        // Internal request to the server's own GraphQL endpoint
        const httpClient = this.secureHttpClientService.getInternalHttpClient();
        try {
            response = await httpClient.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: requestContext.headers.authorization
                }
            });
        } catch (err) {
            throw new _RestApiException.RestApiException(err.response.data.errors);
        }
        if (response.data.errors?.length) {
            throw new _RestApiException.RestApiException(response.data.errors);
        }
        return response;
    }
    constructor(secureHttpClientService){
        this.secureHttpClientService = secureHttpClientService;
    }
};
RestApiService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _securehttpclientservice.SecureHttpClientService === "undefined" ? Object : _securehttpclientservice.SecureHttpClientService
    ])
], RestApiService);

//# sourceMappingURL=rest-api.service.js.map