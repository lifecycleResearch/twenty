"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IndexMetadataResolver", {
    enumerable: true,
    get: function() {
        return IndexMetadataResolver;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("@nestjs/graphql");
const _preventnesttoautologgraphqlerrorsfilter = require("../../core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter");
const _resolvervalidationpipe = require("../../core-modules/graphql/pipes/resolver-validation.pipe");
const _i18nservice = require("../../core-modules/i18n/i18n.service");
const _workspaceentity = require("../../core-modules/workspace/workspace.entity");
const _authworkspacedecorator = require("../../decorators/auth/auth-workspace.decorator");
const _metadataresolverdecorator = require("../../api/graphql/graphql-config/decorators/metadata-resolver.decorator");
const _workspaceauthguard = require("../../guards/workspace-auth.guard");
const _indexfieldmetadatadto = require("./dtos/index-field-metadata.dto");
const _indexmetadatadto = require("./dtos/index-metadata.dto");
const _objectmetadatagraphqlapiexceptionhandlerutil = require("../object-metadata/utils/object-metadata-graphql-api-exception-handler.util");
const _permissionsgraphqlapiexceptionfilter = require("../permissions/utils/permissions-graphql-api-exception.filter");
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
let IndexMetadataResolver = class IndexMetadataResolver {
    async indexFieldMetadataList(workspace, indexMetadata, context) {
        try {
            const indexFieldMetadataItems = await context.loaders.indexFieldMetadataLoader.load({
                objectMetadata: {
                    id: indexMetadata.objectMetadataId
                },
                indexMetadata,
                workspaceId: workspace.id
            });
            return indexFieldMetadataItems;
        } catch (error) {
            (0, _objectmetadatagraphqlapiexceptionhandlerutil.objectMetadataGraphqlApiExceptionHandler)(error, this.i18nService.getI18nInstance(context.req.locale));
            return [];
        }
    }
    constructor(i18nService){
        this.i18nService = i18nService;
    }
};
_ts_decorate([
    (0, _graphql.ResolveField)(()=>[
            _indexfieldmetadatadto.IndexFieldMetadataDTO
        ], {
        nullable: false
    }),
    _ts_param(0, (0, _authworkspacedecorator.AuthWorkspace)()),
    _ts_param(1, (0, _graphql.Parent)()),
    _ts_param(2, (0, _graphql.Context)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceentity.WorkspaceEntity === "undefined" ? Object : _workspaceentity.WorkspaceEntity,
        typeof _indexmetadatadto.IndexMetadataDTO === "undefined" ? Object : _indexmetadatadto.IndexMetadataDTO,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], IndexMetadataResolver.prototype, "indexFieldMetadataList", null);
IndexMetadataResolver = _ts_decorate([
    (0, _common.UseGuards)(_workspaceauthguard.WorkspaceAuthGuard),
    (0, _metadataresolverdecorator.MetadataResolver)(()=>_indexmetadatadto.IndexMetadataDTO),
    (0, _common.UsePipes)(_resolvervalidationpipe.ResolverValidationPipe),
    (0, _common.UseFilters)(_preventnesttoautologgraphqlerrorsfilter.PreventNestToAutoLogGraphqlErrorsFilter, _permissionsgraphqlapiexceptionfilter.PermissionsGraphqlApiExceptionFilter),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService
    ])
], IndexMetadataResolver);

//# sourceMappingURL=index-metadata.resolver.js.map