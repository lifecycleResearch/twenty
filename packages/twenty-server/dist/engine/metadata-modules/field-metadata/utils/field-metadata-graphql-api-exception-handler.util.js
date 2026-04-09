"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fieldMetadataGraphqlApiExceptionHandler", {
    enumerable: true,
    get: function() {
        return fieldMetadataGraphqlApiExceptionHandler;
    }
});
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../../core-modules/graphql/utils/graphql-errors.util");
const _fieldmetadataexception = require("../field-metadata.exception");
const _invalidmetadataexception = require("../../utils/exceptions/invalid-metadata.exception");
const _workspacemigrationbuilderexception = require("../../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationbuilderexceptionformatter = require("../../../workspace-manager/workspace-migration/interceptors/workspace-migration-builder-exception-formatter");
const fieldMetadataGraphqlApiExceptionHandler = (error, i18n)=>{
    if (error instanceof _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException) {
        (0, _workspacemigrationbuilderexceptionformatter.workspaceMigrationBuilderExceptionFormatter)(error, i18n);
    }
    if (error instanceof _invalidmetadataexception.InvalidMetadataException) {
        throw new _graphqlerrorsutil.UserInputError(error);
    }
    if (error instanceof _fieldmetadataexception.FieldMetadataException) {
        switch(error.code){
            case _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_METADATA_NOT_FOUND:
                throw new _graphqlerrorsutil.NotFoundError(error);
            case _fieldmetadataexception.FieldMetadataExceptionCode.INVALID_FIELD_INPUT:
                throw new _graphqlerrorsutil.UserInputError(error);
            case _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_MUTATION_NOT_ALLOWED:
                throw new _graphqlerrorsutil.ForbiddenError(error);
            case _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_ALREADY_EXISTS:
                throw new _graphqlerrorsutil.ConflictError(error);
            case _fieldmetadataexception.FieldMetadataExceptionCode.OBJECT_METADATA_NOT_FOUND:
            case _fieldmetadataexception.FieldMetadataExceptionCode.APPLICATION_NOT_FOUND:
            case _fieldmetadataexception.FieldMetadataExceptionCode.INTERNAL_SERVER_ERROR:
            case _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_METADATA_RELATION_NOT_ENABLED:
            case _fieldmetadataexception.FieldMetadataExceptionCode.FIELD_METADATA_RELATION_MALFORMED:
            case _fieldmetadataexception.FieldMetadataExceptionCode.UNCOVERED_FIELD_METADATA_TYPE_VALIDATION:
            case _fieldmetadataexception.FieldMetadataExceptionCode.LABEL_IDENTIFIER_FIELD_METADATA_ID_NOT_FOUND:
            case _fieldmetadataexception.FieldMetadataExceptionCode.RESERVED_KEYWORD:
            case _fieldmetadataexception.FieldMetadataExceptionCode.NOT_AVAILABLE:
            case _fieldmetadataexception.FieldMetadataExceptionCode.NAME_NOT_SYNCED_WITH_LABEL:
                throw error;
            default:
                {
                    return (0, _utils.assertUnreachable)(error.code);
                }
        }
    }
    throw error;
};

//# sourceMappingURL=field-metadata-graphql-api-exception-handler.util.js.map