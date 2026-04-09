"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewGroupGraphqlApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return ViewGroupGraphqlApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _translations = require("twenty-shared/translations");
const _i18nservice = require("../../../core-modules/i18n/i18n.service");
const _viewgroupexception = require("../exceptions/view-group.exception");
const _viewgroupgraphqlapiexceptionhandlerutil = require("./view-group-graphql-api-exception-handler.util");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ViewGroupGraphqlApiExceptionFilter = class ViewGroupGraphqlApiExceptionFilter {
    catch(exception, host) {
        const gqlContext = _graphql.GqlExecutionContext.create(host);
        const ctx = gqlContext.getContext();
        const userLocale = ctx.req?.locale ?? _translations.SOURCE_LOCALE;
        const i18n = this.i18nService.getI18nInstance(userLocale);
        return (0, _viewgroupgraphqlapiexceptionhandlerutil.viewGroupGraphqlApiExceptionHandler)(exception, i18n);
    }
    constructor(i18nService){
        this.i18nService = i18nService;
    }
};
ViewGroupGraphqlApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_viewgroupexception.ViewGroupException, _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException),
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService
    ])
], ViewGroupGraphqlApiExceptionFilter);

//# sourceMappingURL=view-group-graphql-api-exception.filter.js.map