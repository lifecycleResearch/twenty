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
    get MarketplaceAppDTO () {
        return MarketplaceAppDTO;
    },
    get MarketplaceAppDefaultRoleDTO () {
        return MarketplaceAppDefaultRoleDTO;
    },
    get MarketplaceAppFieldDTO () {
        return MarketplaceAppFieldDTO;
    },
    get MarketplaceAppFrontComponentDTO () {
        return MarketplaceAppFrontComponentDTO;
    },
    get MarketplaceAppLogicFunctionDTO () {
        return MarketplaceAppLogicFunctionDTO;
    },
    get MarketplaceAppObjectDTO () {
        return MarketplaceAppObjectDTO;
    },
    get MarketplaceAppRoleFieldPermissionDTO () {
        return MarketplaceAppRoleFieldPermissionDTO;
    },
    get MarketplaceAppRoleObjectPermissionDTO () {
        return MarketplaceAppRoleObjectPermissionDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MarketplaceAppFieldDTO = class MarketplaceAppFieldDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppFieldDTO.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppFieldDTO.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppFieldDTO.prototype, "label", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppFieldDTO.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppFieldDTO.prototype, "icon", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppFieldDTO.prototype, "objectUniversalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppFieldDTO.prototype, "universalIdentifier", void 0);
MarketplaceAppFieldDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceAppField')
], MarketplaceAppFieldDTO);
let MarketplaceAppObjectDTO = class MarketplaceAppObjectDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppObjectDTO.prototype, "universalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppObjectDTO.prototype, "nameSingular", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppObjectDTO.prototype, "namePlural", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppObjectDTO.prototype, "labelSingular", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppObjectDTO.prototype, "labelPlural", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppObjectDTO.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppObjectDTO.prototype, "icon", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _graphql.Field)(()=>[
            MarketplaceAppFieldDTO
        ]),
    _ts_metadata("design:type", Array)
], MarketplaceAppObjectDTO.prototype, "fields", void 0);
MarketplaceAppObjectDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceAppObject')
], MarketplaceAppObjectDTO);
let MarketplaceAppLogicFunctionDTO = class MarketplaceAppLogicFunctionDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppLogicFunctionDTO.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppLogicFunctionDTO.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsNumber)(),
    (0, _graphql.Field)(()=>_graphql.Int, {
        nullable: true
    }),
    _ts_metadata("design:type", Number)
], MarketplaceAppLogicFunctionDTO.prototype, "timeoutSeconds", void 0);
MarketplaceAppLogicFunctionDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceAppLogicFunction')
], MarketplaceAppLogicFunctionDTO);
let MarketplaceAppFrontComponentDTO = class MarketplaceAppFrontComponentDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppFrontComponentDTO.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppFrontComponentDTO.prototype, "description", void 0);
MarketplaceAppFrontComponentDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceAppFrontComponent')
], MarketplaceAppFrontComponentDTO);
let MarketplaceAppRoleObjectPermissionDTO = class MarketplaceAppRoleObjectPermissionDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "objectUniversalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "canReadObjectRecords", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "canUpdateObjectRecords", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "canSoftDeleteObjectRecords", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleObjectPermissionDTO.prototype, "canDestroyObjectRecords", void 0);
MarketplaceAppRoleObjectPermissionDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceAppRoleObjectPermission')
], MarketplaceAppRoleObjectPermissionDTO);
let MarketplaceAppRoleFieldPermissionDTO = class MarketplaceAppRoleFieldPermissionDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleFieldPermissionDTO.prototype, "objectUniversalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppRoleFieldPermissionDTO.prototype, "fieldUniversalIdentifier", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleFieldPermissionDTO.prototype, "canReadFieldValue", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppRoleFieldPermissionDTO.prototype, "canUpdateFieldValue", void 0);
MarketplaceAppRoleFieldPermissionDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceAppRoleFieldPermission')
], MarketplaceAppRoleFieldPermissionDTO);
let MarketplaceAppDefaultRoleDTO = class MarketplaceAppDefaultRoleDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppDefaultRoleDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppDefaultRoleDTO.prototype, "label", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppDefaultRoleDTO.prototype, "description", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppDefaultRoleDTO.prototype, "canReadAllObjectRecords", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppDefaultRoleDTO.prototype, "canUpdateAllObjectRecords", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppDefaultRoleDTO.prototype, "canSoftDeleteAllObjectRecords", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppDefaultRoleDTO.prototype, "canDestroyAllObjectRecords", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppDefaultRoleDTO.prototype, "canUpdateAllSettings", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppDefaultRoleDTO.prototype, "canAccessAllTools", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _graphql.Field)(()=>[
            MarketplaceAppRoleObjectPermissionDTO
        ]),
    _ts_metadata("design:type", Array)
], MarketplaceAppDefaultRoleDTO.prototype, "objectPermissions", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _graphql.Field)(()=>[
            MarketplaceAppRoleFieldPermissionDTO
        ]),
    _ts_metadata("design:type", Array)
], MarketplaceAppDefaultRoleDTO.prototype, "fieldPermissions", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _graphql.Field)(()=>[
            String
        ]),
    _ts_metadata("design:type", Array)
], MarketplaceAppDefaultRoleDTO.prototype, "permissionFlags", void 0);
MarketplaceAppDefaultRoleDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceAppDefaultRole')
], MarketplaceAppDefaultRoleDTO);
let MarketplaceAppDTO = class MarketplaceAppDTO {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    (0, _classvalidator.MaxLength)(160),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "icon", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "version", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "author", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "category", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "logo", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _graphql.Field)(()=>[
            String
        ]),
    _ts_metadata("design:type", Array)
], MarketplaceAppDTO.prototype, "screenshots", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "aboutDescription", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _graphql.Field)(()=>[
            String
        ]),
    _ts_metadata("design:type", Array)
], MarketplaceAppDTO.prototype, "providers", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "websiteUrl", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "termsUrl", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _graphql.Field)(()=>[
            MarketplaceAppObjectDTO
        ]),
    _ts_metadata("design:type", Array)
], MarketplaceAppDTO.prototype, "objects", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _graphql.Field)(()=>[
            MarketplaceAppFieldDTO
        ]),
    _ts_metadata("design:type", Array)
], MarketplaceAppDTO.prototype, "fields", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _graphql.Field)(()=>[
            MarketplaceAppLogicFunctionDTO
        ]),
    _ts_metadata("design:type", Array)
], MarketplaceAppDTO.prototype, "logicFunctions", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _graphql.Field)(()=>[
            MarketplaceAppFrontComponentDTO
        ]),
    _ts_metadata("design:type", Array)
], MarketplaceAppDTO.prototype, "frontComponents", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>MarketplaceAppDefaultRoleDTO),
    (0, _graphql.Field)(()=>MarketplaceAppDefaultRoleDTO, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof MarketplaceAppDefaultRoleDTO === "undefined" ? Object : MarketplaceAppDefaultRoleDTO)
], MarketplaceAppDTO.prototype, "defaultRole", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    (0, _graphql.Field)({
        nullable: true
    }),
    _ts_metadata("design:type", String)
], MarketplaceAppDTO.prototype, "sourcePackage", void 0);
_ts_decorate([
    (0, _classvalidator.IsBoolean)(),
    (0, _graphql.Field)(()=>Boolean),
    _ts_metadata("design:type", Boolean)
], MarketplaceAppDTO.prototype, "isFeatured", void 0);
MarketplaceAppDTO = _ts_decorate([
    (0, _graphql.ObjectType)('MarketplaceApp')
], MarketplaceAppDTO);

//# sourceMappingURL=marketplace-app.dto.js.map