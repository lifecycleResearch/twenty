"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "workspaceMigrationBuilderExceptionFormatter", {
    enumerable: true,
    get: function() {
        return workspaceMigrationBuilderExceptionFormatter;
    }
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../../core-modules/graphql/utils/graphql-errors.util");
const _fromworkspacemigrationbuilderexceptiontometadatavalidationresponseerrorutil = require("./utils/from-workspace-migration-builder-exception-to-metadata-validation-response-error.util");
const workspaceMigrationBuilderExceptionFormatter = (error, i18n)=>{
    const { errors, summary } = (0, _fromworkspacemigrationbuilderexceptiontometadatavalidationresponseerrorutil.fromWorkspaceMigrationBuilderExceptionToMetadataValidationResponseError)(error, i18n);
    const message = `Validation failed for ${Object.values(_metadata.ALL_METADATA_NAME).flatMap((metadataName)=>{
        const count = summary[metadataName];
        if (!(0, _utils.isDefined)(count) || count === 0) {
            return [];
        }
        return [
            `${count} ${metadataName}${count > 1 ? 's' : ''}`
        ];
    }).join(', ')}`;
    throw new _graphqlerrorsutil.BaseGraphQLError(error.message, _graphqlerrorsutil.ErrorCode.METADATA_VALIDATION_FAILED, {
        code: 'METADATA_VALIDATION_ERROR',
        errors,
        summary,
        message,
        userFriendlyMessage: /*i18n*/ {
            id: "PslTPV",
            message: "Metadata validation failed"
        }
    });
};

//# sourceMappingURL=workspace-migration-builder-exception-formatter.js.map