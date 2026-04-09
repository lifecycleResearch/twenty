"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "prefillWorkflowCommandMenuItems", {
    enumerable: true,
    get: function() {
        return prefillWorkflowCommandMenuItems;
    }
});
const _commandmenuitemavailabilitytypeenum = require("../../../metadata-modules/command-menu-item/enums/command-menu-item-availability-type.enum");
const _enginecomponentkeyenum = require("../../../metadata-modules/command-menu-item/enums/engine-component-key.enum");
const _prefillworkflowsutil = require("./prefill-workflows.util");
const _twentystandardapplications = require("../../twenty-standard-application/constants/twenty-standard-applications");
const QUICK_LEAD_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER = 'a1b2c3d4-e5f6-7890-abcd-1234567890ab';
const prefillWorkflowCommandMenuItems = async (entityManager, workspaceId)=>{
    const applicationRow = await entityManager.createQueryBuilder().select('app.id').from('core.application', 'app').where('app.universalIdentifier = :universalIdentifier', {
        universalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier
    }).andWhere('app.workspaceId = :workspaceId', {
        workspaceId
    }).getRawOne();
    if (!applicationRow) {
        return;
    }
    await entityManager.createQueryBuilder().insert().into('core.commandMenuItem', [
        'workspaceId',
        'universalIdentifier',
        'applicationId',
        'workflowVersionId',
        'frontComponentId',
        'engineComponentKey',
        'label',
        'icon',
        'shortLabel',
        'position',
        'isPinned',
        'availabilityType',
        'conditionalAvailabilityExpression',
        'availabilityObjectMetadataId',
        'hotKeys'
    ]).values([
        {
            workspaceId,
            universalIdentifier: QUICK_LEAD_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
            applicationId: applicationRow.app_id,
            workflowVersionId: _prefillworkflowsutil.QUICK_LEAD_WORKFLOW_VERSION_ID,
            frontComponentId: null,
            engineComponentKey: _enginecomponentkeyenum.EngineComponentKey.TRIGGER_WORKFLOW_VERSION,
            label: 'Quick Lead',
            icon: 'IconUserPlus',
            shortLabel: 'Quick Lead',
            position: 100,
            isPinned: false,
            availabilityType: _commandmenuitemavailabilitytypeenum.CommandMenuItemAvailabilityType.GLOBAL,
            conditionalAvailabilityExpression: null,
            availabilityObjectMetadataId: null,
            hotKeys: null
        }
    ]).orIgnore().execute();
};

//# sourceMappingURL=prefill-workflow-command-menu-items.util.js.map