"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromCreateViewFilterInputToFlatViewFilterToCreate", {
    enumerable: true,
    get: function() {
        return fromCreateViewFilterInputToFlatViewFilterToCreate;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _resolveentityrelationuniversalidentifiersutil = require("../../flat-entity/utils/resolve-entity-relation-universal-identifiers.util");
const fromCreateViewFilterInputToFlatViewFilterToCreate = ({ createViewFilterInput: rawCreateViewFilterInput, flatApplication, flatFieldMetadataMaps, flatViewMaps, flatViewFilterGroupMaps })=>{
    const { fieldMetadataId, viewId, value, ...createViewFilterInput } = (0, _utils.trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties)(rawCreateViewFilterInput, [
        'fieldMetadataId',
        'id',
        'viewId',
        'viewFilterGroupId',
        'operand',
        'subFieldName'
    ]);
    const createdAt = new Date().toISOString();
    const viewFilterId = createViewFilterInput.id ?? (0, _uuid.v4)();
    const { fieldMetadataUniversalIdentifier, viewUniversalIdentifier, viewFilterGroupUniversalIdentifier } = (0, _resolveentityrelationuniversalidentifiersutil.resolveEntityRelationUniversalIdentifiers)({
        metadataName: 'viewFilter',
        foreignKeyValues: {
            fieldMetadataId,
            viewId,
            viewFilterGroupId: createViewFilterInput.viewFilterGroupId
        },
        flatEntityMaps: {
            flatFieldMetadataMaps,
            flatViewMaps,
            flatViewFilterGroupMaps
        }
    });
    return {
        id: viewFilterId,
        fieldMetadataUniversalIdentifier,
        viewUniversalIdentifier,
        createdAt,
        updatedAt: createdAt,
        deletedAt: null,
        universalIdentifier: createViewFilterInput.universalIdentifier ?? (0, _uuid.v4)(),
        operand: createViewFilterInput.operand ?? _types.ViewFilterOperand.CONTAINS,
        value,
        viewFilterGroupUniversalIdentifier,
        positionInViewFilterGroup: createViewFilterInput.positionInViewFilterGroup ?? null,
        subFieldName: createViewFilterInput.subFieldName ?? null,
        applicationUniversalIdentifier: flatApplication.universalIdentifier
    };
};

//# sourceMappingURL=from-create-view-filter-input-to-flat-view-filter-to-create.util.js.map