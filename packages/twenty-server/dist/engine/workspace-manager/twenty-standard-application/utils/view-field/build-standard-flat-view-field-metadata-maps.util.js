"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildStandardFlatViewFieldMetadataMaps", {
    enumerable: true,
    get: function() {
        return buildStandardFlatViewFieldMetadataMaps;
    }
});
const _utils = require("twenty-shared/utils");
const _createemptyflatentitymapsconstant = require("../../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../../metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _computestandardattachmentviewfieldsutil = require("./compute-standard-attachment-view-fields.util");
const _computestandardblocklistviewfieldsutil = require("./compute-standard-blocklist-view-fields.util");
const _computestandardcalendarchanneleventassociationviewfieldsutil = require("./compute-standard-calendar-channel-event-association-view-fields.util");
const _computestandardcalendarchannelviewfieldsutil = require("./compute-standard-calendar-channel-view-fields.util");
const _computestandardcalendareventparticipantviewfieldsutil = require("./compute-standard-calendar-event-participant-view-fields.util");
const _computestandardcalendareventviewfieldsutil = require("./compute-standard-calendar-event-view-fields.util");
const _computestandardcompanyviewfieldsutil = require("./compute-standard-company-view-fields.util");
const _computestandardconnectedaccountviewfieldsutil = require("./compute-standard-connected-account-view-fields.util");
const _computestandarddashboardviewfieldsutil = require("./compute-standard-dashboard-view-fields.util");
const _computestandardfavoritefolderviewfieldsutil = require("./compute-standard-favorite-folder-view-fields.util");
const _computestandardfavoriteviewfieldsutil = require("./compute-standard-favorite-view-fields.util");
const _computestandardmessagechannelmessageassociationmessagefolderviewfieldsutil = require("./compute-standard-message-channel-message-association-message-folder-view-fields.util");
const _computestandardmessagechannelmessageassociationviewfieldsutil = require("./compute-standard-message-channel-message-association-view-fields.util");
const _computestandardmessagechannelviewfieldsutil = require("./compute-standard-message-channel-view-fields.util");
const _computestandardmessagefolderviewfieldsutil = require("./compute-standard-message-folder-view-fields.util");
const _computestandardmessageparticipantviewfieldsutil = require("./compute-standard-message-participant-view-fields.util");
const _computestandardmessagethreadviewfieldsutil = require("./compute-standard-message-thread-view-fields.util");
const _computestandardmessageviewfieldsutil = require("./compute-standard-message-view-fields.util");
const _computestandardnotetargetviewfieldsutil = require("./compute-standard-note-target-view-fields.util");
const _computestandardnoteviewfieldsutil = require("./compute-standard-note-view-fields.util");
const _computestandardopportunityviewfieldsutil = require("./compute-standard-opportunity-view-fields.util");
const _computestandardpersonviewfieldsutil = require("./compute-standard-person-view-fields.util");
const _computestandardtasktargetviewfieldsutil = require("./compute-standard-task-target-view-fields.util");
const _computestandardtaskviewfieldsutil = require("./compute-standard-task-view-fields.util");
const _computestandardtimelineactivityviewfieldsutil = require("./compute-standard-timeline-activity-view-fields.util");
const _computestandardworkflowautomatedtriggerviewfieldsutil = require("./compute-standard-workflow-automated-trigger-view-fields.util");
const _computestandardworkflowrunviewfieldsutil = require("./compute-standard-workflow-run-view-fields.util");
const _computestandardworkflowversionviewfieldsutil = require("./compute-standard-workflow-version-view-fields.util");
const _computestandardworkflowviewfieldsutil = require("./compute-standard-workflow-view-fields.util");
const _computestandardworkspacememberviewfieldsutil = require("./compute-standard-workspace-member-view-fields.util");
const STANDARD_FLAT_VIEW_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME = {
    attachment: _computestandardattachmentviewfieldsutil.computeStandardAttachmentViewFields,
    blocklist: _computestandardblocklistviewfieldsutil.computeStandardBlocklistViewFields,
    calendarChannel: _computestandardcalendarchannelviewfieldsutil.computeStandardCalendarChannelViewFields,
    calendarChannelEventAssociation: _computestandardcalendarchanneleventassociationviewfieldsutil.computeStandardCalendarChannelEventAssociationViewFields,
    calendarEvent: _computestandardcalendareventviewfieldsutil.computeStandardCalendarEventViewFields,
    calendarEventParticipant: _computestandardcalendareventparticipantviewfieldsutil.computeStandardCalendarEventParticipantViewFields,
    company: _computestandardcompanyviewfieldsutil.computeStandardCompanyViewFields,
    connectedAccount: _computestandardconnectedaccountviewfieldsutil.computeStandardConnectedAccountViewFields,
    dashboard: _computestandarddashboardviewfieldsutil.computeStandardDashboardViewFields,
    favorite: _computestandardfavoriteviewfieldsutil.computeStandardFavoriteViewFields,
    favoriteFolder: _computestandardfavoritefolderviewfieldsutil.computeStandardFavoriteFolderViewFields,
    message: _computestandardmessageviewfieldsutil.computeStandardMessageViewFields,
    messageChannel: _computestandardmessagechannelviewfieldsutil.computeStandardMessageChannelViewFields,
    messageChannelMessageAssociation: _computestandardmessagechannelmessageassociationviewfieldsutil.computeStandardMessageChannelMessageAssociationViewFields,
    messageChannelMessageAssociationMessageFolder: _computestandardmessagechannelmessageassociationmessagefolderviewfieldsutil.computeStandardMessageChannelMessageAssociationMessageFolderViewFields,
    messageFolder: _computestandardmessagefolderviewfieldsutil.computeStandardMessageFolderViewFields,
    messageParticipant: _computestandardmessageparticipantviewfieldsutil.computeStandardMessageParticipantViewFields,
    messageThread: _computestandardmessagethreadviewfieldsutil.computeStandardMessageThreadViewFields,
    note: _computestandardnoteviewfieldsutil.computeStandardNoteViewFields,
    noteTarget: _computestandardnotetargetviewfieldsutil.computeStandardNoteTargetViewFields,
    opportunity: _computestandardopportunityviewfieldsutil.computeStandardOpportunityViewFields,
    person: _computestandardpersonviewfieldsutil.computeStandardPersonViewFields,
    task: _computestandardtaskviewfieldsutil.computeStandardTaskViewFields,
    taskTarget: _computestandardtasktargetviewfieldsutil.computeStandardTaskTargetViewFields,
    timelineActivity: _computestandardtimelineactivityviewfieldsutil.computeStandardTimelineActivityViewFields,
    workflow: _computestandardworkflowviewfieldsutil.computeStandardWorkflowViewFields,
    workflowAutomatedTrigger: _computestandardworkflowautomatedtriggerviewfieldsutil.computeStandardWorkflowAutomatedTriggerViewFields,
    workflowRun: _computestandardworkflowrunviewfieldsutil.computeStandardWorkflowRunViewFields,
    workflowVersion: _computestandardworkflowversionviewfieldsutil.computeStandardWorkflowVersionViewFields,
    workspaceMember: _computestandardworkspacememberviewfieldsutil.computeStandardWorkspaceMemberViewFields
};
const buildStandardFlatViewFieldMetadataMaps = ({ shouldIncludeRecordPageLayouts, ...args })=>{
    const allViewFieldMetadatas = Object.keys(STANDARD_FLAT_VIEW_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME).flatMap((objectName)=>{
        const builder = STANDARD_FLAT_VIEW_FIELD_METADATA_BUILDERS_BY_OBJECT_NAME[objectName];
        const result = builder({
            ...args,
            objectName
        });
        return Object.values(result).filter((viewField)=>shouldIncludeRecordPageLayouts || (0, _utils.isDefined)(args.dependencyFlatEntityMaps.flatViewMaps.byUniversalIdentifier[viewField.viewUniversalIdentifier]));
    });
    let flatViewFieldMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
    for (const viewFieldMetadata of allViewFieldMetadatas){
        flatViewFieldMaps = (0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
            flatEntity: viewFieldMetadata,
            flatEntityMaps: flatViewFieldMaps
        });
    }
    return flatViewFieldMaps;
};

//# sourceMappingURL=build-standard-flat-view-field-metadata-maps.util.js.map