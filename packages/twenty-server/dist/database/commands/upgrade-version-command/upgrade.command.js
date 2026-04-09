"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpgradeCommand", {
    enumerable: true,
    get: function() {
        return UpgradeCommand;
    }
});
const _typeorm = require("@nestjs/typeorm");
const _nestcommander = require("nest-commander");
const _upgradecommandrunner = require("../command-runners/upgrade.command-runner");
const _coremigrationrunnerservice = require("../core-migration-runner/services/core-migration-runner.service");
const _119addmissingsystemfieldstostandardobjectscommand = require("./1-19/1-19-add-missing-system-fields-to-standard-objects.command");
const _119backfillmessagechannelmessageassociationmessagefoldercommand = require("./1-19/1-19-backfill-message-channel-message-association-message-folder.command");
const _119backfillmissingstandardviewscommand = require("./1-19/1-19-backfill-missing-standard-views.command");
const _119backfillsystemfieldsissystemcommand = require("./1-19/1-19-backfill-system-fields-is-system.command");
const _119fixinvalidstandarduniversalidentifierscommand = require("./1-19/1-19-fix-invalid-standard-universal-identifiers.command");
const _119seedserveridcommand = require("./1-19/1-19-seed-server-id.command");
const _120backfillcommandmenuitemscommand = require("./1-20/1-20-backfill-command-menu-items.command");
const _120backfillnavigationmenuitemtypecommand = require("./1-20/1-20-backfill-navigation-menu-item-type.command");
const _120backfillpagelayoutsandfieldswidgetviewfieldscommand = require("./1-20/1-20-backfill-page-layouts-and-fields-widget-view-fields.command");
const _120identifyfieldpermissionmetadatacommand = require("./1-20/1-20-identify-field-permission-metadata.command");
const _120backfillselectfieldoptionidscommand = require("./1-20/1-20-backfill-select-field-option-ids.command");
const _120deleteorphannavigationmenuitemscommand = require("./1-20/1-20-delete-orphan-navigation-menu-items.command");
const _120identifyobjectpermissionmetadatacommand = require("./1-20/1-20-identify-object-permission-metadata.command");
const _120identifypermissionflagmetadatacommand = require("./1-20/1-20-identify-permission-flag-metadata.command");
const _120makefieldpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand = require("./1-20/1-20-make-field-permission-universal-identifier-and-application-id-not-nullable-migration.command");
const _120makeobjectpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand = require("./1-20/1-20-make-object-permission-universal-identifier-and-application-id-not-nullable-migration.command");
const _120makepermissionflaguniversalidentifierandapplicationidnotnullablemigrationcommand = require("./1-20/1-20-make-permission-flag-universal-identifier-and-application-id-not-nullable-migration.command");
const _120makeworkflowsearchablecommand = require("./1-20/1-20-make-workflow-searchable.command");
const _120migratemessaginginfrastructuretometadatacommand = require("./1-20/1-20-migrate-messaging-infrastructure-to-metadata.command");
const _120migraterichtexttotextcommand = require("./1-20/1-20-migrate-rich-text-to-text.command");
const _120seedcliapplicationregistrationcommand = require("./1-20/1-20-seed-cli-application-registration.command");
const _120updatestandardindexviewnamescommand = require("./1-20/1-20-update-standard-index-view-names.command");
const _coreengineversionservice = require("../../../engine/core-engine-version/services/core-engine-version.service");
const _twentyconfigservice = require("../../../engine/core-modules/twenty-config/twenty-config.service");
const _workspaceentity = require("../../../engine/core-modules/workspace/workspace.entity");
const _datasourceservice = require("../../../engine/metadata-modules/data-source/data-source.service");
const _globalworkspaceormmanager = require("../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _workspaceversionservice = require("../../../engine/workspace-manager/workspace-version/services/workspace-version.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let UpgradeCommand = class UpgradeCommand extends _upgradecommandrunner.UpgradeCommandRunner {
    async runMigrationCommand(passedParams, options) {
        return await super.runMigrationCommand(passedParams, options);
    }
    constructor(workspaceRepository, twentyConfigService, globalWorkspaceOrmManager, dataSourceService, coreEngineVersionService, workspaceVersionService, coreMigrationRunnerService, // 1.19 Commands
    backfillSystemFieldsIsSystemCommand, addMissingSystemFieldsToStandardObjectsCommand, backfillMessageChannelMessageAssociationMessageFolderCommand, backfillMissingStandardViewsCommand, fixRoleAndAgentUniversalIdentifiersCommand, seedServerIdCommand, // 1.20 Commands
    identifyPermissionFlagMetadataCommand, makePermissionFlagUniversalIdentifierAndApplicationIdNotNullableMigrationCommand, identifyObjectPermissionMetadataCommand, makeObjectPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand, identifyFieldPermissionMetadataCommand, makeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand, backfillNavigationMenuItemTypeCommand, backfillCommandMenuItemsCommand, deleteOrphanNavigationMenuItemsCommand, backfillPageLayoutsAndFieldsWidgetViewFieldsCommand, seedCliApplicationRegistrationCommand, migrateRichTextToTextCommand, migrateMessagingInfrastructureToMetadataCommand, backfillSelectFieldOptionIdsCommand, updateStandardIndexViewNamesCommand, makeWorkflowSearchableCommand){
        super(workspaceRepository, twentyConfigService, globalWorkspaceOrmManager, dataSourceService, coreEngineVersionService, workspaceVersionService, coreMigrationRunnerService), this.workspaceRepository = workspaceRepository, this.twentyConfigService = twentyConfigService, this.globalWorkspaceOrmManager = globalWorkspaceOrmManager, this.dataSourceService = dataSourceService, this.coreEngineVersionService = coreEngineVersionService, this.workspaceVersionService = workspaceVersionService, this.coreMigrationRunnerService = coreMigrationRunnerService, this.backfillSystemFieldsIsSystemCommand = backfillSystemFieldsIsSystemCommand, this.addMissingSystemFieldsToStandardObjectsCommand = addMissingSystemFieldsToStandardObjectsCommand, this.backfillMessageChannelMessageAssociationMessageFolderCommand = backfillMessageChannelMessageAssociationMessageFolderCommand, this.backfillMissingStandardViewsCommand = backfillMissingStandardViewsCommand, this.fixRoleAndAgentUniversalIdentifiersCommand = fixRoleAndAgentUniversalIdentifiersCommand, this.seedServerIdCommand = seedServerIdCommand, this.identifyPermissionFlagMetadataCommand = identifyPermissionFlagMetadataCommand, this.makePermissionFlagUniversalIdentifierAndApplicationIdNotNullableMigrationCommand = makePermissionFlagUniversalIdentifierAndApplicationIdNotNullableMigrationCommand, this.identifyObjectPermissionMetadataCommand = identifyObjectPermissionMetadataCommand, this.makeObjectPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand = makeObjectPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand, this.identifyFieldPermissionMetadataCommand = identifyFieldPermissionMetadataCommand, this.makeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand = makeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand, this.backfillNavigationMenuItemTypeCommand = backfillNavigationMenuItemTypeCommand, this.backfillCommandMenuItemsCommand = backfillCommandMenuItemsCommand, this.deleteOrphanNavigationMenuItemsCommand = deleteOrphanNavigationMenuItemsCommand, this.backfillPageLayoutsAndFieldsWidgetViewFieldsCommand = backfillPageLayoutsAndFieldsWidgetViewFieldsCommand, this.seedCliApplicationRegistrationCommand = seedCliApplicationRegistrationCommand, this.migrateRichTextToTextCommand = migrateRichTextToTextCommand, this.migrateMessagingInfrastructureToMetadataCommand = migrateMessagingInfrastructureToMetadataCommand, this.backfillSelectFieldOptionIdsCommand = backfillSelectFieldOptionIdsCommand, this.updateStandardIndexViewNamesCommand = updateStandardIndexViewNamesCommand, this.makeWorkflowSearchableCommand = makeWorkflowSearchableCommand;
        const commands_1190 = [
            this.fixRoleAndAgentUniversalIdentifiersCommand,
            this.backfillSystemFieldsIsSystemCommand,
            this.addMissingSystemFieldsToStandardObjectsCommand,
            this.backfillMessageChannelMessageAssociationMessageFolderCommand,
            this.backfillMissingStandardViewsCommand,
            this.fixRoleAndAgentUniversalIdentifiersCommand,
            this.seedServerIdCommand
        ];
        const commands_1200 = [
            this.identifyPermissionFlagMetadataCommand,
            this.makePermissionFlagUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
            this.identifyObjectPermissionMetadataCommand,
            this.makeObjectPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
            this.identifyFieldPermissionMetadataCommand,
            this.makeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
            this.backfillNavigationMenuItemTypeCommand,
            this.migrateRichTextToTextCommand,
            this.deleteOrphanNavigationMenuItemsCommand,
            this.backfillCommandMenuItemsCommand,
            this.backfillPageLayoutsAndFieldsWidgetViewFieldsCommand,
            this.seedCliApplicationRegistrationCommand,
            this.migrateMessagingInfrastructureToMetadataCommand,
            this.backfillSelectFieldOptionIdsCommand,
            this.updateStandardIndexViewNamesCommand,
            this.makeWorkflowSearchableCommand
        ];
        this.allCommands = {
            '1.19.0': commands_1190,
            '1.20.0': commands_1200
        };
    }
};
UpgradeCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'upgrade',
        description: 'Upgrade workspaces to the latest version'
    }),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Repository === "undefined" ? Object : Repository,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _datasourceservice.DataSourceService === "undefined" ? Object : _datasourceservice.DataSourceService,
        typeof _coreengineversionservice.CoreEngineVersionService === "undefined" ? Object : _coreengineversionservice.CoreEngineVersionService,
        typeof _workspaceversionservice.WorkspaceVersionService === "undefined" ? Object : _workspaceversionservice.WorkspaceVersionService,
        typeof _coremigrationrunnerservice.CoreMigrationRunnerService === "undefined" ? Object : _coremigrationrunnerservice.CoreMigrationRunnerService,
        typeof _119backfillsystemfieldsissystemcommand.BackfillSystemFieldsIsSystemCommand === "undefined" ? Object : _119backfillsystemfieldsissystemcommand.BackfillSystemFieldsIsSystemCommand,
        typeof _119addmissingsystemfieldstostandardobjectscommand.AddMissingSystemFieldsToStandardObjectsCommand === "undefined" ? Object : _119addmissingsystemfieldstostandardobjectscommand.AddMissingSystemFieldsToStandardObjectsCommand,
        typeof _119backfillmessagechannelmessageassociationmessagefoldercommand.BackfillMessageChannelMessageAssociationMessageFolderCommand === "undefined" ? Object : _119backfillmessagechannelmessageassociationmessagefoldercommand.BackfillMessageChannelMessageAssociationMessageFolderCommand,
        typeof _119backfillmissingstandardviewscommand.BackfillMissingStandardViewsCommand === "undefined" ? Object : _119backfillmissingstandardviewscommand.BackfillMissingStandardViewsCommand,
        typeof _119fixinvalidstandarduniversalidentifierscommand.FixInvalidStandardUniversalIdentifiersCommand === "undefined" ? Object : _119fixinvalidstandarduniversalidentifierscommand.FixInvalidStandardUniversalIdentifiersCommand,
        typeof _119seedserveridcommand.SeedServerIdCommand === "undefined" ? Object : _119seedserveridcommand.SeedServerIdCommand,
        typeof _120identifypermissionflagmetadatacommand.IdentifyPermissionFlagMetadataCommand === "undefined" ? Object : _120identifypermissionflagmetadatacommand.IdentifyPermissionFlagMetadataCommand,
        typeof _120makepermissionflaguniversalidentifierandapplicationidnotnullablemigrationcommand.MakePermissionFlagUniversalIdentifierAndApplicationIdNotNullableMigrationCommand === "undefined" ? Object : _120makepermissionflaguniversalidentifierandapplicationidnotnullablemigrationcommand.MakePermissionFlagUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
        typeof _120identifyobjectpermissionmetadatacommand.IdentifyObjectPermissionMetadataCommand === "undefined" ? Object : _120identifyobjectpermissionmetadatacommand.IdentifyObjectPermissionMetadataCommand,
        typeof _120makeobjectpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand.MakeObjectPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand === "undefined" ? Object : _120makeobjectpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand.MakeObjectPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
        typeof _120identifyfieldpermissionmetadatacommand.IdentifyFieldPermissionMetadataCommand === "undefined" ? Object : _120identifyfieldpermissionmetadatacommand.IdentifyFieldPermissionMetadataCommand,
        typeof _120makefieldpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand.MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand === "undefined" ? Object : _120makefieldpermissionuniversalidentifierandapplicationidnotnullablemigrationcommand.MakeFieldPermissionUniversalIdentifierAndApplicationIdNotNullableMigrationCommand,
        typeof _120backfillnavigationmenuitemtypecommand.BackfillNavigationMenuItemTypeCommand === "undefined" ? Object : _120backfillnavigationmenuitemtypecommand.BackfillNavigationMenuItemTypeCommand,
        typeof _120backfillcommandmenuitemscommand.BackfillCommandMenuItemsCommand === "undefined" ? Object : _120backfillcommandmenuitemscommand.BackfillCommandMenuItemsCommand,
        typeof _120deleteorphannavigationmenuitemscommand.DeleteOrphanNavigationMenuItemsCommand === "undefined" ? Object : _120deleteorphannavigationmenuitemscommand.DeleteOrphanNavigationMenuItemsCommand,
        typeof _120backfillpagelayoutsandfieldswidgetviewfieldscommand.BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand === "undefined" ? Object : _120backfillpagelayoutsandfieldswidgetviewfieldscommand.BackfillPageLayoutsAndFieldsWidgetViewFieldsCommand,
        typeof _120seedcliapplicationregistrationcommand.SeedCliApplicationRegistrationCommand === "undefined" ? Object : _120seedcliapplicationregistrationcommand.SeedCliApplicationRegistrationCommand,
        typeof _120migraterichtexttotextcommand.MigrateRichTextToTextCommand === "undefined" ? Object : _120migraterichtexttotextcommand.MigrateRichTextToTextCommand,
        typeof _120migratemessaginginfrastructuretometadatacommand.MigrateMessagingInfrastructureToMetadataCommand === "undefined" ? Object : _120migratemessaginginfrastructuretometadatacommand.MigrateMessagingInfrastructureToMetadataCommand,
        typeof _120backfillselectfieldoptionidscommand.BackfillSelectFieldOptionIdsCommand === "undefined" ? Object : _120backfillselectfieldoptionidscommand.BackfillSelectFieldOptionIdsCommand,
        typeof _120updatestandardindexviewnamescommand.UpdateStandardIndexViewNamesCommand === "undefined" ? Object : _120updatestandardindexviewnamescommand.UpdateStandardIndexViewNamesCommand,
        typeof _120makeworkflowsearchablecommand.MakeWorkflowSearchableCommand === "undefined" ? Object : _120makeworkflowsearchablecommand.MakeWorkflowSearchableCommand
    ])
], UpgradeCommand);

//# sourceMappingURL=upgrade.command.js.map