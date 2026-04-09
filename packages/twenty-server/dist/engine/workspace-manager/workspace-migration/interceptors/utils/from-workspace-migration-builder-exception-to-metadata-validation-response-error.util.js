"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromWorkspaceMigrationBuilderExceptionToMetadataValidationResponseError", {
    enumerable: true,
    get: function() {
        return fromWorkspaceMigrationBuilderExceptionToMetadataValidationResponseError;
    }
});
const _translateorchestratorfailurereporterrorsutil = require("./translate-orchestrator-failure-report-errors.util");
const fromWorkspaceMigrationBuilderExceptionToMetadataValidationResponseError = (workspaceMigrationBuilderException, i18n)=>{
    const translatedReport = (0, _translateorchestratorfailurereporterrorsutil.translateOrchestratorFailureReportErrors)(workspaceMigrationBuilderException.failedWorkspaceMigrationBuildResult.report, i18n);
    const initialAccumulator = {
        errors: {},
        summary: {
            totalErrors: 0
        }
    };
    return Object.keys(translatedReport).reduce((acc, metadataName)=>{
        const failedMetadataValidation = translatedReport[metadataName];
        if (failedMetadataValidation.length === 0) {
            return acc;
        }
        return {
            errors: {
                ...acc.errors,
                [metadataName]: failedMetadataValidation
            },
            summary: {
                ...acc.summary,
                totalErrors: acc.summary.totalErrors + failedMetadataValidation.length,
                [metadataName]: failedMetadataValidation.length
            }
        };
    }, initialAccumulator);
};

//# sourceMappingURL=from-workspace-migration-builder-exception-to-metadata-validation-response-error.util.js.map