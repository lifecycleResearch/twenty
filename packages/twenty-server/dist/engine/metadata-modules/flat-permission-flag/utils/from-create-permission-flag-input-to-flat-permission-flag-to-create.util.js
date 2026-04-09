"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromCreatePermissionFlagInputToFlatPermissionFlagToCreate", {
    enumerable: true,
    get: function() {
        return fromCreatePermissionFlagInputToFlatPermissionFlagToCreate;
    }
});
const _uuid = require("uuid");
const _resolveentityrelationuniversalidentifiersutil = require("../../flat-entity/utils/resolve-entity-relation-universal-identifiers.util");
const fromCreatePermissionFlagInputToFlatPermissionFlagToCreate = ({ createPermissionFlagInput, flatApplication, flatRoleMaps })=>{
    const { roleId, flag, universalIdentifier } = createPermissionFlagInput;
    const now = new Date().toISOString();
    const { roleUniversalIdentifier } = (0, _resolveentityrelationuniversalidentifiersutil.resolveEntityRelationUniversalIdentifiers)({
        metadataName: 'permissionFlag',
        foreignKeyValues: {
            roleId
        },
        flatEntityMaps: {
            flatRoleMaps
        }
    });
    return {
        id: (0, _uuid.v4)(),
        flag,
        universalIdentifier: universalIdentifier ?? (0, _uuid.v4)(),
        applicationUniversalIdentifier: flatApplication.universalIdentifier,
        roleUniversalIdentifier,
        createdAt: now,
        updatedAt: now
    };
};

//# sourceMappingURL=from-create-permission-flag-input-to-flat-permission-flag-to-create.util.js.map