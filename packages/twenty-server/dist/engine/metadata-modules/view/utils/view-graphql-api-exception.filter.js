"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ViewGraphqlApiExceptionFilter", {
    enumerable: true,
    get: function() {
        return ViewGraphqlApiExceptionFilter;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _translations = require("twenty-shared/translations");
const _i18nservice = require("../../../core-modules/i18n/i18n.service");
const _viewfieldexception = require("../../view-field/exceptions/view-field.exception");
const _viewfiltergroupexception = require("../../view-filter-group/exceptions/view-filter-group.exception");
const _viewfilterexception = require("../../view-filter/exceptions/view-filter.exception");
const _viewgroupexception = require("../../view-group/exceptions/view-group.exception");
const _viewsortexception = require("../../view-sort/exceptions/view-sort.exception");
const _viewexception = require("../exceptions/view.exception");
const _viewgraphqlapiexceptionhandlerutil = require("./view-graphql-api-exception-handler.util");
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
let ViewGraphqlApiExceptionFilter = class ViewGraphqlApiExceptionFilter {
    catch(exception, host) {
        const gqlContext = _graphql.GqlExecutionContext.create(host);
        const ctx = gqlContext.getContext();
        const userLocale = ctx.req?.locale ?? _translations.SOURCE_LOCALE;
        const i18n = this.i18nService.getI18nInstance(userLocale);
        return (0, _viewgraphqlapiexceptionhandlerutil.viewGraphqlApiExceptionHandler)(exception, i18n);
    }
    constructor(i18nService){
        this.i18nService = i18nService;
    }
};
ViewGraphqlApiExceptionFilter = _ts_decorate([
    (0, _common.Catch)(_viewexception.ViewException, _viewfieldexception.ViewFieldException, _viewfilterexception.ViewFilterException, _viewfiltergroupexception.ViewFilterGroupException, _viewgroupexception.ViewGroupException, _viewsortexception.ViewSortException, _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException),
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService
    ])
], ViewGraphqlApiExceptionFilter);

//# sourceMappingURL=view-graphql-api-exception.filter.js.map