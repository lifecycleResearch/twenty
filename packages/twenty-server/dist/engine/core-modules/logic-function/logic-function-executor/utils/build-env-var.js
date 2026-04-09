"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildEnvVar", {
    enumerable: true,
    get: function() {
        return buildEnvVar;
    }
});
const buildEnvVar = (flatApplicationVariables, secretEncryptionService)=>{
    return flatApplicationVariables.reduce((acc, flatApplicationVariable)=>{
        const value = String(flatApplicationVariable.value ?? '');
        acc[flatApplicationVariable.key] = flatApplicationVariable.isSecret ? secretEncryptionService.decrypt(value) : value;
        return acc;
    }, {});
};

//# sourceMappingURL=build-env-var.js.map