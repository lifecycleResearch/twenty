"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "crossEntityTransversalValidation", {
    enumerable: true,
    get: function() {
        return crossEntityTransversalValidation;
    }
});
const _validateobjectmetadatacrossentityutil = require("../../../metadata-modules/flat-object-metadata/validators/utils/validate-object-metadata-cross-entity.util");
const crossEntityTransversalValidation = ({ optimisticUniversalFlatMaps, orchestratorActionsReport })=>{
    const { objectMetadata } = (0, _validateobjectmetadatacrossentityutil.validateObjectMetadataCrossEntity)({
        optimisticUniversalFlatMaps,
        orchestratorActionsReport
    });
    return {
        objectMetadata
    };
};

//# sourceMappingURL=cross-entity-transversal-validation.util.js.map