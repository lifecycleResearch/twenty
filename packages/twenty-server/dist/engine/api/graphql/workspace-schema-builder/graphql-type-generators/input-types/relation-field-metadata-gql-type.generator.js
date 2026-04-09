"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RelationFieldMetadataGqlInputTypeGenerator", {
    enumerable: true,
    get: function() {
        return RelationFieldMetadataGqlInputTypeGenerator;
    }
});
const _common = require("@nestjs/common");
const _graphql = require("graphql");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _gqlinputtypedefinitionkindenum = require("../../enums/gql-input-type-definition-kind.enum");
const _typemapperservice = require("../../services/type-mapper.service");
const _gqltypesstorage = require("../../storages/gql-types.storage");
const _applytypeoptionsforcreateinpututil = require("../../utils/apply-type-options-for-create-input.util");
const _computeobjectmetadatainputtypeutil = require("../../utils/compute-stored-gql-type-key-utils/compute-object-metadata-input-type.util");
const _computerelationconnectinputtypekeyutil = require("../../utils/compute-stored-gql-type-key-utils/compute-relation-connect-input-type-key.util");
const _extractgraphqlrelationfieldnamesutil = require("../../utils/extract-graphql-relation-field-names.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RelationFieldMetadataGqlInputTypeGenerator = class RelationFieldMetadataGqlInputTypeGenerator {
    generateSimpleRelationFieldCreateOrUpdateInputType({ fieldMetadata, typeOptions }) {
        if (fieldMetadata.settings?.relationType === _types.RelationType.ONE_TO_MANY) return {};
        const { joinColumnName } = (0, _extractgraphqlrelationfieldnamesutil.extractGraphQLRelationFieldNames)(fieldMetadata);
        const type = this.typeMapperService.mapToPreBuiltGraphQLInputType({
            fieldMetadataType: fieldMetadata.type,
            typeOptions
        });
        if (!(0, _utils.isDefined)(type)) {
            const message = `Could not find a GraphQL input type for ${type} field metadata`;
            this.logger.error(message, {
                type,
                typeOptions
            });
            throw new Error(message);
        }
        const modifiedType = (0, _applytypeoptionsforcreateinpututil.applyTypeOptionsForCreateInput)(type, {
            ...typeOptions,
            nullable: true
        });
        return {
            [joinColumnName]: {
                type: modifiedType,
                description: fieldMetadata.description
            }
        };
    }
    generateSimpleRelationFieldFilterInputType({ fieldMetadata, typeOptions }) {
        if (fieldMetadata.settings?.relationType === _types.RelationType.ONE_TO_MANY) return {};
        const { joinColumnName } = (0, _extractgraphqlrelationfieldnamesutil.extractGraphQLRelationFieldNames)(fieldMetadata);
        const type = this.typeMapperService.mapToFilterType(fieldMetadata.type, typeOptions);
        if (!(0, _utils.isDefined)(type)) {
            const message = `Could not find a GraphQL input type for ${type} field metadata`;
            this.logger.error(message, {
                type,
                typeOptions
            });
            throw new Error(message);
        }
        return {
            [joinColumnName]: {
                type,
                description: fieldMetadata.description
            }
        };
    }
    generateSimpleRelationFieldOrderByInputType({ fieldMetadata, isForGroupBy, context }) {
        if (fieldMetadata.settings?.relationType === _types.RelationType.ONE_TO_MANY) return {};
        const { joinColumnName, fieldMetadataName } = (0, _extractgraphqlrelationfieldnamesutil.extractGraphQLRelationFieldNames)(fieldMetadata);
        const type = this.typeMapperService.mapToOrderByType(fieldMetadata.type);
        if (!(0, _utils.isDefined)(type)) {
            const message = `Could not find a GraphQL input type for ${type} field metadata`;
            this.logger.error(message, {
                type
            });
            throw new Error(message);
        }
        const fields = {
            [joinColumnName]: {
                type,
                description: fieldMetadata.description
            }
        };
        if ((0, _utils.isDefined)(fieldMetadata.relationTargetObjectMetadataId) && (0, _utils.isDefined)(context)) {
            const targetObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: fieldMetadata.relationTargetObjectMetadataId,
                flatEntityMaps: context.flatObjectMetadataMaps
            });
            if ((0, _utils.isDefined)(targetObjectMetadata)) {
                const targetOrderByInputTypeKey = (0, _computeobjectmetadatainputtypeutil.computeObjectMetadataInputTypeKey)(targetObjectMetadata.nameSingular, isForGroupBy ? _gqlinputtypedefinitionkindenum.GqlInputTypeDefinitionKind.OrderByWithGroupBy : _gqlinputtypedefinitionkindenum.GqlInputTypeDefinitionKind.OrderBy);
                const targetOrderByInputType = this.gqlTypesStorage.getGqlTypeByKey(targetOrderByInputTypeKey);
                if ((0, _utils.isDefined)(targetOrderByInputType) && (0, _graphql.isInputObjectType)(targetOrderByInputType)) {
                    fields[fieldMetadataName] = {
                        type: targetOrderByInputType,
                        description: `Order by fields of the related ${targetObjectMetadata.nameSingular}`
                    };
                }
            }
        }
        return fields;
    }
    generateSimpleRelationFieldGroupByInputType(fieldMetadata, context) {
        if (fieldMetadata.settings?.relationType === _types.RelationType.ONE_TO_MANY) return {};
        const { fieldMetadataName } = (0, _extractgraphqlrelationfieldnamesutil.extractGraphQLRelationFieldNames)(fieldMetadata);
        const fields = {};
        if ((0, _utils.isDefined)(fieldMetadata.relationTargetObjectMetadataId) && (0, _utils.isDefined)(context)) {
            const targetObjectMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
                flatEntityId: fieldMetadata.relationTargetObjectMetadataId,
                flatEntityMaps: context.flatObjectMetadataMaps
            });
            if ((0, _utils.isDefined)(targetObjectMetadata)) {
                const targetGroupByInputTypeKey = (0, _computeobjectmetadatainputtypeutil.computeObjectMetadataInputTypeKey)(targetObjectMetadata.nameSingular, _gqlinputtypedefinitionkindenum.GqlInputTypeDefinitionKind.GroupBy);
                const targetGroupByInputType = this.gqlTypesStorage.getGqlTypeByKey(targetGroupByInputTypeKey);
                if ((0, _utils.isDefined)(targetGroupByInputType) && (0, _graphql.isInputObjectType)(targetGroupByInputType)) {
                    fields[fieldMetadataName] = {
                        type: targetGroupByInputType,
                        description: `Group by fields of the related ${targetObjectMetadata.nameSingular}`
                    };
                }
            }
        }
        return fields;
    }
    generateConnectRelationFieldInputType({ fieldMetadata, typeOptions }) {
        if (fieldMetadata.settings?.relationType === _types.RelationType.ONE_TO_MANY) {
            return {};
        }
        const { fieldMetadataName } = (0, _extractgraphqlrelationfieldnamesutil.extractGraphQLRelationFieldNames)(fieldMetadata);
        if (!(0, _utils.isDefined)(fieldMetadata.relationTargetObjectMetadataId)) {
            throw new Error(`Target object metadata not found for field metadata ${fieldMetadata.id}`);
        }
        const key = (0, _computerelationconnectinputtypekeyutil.computeRelationConnectInputTypeKey)(fieldMetadata.relationTargetObjectMetadataId);
        const type = this.gqlTypesStorage.getGqlTypeByKey(key);
        if (!(0, _utils.isDefined)(type) || (0, _graphql.isObjectType)(type)) {
            throw new Error(`Input type ${key} not found`);
        }
        return {
            [fieldMetadataName]: {
                type: (0, _applytypeoptionsforcreateinpututil.applyTypeOptionsForCreateInput)(type, {
                    ...typeOptions,
                    nullable: true
                }),
                description: fieldMetadata.description
            }
        };
    }
    constructor(typeMapperService, gqlTypesStorage){
        this.typeMapperService = typeMapperService;
        this.gqlTypesStorage = gqlTypesStorage;
        this.logger = new _common.Logger(RelationFieldMetadataGqlInputTypeGenerator.name);
    }
};
RelationFieldMetadataGqlInputTypeGenerator = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typemapperservice.TypeMapperService === "undefined" ? Object : _typemapperservice.TypeMapperService,
        typeof _gqltypesstorage.GqlTypesStorage === "undefined" ? Object : _gqltypesstorage.GqlTypesStorage
    ])
], RelationFieldMetadataGqlInputTypeGenerator);

//# sourceMappingURL=relation-field-metadata-gql-type.generator.js.map