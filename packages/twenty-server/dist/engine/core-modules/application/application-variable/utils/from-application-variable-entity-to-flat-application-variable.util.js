"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromApplicationVariableEntityToFlatApplicationVariable", {
    enumerable: true,
    get: function() {
        return fromApplicationVariableEntityToFlatApplicationVariable;
    }
});
const fromApplicationVariableEntityToFlatApplicationVariable = (entity)=>({
        id: entity.id,
        key: entity.key,
        value: entity.value,
        description: entity.description,
        isSecret: entity.isSecret,
        applicationId: entity.applicationId,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString()
    });

//# sourceMappingURL=from-application-variable-entity-to-flat-application-variable.util.js.map