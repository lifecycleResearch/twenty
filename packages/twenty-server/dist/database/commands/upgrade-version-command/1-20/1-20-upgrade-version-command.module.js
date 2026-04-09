"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V1_20_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V1_20_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _120backfillcommandmenuitemscommand = require("./1-20-backfill-command-menu-items.command");
const _120backfillnavigationmenuitemtypecommand = require("./1-20-backfill-navigation-menu-item-type.command");
const _120backfillpagelayoutsandfieldswidgetviewfieldscommand = require("./1-20-backfill-page-layouts-and-fields-widget-view-fields.command");
const _120backfillselectfieldoptionidscommand = require("./1-20-backfill-select-field-option-ids.command");
const _120deleteorphannavigationmenuitemscommand = require("./1-20-delete-orphan-navigation-menu-items.command");
const _120identifyfieldpermissionmetadatacommand = require("./1-20-identify-field-permission-metadata.command");
const _120identifyobjectpermissionmetadatacommand = require("./1-20-identify-object-permission-metadata.command");
const _120identifypermissionflagmetadatacommand = require("./1-20-identify-permission-flag-metadata.command");
const _120makefieldpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand = require("./1-20-make-field-permission-universal-identifier-and-application-id-not-nullable-migration.command");
const _120makeobjectpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand = require("./1-20-make-object-permission-universal-identifier-and-application-id-not-nullable-migration.command");
const _120makepermissionflaguniversalidentifierandapplicationidnotnullablemigrationcommand = require("./1-20-make-permission-flag-universal-identifier-and-application-id-not-nullable-migration.command");
const _120makeworkflowsearchablecommand = require("./1-20-make-workflow-searchable.command");
const _120migratemessaginginfrastructuretometadatacommand = require("./1-20-migrate-messaging-infrastructure-to-metadata.command");
const _120migraterichtexttotextcommand = require("./1-20-migrate-rich-text-to-text.command");
const _120seedcliapplicationregistrationcommand = require("./1-20-seed-cli-application-registration.command");
const _120updatestandardindexviewnamescommand = require("./1-20-update-standard-index-view-names.command");
const _applicationregistrationmodule = require("../../../../engine/core-modules/application/application-registration/application-registration.module");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _featureflagmodule = require("../../../../engine/core-modules/feature-flag/feature-flag.module");
const _userworkspaceentity = require("../../../../engine/core-modules/user-workspace/user-workspace.entity");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _calendarchannelentity = require("../../../../engine/metadata-modules/calendar-channel/entities/calendar-channel.entity");
const _connectedaccountentity = require("../../../../engine/metadata-modules/connected-account/entities/connected-account.entity");
const _datasourcemodule = require("../../../../engine/metadata-modules/data-source/data-source.module");
const _messagechannelentity = require("../../../../engine/metadata-modules/message-channel/entities/message-channel.entity");
const _messagefolderentity = require("../../../../engine/metadata-modules/message-folder/entities/message-folder.entity");
const _navigationmenuitementity = require("../../../../engine/metadata-modules/navigation-menu-item/entities/navigation-menu-item.entity");
const _workspacemetadataversionmodule = require("../../../../engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module");
const _workspacecachestoragemodule = require("../../../../engine/workspace-cache-storage/workspace-cache-storage.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationrunnermodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
const _workflowcommonmodule = require("../../../../modules/workflow/common/workflow-common.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V1_20_UpgradeVersionCommandModule = class V1_20_UpgradeVersionCommandModule {
};
V1_20_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity,
                _connectedaccountentity.ConnectedAccountEntity,
                _messagechannelentity.MessageChannelEntity,
                _calendarchannelentity.CalendarChannelEntity,
                _messagefolderentity.MessageFolderEntity,
                _userworkspaceentity.UserWorkspaceEntity,
                _navigationmenuitementity.NavigationMenuItemEntity
            ]),
            _datasourcemodule.DataSourceModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _workspacemetadataversionmodule.WorkspaceMetadataVersionModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _applicationmodule.ApplicationModule,
            _applicationregistrationmodule.ApplicationRegistrationModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _featureflagmodule.FeatureFlagModule,
            _workflowcommonmodule.WorkflowCommonModule
        ],
        providers: [
            _120identifypermissionflagmetadatacommand.IdentifyPermissionFlagMetadataCommand,
            _120makepermissionflaguniversalidentifierandapplicationidnotnullablemigrationcommand.MakePermissionFlagUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
            _120identifyobjectpermissionmetadatacommand.IdentifyObjectPermissionMetadataCommand,
            _120makeobjectpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand.MakeObjectPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
            _120identifyfieldpermissionmetadatacommand.IdentifyFieldPermissionMetadataCommand,
            _120makefieldpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand.MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
            _120backfillcommandmenuitemscommand.BackfillCommandMenuItemsCommand,
            _120backfillnavigationmenuitemtypecommand.BackfillNavigationMenuItemTypeCommand,
            _120backfillpagelayoutsandfieldswidgetviewfieldscommand.BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand,
            _120backfillselectfieldoptionidscommand.BackfillSelectFieldOptionIdsCommand,
            _120deleteorphannavigationmenuitemscommand.DeleteOrphanNavigationMenuItemsCommand,
            _120seedcliapplicationregistrationcommand.SeedCliApplicationRegistrationCommand,
            _120migraterichtexttotextcommand.MigrateRichTextToTextCommand,
            _120migratemessaginginfrastructuretometadatacommand.MigrateMessagingInfrastructureToMetadataCommand,
            _120updatestandardindexviewnamescommand.UpdateStandardIndexViewNamesCommand,
            _120makeworkflowsearchablecommand.MakeWorkflowSearchableCommand
        ],
        exports: [
            _120identifypermissionflagmetadatacommand.IdentifyPermissionFlagMetadataCommand,
            _120makepermissionflaguniversalidentifierandapplicationidnotnullablemigrationcommand.MakePermissionFlagUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
            _120identifyobjectpermissionmetadatacommand.IdentifyObjectPermissionMetadataCommand,
            _120makeobjectpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand.MakeObjectPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
            _120identifyfieldpermissionmetadatacommand.IdentifyFieldPermissionMetadataCommand,
            _120makefieldpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand.MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
            _120backfillcommandmenuitemscommand.BackfillCommandMenuItemsCommand,
            _120backfillnavigationmenuitemtypecommand.BackfillNavigationMenuItemTypeCommand,
            _120backfillpagelayoutsandfieldswidgetviewfieldscommand.BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand,
            _120backfillselectfieldoptionidscommand.BackfillSelectFieldOptionIdsCommand,
            _120deleteorphannavigationmenuitemscommand.DeleteOrphanNavigationMenuItemsCommand,
            _120seedcliapplicationregistrationcommand.SeedCliApplicationRegistrationCommand,
            _120migraterichtexttotextcommand.MigrateRichTextToTextCommand,
            _120migratemessaginginfrastructuretometadatacommand.MigrateMessagingInfrastructureToMetadataCommand,
            _120updatestandardindexviewnamescommand.UpdateStandardIndexViewNamesCommand,
            _120makeworkflowsearchablecommand.MakeWorkflowSearchableCommand
        ]
    })
], V1_20_UpgradeVersionCommandModule);

//# sourceMappingURL=1-20-upgrade-version-command.module.js.map