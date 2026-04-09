"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromCommandMenuItemEntityToFlatCommandMenuItem", {
    enumerable: true,
    get: function() {
        return fromCommandMenuItemEntityToFlatCommandMenuItem;
    }
});
const _utils = require("twenty-shared/utils");
const _flatentitymapsexception = require("../../flat-entity/exceptions/flat-entity-maps.exception");
const fromCommandMenuItemEntityToFlatCommandMenuItem = ({ entity: commandMenuItemEntity, applicationIdToUniversalIdentifierMap, objectMetadataIdToUniversalIdentifierMap, frontComponentIdToUniversalIdentifierMap })=>{
    const applicationUniversalIdentifier = applicationIdToUniversalIdentifierMap.get(commandMenuItemEntity.applicationId);
    if (!(0, _utils.isDefined)(applicationUniversalIdentifier)) {
        throw new _flatentitymapsexception.FlatEntityMapsException(`Application with id ${commandMenuItemEntity.applicationId} not found for commandMenuItem ${commandMenuItemEntity.id}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
    }
    let availabilityObjectMetadataUniversalIdentifier = null;
    if ((0, _utils.isDefined)(commandMenuItemEntity.availabilityObjectMetadataId)) {
        availabilityObjectMetadataUniversalIdentifier = objectMetadataIdToUniversalIdentifierMap.get(commandMenuItemEntity.availabilityObjectMetadataId) ?? null;
        if (!(0, _utils.isDefined)(availabilityObjectMetadataUniversalIdentifier)) {
            throw new _flatentitymapsexception.FlatEntityMapsException(`ObjectMetadata with id ${commandMenuItemEntity.availabilityObjectMetadataId} not found for commandMenuItem ${commandMenuItemEntity.id}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
        }
    }
    let frontComponentUniversalIdentifier = null;
    if ((0, _utils.isDefined)(commandMenuItemEntity.frontComponentId)) {
        frontComponentUniversalIdentifier = frontComponentIdToUniversalIdentifierMap.get(commandMenuItemEntity.frontComponentId) ?? null;
        if (!(0, _utils.isDefined)(frontComponentUniversalIdentifier)) {
            throw new _flatentitymapsexception.FlatEntityMapsException(`FrontComponent with id ${commandMenuItemEntity.frontComponentId} not found for commandMenuItem ${commandMenuItemEntity.id}`, _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND);
        }
    }
    return {
        id: commandMenuItemEntity.id,
        workflowVersionId: commandMenuItemEntity.workflowVersionId,
        frontComponentId: commandMenuItemEntity.frontComponentId,
        engineComponentKey: commandMenuItemEntity.engineComponentKey,
        label: commandMenuItemEntity.label,
        icon: commandMenuItemEntity.icon,
        shortLabel: commandMenuItemEntity.shortLabel,
        position: commandMenuItemEntity.position,
        isPinned: commandMenuItemEntity.isPinned,
        hotKeys: commandMenuItemEntity.hotKeys,
        availabilityType: commandMenuItemEntity.availabilityType,
        availabilityObjectMetadataId: commandMenuItemEntity.availabilityObjectMetadataId,
        workspaceId: commandMenuItemEntity.workspaceId,
        universalIdentifier: commandMenuItemEntity.universalIdentifier,
        applicationId: commandMenuItemEntity.applicationId,
        createdAt: commandMenuItemEntity.createdAt.toISOString(),
        updatedAt: commandMenuItemEntity.updatedAt.toISOString(),
        applicationUniversalIdentifier,
        conditionalAvailabilityExpression: commandMenuItemEntity.conditionalAvailabilityExpression,
        availabilityObjectMetadataUniversalIdentifier,
        frontComponentUniversalIdentifier
    };
};

//# sourceMappingURL=from-command-menu-item-entity-to-flat-command-menu-item.util.js.map