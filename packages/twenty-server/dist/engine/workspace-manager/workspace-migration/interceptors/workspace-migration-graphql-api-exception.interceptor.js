"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMigrationGraphqlApiExceptionInterceptor", {
    enumerable: true,
    get: function() {
        return WorkspaceMigrationGraphqlApiExceptionInterceptor;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _rxjs = require("rxjs");
const _translations = require("twenty-shared/translations");
const _i18nservice = require("../../../core-modules/i18n/i18n.service");
const _graphqlerrorsutil = require("../../../core-modules/graphql/utils/graphql-errors.util");
const _flatentitymapsexception = require("../../../metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const _workspacemigrationbuilderexception = require("../exceptions/workspace-migration-builder-exception");
const _workspacemigrationbuilderexceptionformatter = require("./workspace-migration-builder-exception-formatter");
const _workspacemigrationrunnerexceptionformatter = require("./workspace-migration-runner-exception-formatter");
const _workspacemigrationrunnerexception = require("../workspace-migration-runner/exceptions/workspace-migration-runner.exception");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkspaceMigrationGraphqlApiExceptionInterceptor = class WorkspaceMigrationGraphqlApiExceptionInterceptor {
    intercept(context, next) {
        const gqlContext = _graphql.GqlExecutionContext.create(context);
        const ctx = gqlContext.getContext();
        const locale = ctx.req?.locale ?? _translations.SOURCE_LOCALE;
        const i18n = this.i18nService.getI18nInstance(locale);
        return next.handle().pipe((0, _rxjs.catchError)((error)=>{
            if (error instanceof _flatentitymapsexception.FlatEntityMapsException) {
                switch(error.code){
                    case _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND:
                        throw new _graphqlerrorsutil.NotFoundError(error);
                    case _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_ALREADY_EXISTS:
                    case _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_MALFORMED:
                    case _flatentitymapsexception.FlatEntityMapsExceptionCode.INTERNAL_SERVER_ERROR:
                        throw error;
                }
            }
            if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
                (0, _workspacemigrationbuilderexceptionformatter.workspaceMigrationBuilderExceptionFormatter)(error, i18n);
            }
            if (error instanceof _workspacemigrationrunnerexception.WorkspaceMigrationRunnerException) {
                (0, _workspacemigrationrunnerexceptionformatter.workspaceMigrationRunnerExceptionFormatter)(error);
            }
            throw error;
        }));
    }
    constructor(i18nService){
        this.i18nService = i18nService;
    }
};
WorkspaceMigrationGraphqlApiExceptionInterceptor = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService
    ])
], WorkspaceMigrationGraphqlApiExceptionInterceptor);

//# sourceMappingURL=workspace-migration-graphql-api-exception.interceptor.js.map