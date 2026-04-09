"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FieldMetadataGraphqlApiExceptionInterceptor", {
    enumerable: true,
    get: function() {
        return FieldMetadataGraphqlApiExceptionInterceptor;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _rxjs = require("rxjs");
const _translations = require("twenty-shared/translations");
const _i18nservice = require("../../../core-modules/i18n/i18n.service");
const _fieldmetadatagraphqlapiexceptionhandlerutil = require("../utils/field-metadata-graphql-api-exception-handler.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FieldMetadataGraphqlApiExceptionInterceptor = class FieldMetadataGraphqlApiExceptionInterceptor {
    // oxlint-disable-next-line @typescripttypescript/no-explicit-any
    intercept(context, next) {
        const gqlContext = _graphql.GqlExecutionContext.create(context);
        const ctx = gqlContext.getContext();
        const locale = ctx.req?.locale ?? _translations.SOURCE_LOCALE;
        const i18n = this.i18nService.getI18nInstance(locale);
        return next.handle().pipe((0, _rxjs.catchError)((err)=>(0, _fieldmetadatagraphqlapiexceptionhandlerutil.fieldMetadataGraphqlApiExceptionHandler)(err, i18n)));
    }
    constructor(i18nService){
        this.i18nService = i18nService;
    }
};
FieldMetadataGraphqlApiExceptionInterceptor = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService
    ])
], FieldMetadataGraphqlApiExceptionInterceptor);

//# sourceMappingURL=field-metadata-graphql-api-exception.interceptor.js.map