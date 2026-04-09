"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeApplicationManifestAllUniversalFlatEntityMaps", {
    enumerable: true,
    get: function() {
        return computeApplicationManifestAllUniversalFlatEntityMaps;
    }
});
const _fromcommandmenuitemmanifesttouniversalflatcommandmenuitemutil = require("../converters/from-command-menu-item-manifest-to-universal-flat-command-menu-item.util");
const _fromfieldmanifesttouniversalflatfieldmetadatautil = require("../converters/from-field-manifest-to-universal-flat-field-metadata.util");
const _fromfrontcomponentmanifesttouniversalflatfrontcomponentutil = require("../converters/from-front-component-manifest-to-universal-flat-front-component.util");
const _fromlogicfunctionmanifesttouniversalflatlogicfunctionutil = require("../converters/from-logic-function-manifest-to-universal-flat-logic-function.util");
const _fromnavigationmenuitemmanifesttouniversalflatnavigationmenuitemutil = require("../converters/from-navigation-menu-item-manifest-to-universal-flat-navigation-menu-item.util");
const _fromobjectmanifesttouniversalflatobjectmetadatautil = require("../converters/from-object-manifest-to-universal-flat-object-metadata.util");
const _frompagelayoutmanifesttouniversalflatpagelayoututil = require("../converters/from-page-layout-manifest-to-universal-flat-page-layout.util");
const _frompagelayouttabmanifesttouniversalflatpagelayouttabutil = require("../converters/from-page-layout-tab-manifest-to-universal-flat-page-layout-tab.util");
const _frompagelayoutwidgetmanifesttouniversalflatpagelayoutwidgetutil = require("../converters/from-page-layout-widget-manifest-to-universal-flat-page-layout-widget.util");
const _fromrolemanifesttouniversalflatroleutil = require("../converters/from-role-manifest-to-universal-flat-role.util");
const _fromskillmanifesttouniversalflatskillutil = require("../converters/from-skill-manifest-to-universal-flat-skill.util");
const _fromviewfieldgroupmanifesttouniversalflatviewfieldgrouputil = require("../converters/from-view-field-group-manifest-to-universal-flat-view-field-group.util");
const _fromviewfieldmanifesttouniversalflatviewfieldutil = require("../converters/from-view-field-manifest-to-universal-flat-view-field.util");
const _fromviewfiltergroupmanifesttouniversalflatviewfiltergrouputil = require("../converters/from-view-filter-group-manifest-to-universal-flat-view-filter-group.util");
const _fromviewfiltermanifesttouniversalflatviewfilterutil = require("../converters/from-view-filter-manifest-to-universal-flat-view-filter.util");
const _fromviewgroupmanifesttouniversalflatviewgrouputil = require("../converters/from-view-group-manifest-to-universal-flat-view-group.util");
const _fromviewmanifesttouniversalflatviewutil = require("../converters/from-view-manifest-to-universal-flat-view.util");
const _fromagentmanifesttouniversalflatagentutil = require("../../utils/from-agent-manifest-to-universal-flat-agent.util");
const _createemptyallflatentitymapsconstant = require("../../../../metadata-modules/flat-entity/constant/create-empty-all-flat-entity-maps.constant");
const _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil = require("../../../../workspace-manager/workspace-migration/universal-flat-entity/utils/add-universal-flat-entity-to-universal-flat-entity-maps-through-mutation-or-throw.util");
const computeApplicationManifestAllUniversalFlatEntityMaps = ({ manifest, ownerFlatApplication, now })=>{
    const allUniversalFlatEntityMaps = (0, _createemptyallflatentitymapsconstant.createEmptyAllFlatEntityMaps)();
    const { universalIdentifier: applicationUniversalIdentifier } = ownerFlatApplication;
    for (const objectManifest of manifest.objects){
        (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
            universalFlatEntity: (0, _fromobjectmanifesttouniversalflatobjectmetadatautil.fromObjectManifestToUniversalFlatObjectMetadata)({
                objectManifest,
                applicationUniversalIdentifier,
                now
            }),
            universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatObjectMetadataMaps
        });
        for (const fieldManifest of objectManifest.fields){
            (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
                universalFlatEntity: (0, _fromfieldmanifesttouniversalflatfieldmetadatautil.fromFieldManifestToUniversalFlatFieldMetadata)({
                    fieldManifest: {
                        ...fieldManifest,
                        objectUniversalIdentifier: objectManifest.universalIdentifier
                    },
                    applicationUniversalIdentifier,
                    now
                }),
                universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatFieldMetadataMaps
            });
        }
    }
    for (const fieldManifest of manifest.fields){
        (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
            universalFlatEntity: (0, _fromfieldmanifesttouniversalflatfieldmetadatautil.fromFieldManifestToUniversalFlatFieldMetadata)({
                fieldManifest: fieldManifest,
                applicationUniversalIdentifier,
                now
            }),
            universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatFieldMetadataMaps
        });
    }
    for (const logicFunctionManifest of manifest.logicFunctions){
        (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
            universalFlatEntity: (0, _fromlogicfunctionmanifesttouniversalflatlogicfunctionutil.fromLogicFunctionManifestToUniversalFlatLogicFunction)({
                logicFunctionManifest,
                applicationUniversalIdentifier,
                now
            }),
            universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatLogicFunctionMaps
        });
    }
    for (const frontComponentManifest of manifest.frontComponents){
        (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
            universalFlatEntity: (0, _fromfrontcomponentmanifesttouniversalflatfrontcomponentutil.fromFrontComponentManifestToUniversalFlatFrontComponent)({
                frontComponentManifest,
                applicationUniversalIdentifier,
                now
            }),
            universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatFrontComponentMaps
        });
        if (frontComponentManifest.command) {
            (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
                universalFlatEntity: (0, _fromcommandmenuitemmanifesttouniversalflatcommandmenuitemutil.fromCommandMenuItemManifestToUniversalFlatCommandMenuItem)({
                    commandMenuItemManifest: {
                        ...frontComponentManifest.command,
                        frontComponentUniversalIdentifier: frontComponentManifest.universalIdentifier
                    },
                    applicationUniversalIdentifier,
                    now
                }),
                universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatCommandMenuItemMaps
            });
        }
    }
    for (const roleManifest of manifest.roles){
        (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
            universalFlatEntity: (0, _fromrolemanifesttouniversalflatroleutil.fromRoleManifestToUniversalFlatRole)({
                roleManifest,
                applicationUniversalIdentifier,
                now
            }),
            universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatRoleMaps
        });
    }
    for (const skillManifest of manifest.skills ?? []){
        (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
            universalFlatEntity: (0, _fromskillmanifesttouniversalflatskillutil.fromSkillManifestToUniversalFlatSkill)({
                skillManifest,
                applicationUniversalIdentifier,
                now
            }),
            universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatSkillMaps
        });
    }
    for (const agentManifest of manifest.agents ?? []){
        (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
            universalFlatEntity: (0, _fromagentmanifesttouniversalflatagentutil.fromAgentManifestToUniversalFlatAgent)({
                agentManifest,
                applicationUniversalIdentifier,
                now
            }),
            universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatAgentMaps
        });
    }
    for (const viewManifest of manifest.views ?? []){
        (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
            universalFlatEntity: (0, _fromviewmanifesttouniversalflatviewutil.fromViewManifestToUniversalFlatView)({
                viewManifest,
                applicationUniversalIdentifier,
                now
            }),
            universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatViewMaps
        });
        for (const viewFieldGroupManifest of viewManifest.fieldGroups ?? []){
            (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
                universalFlatEntity: (0, _fromviewfieldgroupmanifesttouniversalflatviewfieldgrouputil.fromViewFieldGroupManifestToUniversalFlatViewFieldGroup)({
                    viewFieldGroupManifest,
                    viewUniversalIdentifier: viewManifest.universalIdentifier,
                    applicationUniversalIdentifier,
                    now
                }),
                universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatViewFieldGroupMaps
            });
        }
        for (const viewFieldManifest of viewManifest.fields ?? []){
            (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
                universalFlatEntity: (0, _fromviewfieldmanifesttouniversalflatviewfieldutil.fromViewFieldManifestToUniversalFlatViewField)({
                    viewFieldManifest,
                    viewUniversalIdentifier: viewManifest.universalIdentifier,
                    applicationUniversalIdentifier,
                    now
                }),
                universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatViewFieldMaps
            });
        }
        for (const viewFilterGroupManifest of viewManifest.filterGroups ?? []){
            (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
                universalFlatEntity: (0, _fromviewfiltergroupmanifesttouniversalflatviewfiltergrouputil.fromViewFilterGroupManifestToUniversalFlatViewFilterGroup)({
                    viewFilterGroupManifest,
                    viewUniversalIdentifier: viewManifest.universalIdentifier,
                    applicationUniversalIdentifier,
                    now
                }),
                universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatViewFilterGroupMaps
            });
        }
        for (const viewFilterManifest of viewManifest.filters ?? []){
            (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
                universalFlatEntity: (0, _fromviewfiltermanifesttouniversalflatviewfilterutil.fromViewFilterManifestToUniversalFlatViewFilter)({
                    viewFilterManifest,
                    viewUniversalIdentifier: viewManifest.universalIdentifier,
                    applicationUniversalIdentifier,
                    now
                }),
                universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatViewFilterMaps
            });
        }
        for (const viewGroupManifest of viewManifest.groups ?? []){
            (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
                universalFlatEntity: (0, _fromviewgroupmanifesttouniversalflatviewgrouputil.fromViewGroupManifestToUniversalFlatViewGroup)({
                    viewGroupManifest,
                    viewUniversalIdentifier: viewManifest.universalIdentifier,
                    applicationUniversalIdentifier,
                    now
                }),
                universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatViewGroupMaps
            });
        }
    }
    for (const navigationMenuItemManifest of manifest.navigationMenuItems ?? []){
        (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
            universalFlatEntity: (0, _fromnavigationmenuitemmanifesttouniversalflatnavigationmenuitemutil.fromNavigationMenuItemManifestToUniversalFlatNavigationMenuItem)({
                navigationMenuItemManifest,
                applicationUniversalIdentifier,
                now
            }),
            universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatNavigationMenuItemMaps
        });
    }
    for (const pageLayoutManifest of manifest.pageLayouts ?? []){
        (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
            universalFlatEntity: (0, _frompagelayoutmanifesttouniversalflatpagelayoututil.fromPageLayoutManifestToUniversalFlatPageLayout)({
                pageLayoutManifest,
                applicationUniversalIdentifier,
                now
            }),
            universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatPageLayoutMaps
        });
        for (const pageLayoutTabManifest of pageLayoutManifest.tabs ?? []){
            (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
                universalFlatEntity: (0, _frompagelayouttabmanifesttouniversalflatpagelayouttabutil.fromPageLayoutTabManifestToUniversalFlatPageLayoutTab)({
                    pageLayoutTabManifest,
                    pageLayoutUniversalIdentifier: pageLayoutManifest.universalIdentifier,
                    applicationUniversalIdentifier,
                    now
                }),
                universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatPageLayoutTabMaps
            });
            for (const pageLayoutWidgetManifest of pageLayoutTabManifest.widgets ?? []){
                (0, _adduniversalflatentitytouniversalflatentitymapsthroughmutationorthrowutil.addUniversalFlatEntityToUniversalFlatEntityMapsThroughMutationOrThrow)({
                    universalFlatEntity: (0, _frompagelayoutwidgetmanifesttouniversalflatpagelayoutwidgetutil.fromPageLayoutWidgetManifestToUniversalFlatPageLayoutWidget)({
                        pageLayoutWidgetManifest,
                        pageLayoutTabUniversalIdentifier: pageLayoutTabManifest.universalIdentifier,
                        applicationUniversalIdentifier,
                        now
                    }),
                    universalFlatEntityMapsToMutate: allUniversalFlatEntityMaps.flatPageLayoutWidgetMaps
                });
            }
        }
    }
    return allUniversalFlatEntityMaps;
};

//# sourceMappingURL=compute-application-manifest-all-universal-flat-entity-maps.util.js.map