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
    get computeFlatIndexFieldColumnNames () {
        return computeFlatIndexFieldColumnNames;
    },
    get createIndexInWorkspaceSchema () {
        return createIndexInWorkspaceSchema;
    },
    get deleteIndexMetadata () {
        return deleteIndexMetadata;
    },
    get dropIndexFromWorkspaceSchema () {
        return dropIndexFromWorkspaceSchema;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _computecolumnnameutil = require("../../../../../../metadata-modules/field-metadata/utils/compute-column-name.util");
const _iscompositefieldmetadatatypeutil = require("../../../../../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const _flatentitymapsexception = require("../../../../../../metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _ismorphorrelationflatfieldmetadatautil = require("../../../../../../metadata-modules/flat-field-metadata/utils/is-morph-or-relation-flat-field-metadata.util");
const _indexmetadataentity = require("../../../../../../metadata-modules/index-metadata/index-metadata.entity");
const _getworkspaceschemacontextformigrationutil = require("../../../utils/get-workspace-schema-context-for-migration.util");
const computeFlatIndexFieldColumnNames = ({ flatIndexFieldMetadatas, flatFieldMetadataMaps })=>{
    return flatIndexFieldMetadatas.flatMap(({ fieldMetadataId })=>{
        const flatFieldMetadata = (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: fieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!(0, _utils.isDefined)(flatFieldMetadata)) {
            throw new _flatentitymapsexception.FlatEntityMapsException('Index field related field metadata not found', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
        }
        if ((0, _ismorphorrelationflatfieldmetadatautil.isMorphOrRelationFlatFieldMetadata)(flatFieldMetadata)) {
            if (!(0, _utils.isDefined)(flatFieldMetadata.settings?.joinColumnName)) {
                throw new _flatentitymapsexception.FlatEntityMapsException('Join column name is not defined for relation field', _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
            }
            return flatFieldMetadata.settings.joinColumnName;
        }
        if ((0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(flatFieldMetadata.type)) {
            const compositeType = _types.compositeTypeDefinitions.get(flatFieldMetadata.type);
            if (!compositeType) {
                throw new _flatentitymapsexception.FlatEntityMapsException('Composite type not found', _flatentitymapsexception.FlatEntityMapsExceptionCode.INTERNAL_SERVER_ERROR);
            }
            const uniqueCompositeProperties = compositeType.properties.filter((property)=>property.isIncludedInUniqueConstraint);
            return uniqueCompositeProperties.map((subField)=>(0, _computecolumnnameutil.computeCompositeColumnName)(flatFieldMetadata.name, subField));
        }
        return flatFieldMetadata.name;
    });
};
const deleteIndexMetadata = async ({ entityId, queryRunner, workspaceId })=>{
    const indexMetadataRepository = queryRunner.manager.getRepository(_indexmetadataentity.IndexMetadataEntity);
    await indexMetadataRepository.delete({
        id: entityId,
        workspaceId
    });
};
const createIndexInWorkspaceSchema = async ({ flatIndexMetadata, flatObjectMetadata, flatFieldMetadataMaps, workspaceSchemaManagerService, queryRunner, workspaceId })=>{
    const { schemaName, tableName } = (0, _getworkspaceschemacontextformigrationutil.getWorkspaceSchemaContextForMigration)({
        workspaceId,
        objectMetadata: flatObjectMetadata
    });
    const columns = computeFlatIndexFieldColumnNames({
        flatIndexFieldMetadatas: flatIndexMetadata.flatIndexFieldMetadatas,
        flatFieldMetadataMaps
    });
    await workspaceSchemaManagerService.indexManager.createIndex({
        index: {
            columns,
            name: flatIndexMetadata.name,
            isUnique: flatIndexMetadata.isUnique,
            type: flatIndexMetadata.indexType,
            where: flatIndexMetadata.indexWhereClause ?? undefined
        },
        queryRunner,
        schemaName,
        tableName
    });
};
const dropIndexFromWorkspaceSchema = async ({ indexName, workspaceSchemaManagerService, queryRunner, schemaName })=>{
    await workspaceSchemaManagerService.indexManager.dropIndex({
        indexName,
        queryRunner,
        schemaName
    });
};

//# sourceMappingURL=index-action-handler.utils.js.map