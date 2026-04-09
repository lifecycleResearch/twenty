"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RestApiMetadataController", {
    enumerable: true,
    get: function() {
        return RestApiMetadataController;
    }
});
const _common = require("@nestjs/common");
const _express = require("express");
const _constants = require("twenty-shared/constants");
const _restapimetadataservice = require("./rest-api-metadata.service");
const _cleangraphqlresponseutils = require("../utils/clean-graphql-response.utils");
const _jwtauthguard = require("../../../guards/jwt-auth.guard");
const _settingspermissionguard = require("../../../guards/settings-permission.guard");
const _workspaceauthguard = require("../../../guards/workspace-auth.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let RestApiMetadataController = class RestApiMetadataController {
    async handleApiGet(request, res) {
        const result = await this.restApiMetadataService.get(request);
        res.status(200).send((0, _cleangraphqlresponseutils.cleanGraphQLResponse)(result.data.data));
    }
    async handleApiDelete(request, res) {
        const result = await this.restApiMetadataService.delete(request);
        res.status(200).send((0, _cleangraphqlresponseutils.cleanGraphQLResponse)(result.data.data));
    }
    async handleApiPost(request, res) {
        const result = await this.restApiMetadataService.create(request);
        res.status(201).send((0, _cleangraphqlresponseutils.cleanGraphQLResponse)(result.data.data));
    }
    async handleApiPatch(request, res) {
        const result = await this.restApiMetadataService.update(request);
        res.status(200).send((0, _cleangraphqlresponseutils.cleanGraphQLResponse)(result.data.data));
    }
    // This endpoint is not documented in the OpenAPI schema.
    // We keep it to avoid a breaking change since it initially used PUT instead of PATCH,
    // and because the PUT verb is often used as a PATCH.
    async handleApiPut(request, res) {
        const result = await this.restApiMetadataService.update(request);
        res.status(200).send((0, _cleangraphqlresponseutils.cleanGraphQLResponse)(result.data.data));
    }
    constructor(restApiMetadataService){
        this.restApiMetadataService = restApiMetadataService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], RestApiMetadataController.prototype, "handleApiGet", null);
_ts_decorate([
    (0, _common.Delete)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], RestApiMetadataController.prototype, "handleApiDelete", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], RestApiMetadataController.prototype, "handleApiPost", null);
_ts_decorate([
    (0, _common.Patch)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], RestApiMetadataController.prototype, "handleApiPatch", null);
_ts_decorate([
    (0, _common.Put)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Res)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _express.Request === "undefined" ? Object : _express.Request,
        typeof _express.Response === "undefined" ? Object : _express.Response
    ]),
    _ts_metadata("design:returntype", Promise)
], RestApiMetadataController.prototype, "handleApiPut", null);
RestApiMetadataController = _ts_decorate([
    (0, _common.Controller)('rest/metadata/*path'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _workspaceauthguard.WorkspaceAuthGuard, (0, _settingspermissionguard.SettingsPermissionGuard)(_constants.PermissionFlagType.DATA_MODEL)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _restapimetadataservice.RestApiMetadataService === "undefined" ? Object : _restapimetadataservice.RestApiMetadataService
    ])
], RestApiMetadataController);

//# sourceMappingURL=rest-api-metadata.controller.js.map