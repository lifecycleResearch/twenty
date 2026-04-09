"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildStandardFlatCommandMenuItemMaps", {
    enumerable: true,
    get: function() {
        return buildStandardFlatCommandMenuItemMaps;
    }
});
const _uuid = require("uuid");
const _createemptyflatentitymapsconstant = require("../../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _standardcommandmenuitemconstant = require("../../constants/standard-command-menu-item.constant");
const _createstandardcommandmenuitemflatmetadatautil = require("./create-standard-command-menu-item-flat-metadata.util");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../../../workspace-migration/utils/add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
const STANDARD_COMMAND_MENU_ITEM_NAMES = Object.keys(_standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS);
const buildStandardFlatCommandMenuItemMaps = ({ now, workspaceId, twentyStandardApplicationId, dependencyFlatEntityMaps: { flatObjectMetadataMaps } })=>{
    const flatCommandMenuItemMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
    for (const commandMenuItemName of STANDARD_COMMAND_MENU_ITEM_NAMES){
        const flatCommandMenuItem = (0, _createstandardcommandmenuitemflatmetadatautil.createStandardCommandMenuItemFlatMetadata)({
            commandMenuItemName,
            commandMenuItemId: (0, _uuid.v4)(),
            workspaceId,
            twentyStandardApplicationId,
            dependencyFlatEntityMaps: {
                flatObjectMetadataMaps
            },
            now
        });
        (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
            flatEntity: flatCommandMenuItem,
            flatEntityMapsToMutate: flatCommandMenuItemMaps
        });
    }
    return flatCommandMenuItemMaps;
};

//# sourceMappingURL=build-standard-flat-command-menu-item-maps.util.js.map