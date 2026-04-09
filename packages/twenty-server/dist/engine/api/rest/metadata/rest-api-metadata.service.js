"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RestApiMetadataService", {
    enumerable: true,
    get: function() {
        return RestApiMetadataService;
    }
});
const _common = require("@nestjs/common");
const _metadataquerybuilderfactory = require("./query-builder/metadata-query-builder.factory");
const _restapiservice = require("../rest-api.service");
const _accesstokenservice = require("../../../core-modules/auth/token/services/access-token.service");
const _twentyconfigservice = require("../../../core-modules/twenty-config/twenty-config.service");
const _getserverurl = require("../../../../utils/get-server-url");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RestApiMetadataService = class RestApiMetadataService {
    async get(request) {
        await this.accessTokenService.validateTokenByRequest(request);
        const requestContext = this.getRequestContext(request);
        const data = await this.metadataQueryBuilderFactory.get(requestContext, {
            fields: [
                '*'
            ]
        });
        return await this.restApiService.call(_restapiservice.GraphqlApiType.METADATA, requestContext, data);
    }
    async create(request) {
        await this.accessTokenService.validateTokenByRequest(request);
        const requestContext = this.getRequestContext(request);
        const data = await this.metadataQueryBuilderFactory.create(requestContext, {
            fields: [
                '*'
            ]
        });
        return await this.restApiService.call(_restapiservice.GraphqlApiType.METADATA, requestContext, data);
    }
    async update(request) {
        await this.accessTokenService.validateTokenByRequest(request);
        const requestContext = this.getRequestContext(request);
        const data = await this.metadataQueryBuilderFactory.update(requestContext, {
            fields: [
                '*'
            ]
        });
        return await this.restApiService.call(_restapiservice.GraphqlApiType.METADATA, requestContext, data);
    }
    async delete(request) {
        await this.accessTokenService.validateTokenByRequest(request);
        const requestContext = this.getRequestContext(request);
        const data = await this.metadataQueryBuilderFactory.delete(requestContext);
        return await this.restApiService.call(_restapiservice.GraphqlApiType.METADATA, requestContext, data);
    }
    getRequestContext(request) {
        const baseUrl = (0, _getserverurl.getServerUrl)({
            serverUrlEnv: this.twentyConfigService.get('SERVER_URL'),
            serverUrlFallback: `${request.protocol}://${request.get('host')}`
        });
        return {
            body: request.body,
            baseUrl: baseUrl,
            path: request.url,
            headers: request.headers
        };
    }
    constructor(accessTokenService, metadataQueryBuilderFactory, restApiService, twentyConfigService){
        this.accessTokenService = accessTokenService;
        this.metadataQueryBuilderFactory = metadataQueryBuilderFactory;
        this.restApiService = restApiService;
        this.twentyConfigService = twentyConfigService;
    }
};
RestApiMetadataService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _accesstokenservice.AccessTokenService === "undefined" ? Object : _accesstokenservice.AccessTokenService,
        typeof _metadataquerybuilderfactory.MetadataQueryBuilderFactory === "undefined" ? Object : _metadataquerybuilderfactory.MetadataQueryBuilderFactory,
        typeof _restapiservice.RestApiService === "undefined" ? Object : _restapiservice.RestApiService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], RestApiMetadataService);

//# sourceMappingURL=rest-api-metadata.service.js.map