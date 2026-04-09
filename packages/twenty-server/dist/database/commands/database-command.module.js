"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DatabaseCommandModule", {
    enumerable: true,
    get: function() {
        return DatabaseCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _cronregisterallcommand = require("./cron-register-all.command");
const _dataseeddevworkspacecommand = require("./data-seed-dev-workspace.command");
const _listanddeleteorphanedworkspaceentitiescommand = require("./list-and-delete-orphaned-workspace-entities.command");
const _confirmationquestion = require("./questions/confirmation.question");
const _runtypeormmigrationcommand = require("./run-typeorm-migration.command");
const _upgradeversioncommandmodule = require("./upgrade-version-command/upgrade-version-command.module");
const _workspaceexportmodule = require("./workspace-export/workspace-export.module");
const _typeormmodule = require("../typeorm/typeorm.module");
const _coreengineversionmodule = require("../../engine/core-engine-version/core-engine-version.module");
const _coremigrationrunnermodule = require("./core-migration-runner/core-migration-runner.module");
const _apikeymodule = require("../../engine/core-modules/api-key/api-key.module");
const _generateapikeycommand = require("../../engine/core-modules/api-key/commands/generate-api-key.command");
const _marketplacemodule = require("../../engine/core-modules/application/application-marketplace/marketplace.module");
const _staleregistrationcleanupmodule = require("../../engine/core-modules/application/application-oauth/stale-registration-cleanup/stale-registration-cleanup.module");
const _applicationupgrademodule = require("../../engine/core-modules/application/application-upgrade/application-upgrade.module");
const _enterprisekeyvalidationcroncommand = require("../../engine/core-modules/enterprise/cron/command/enterprise-key-validation.cron.command");
const _enterprisemodule = require("../../engine/core-modules/enterprise/enterprise.module");
const _eventlogcleanupmodule = require("../../engine/core-modules/event-logs/cleanup/event-log-cleanup.module");
const _featureflagmodule = require("../../engine/core-modules/feature-flag/feature-flag.module");
const _filemodule = require("../../engine/core-modules/file/file.module");
const _publicdomainmodule = require("../../engine/core-modules/public-domain/public-domain.module");
const _twentyconfigmodule = require("../../engine/core-modules/twenty-config/twenty-config.module");
const _workspaceentity = require("../../engine/core-modules/workspace/workspace.entity");
const _workspacemodule = require("../../engine/core-modules/workspace/workspace.module");
const _datasourcemodule = require("../../engine/metadata-modules/data-source/data-source.module");
const _fieldmetadatamodule = require("../../engine/metadata-modules/field-metadata/field-metadata.module");
const _objectmetadatamodule = require("../../engine/metadata-modules/object-metadata/object-metadata.module");
const _trashcleanupmodule = require("../../engine/trash-cleanup/trash-cleanup.module");
const _workspacecachestoragemodule = require("../../engine/workspace-cache-storage/workspace-cache-storage.module");
const _devseedermodule = require("../../engine/workspace-manager/dev-seeder/dev-seeder.module");
const _workspacecleanermodule = require("../../engine/workspace-manager/workspace-cleaner/workspace-cleaner.module");
const _workspacemanagermodule = require("../../engine/workspace-manager/workspace-manager.module");
const _workspacemigrationmodule = require("../../engine/workspace-manager/workspace-migration/workspace-migration.module");
const _workspaceversionmodule = require("../../engine/workspace-manager/workspace-version/workspace-version.module");
const _calendareventimportmanagermodule = require("../../modules/calendar/calendar-event-import-manager/calendar-event-import-manager.module");
const _messagingimportmanagermodule = require("../../modules/messaging/message-import-manager/messaging-import-manager.module");
const _workflowrunqueuemodule = require("../../modules/workflow/workflow-runner/workflow-run-queue/workflow-run-queue.module");
const _automatedtriggermodule = require("../../modules/workflow/workflow-trigger/automated-trigger/automated-trigger.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let DatabaseCommandModule = class DatabaseCommandModule {
};
DatabaseCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _upgradeversioncommandmodule.UpgradeVersionCommandModule,
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity
            ]),
            _workspaceexportmodule.WorkspaceExportModule,
            // Cron command dependencies
            _messagingimportmanagermodule.MessagingImportManagerModule,
            _calendareventimportmanagermodule.CalendarEventImportManagerModule,
            _automatedtriggermodule.AutomatedTriggerModule,
            _filemodule.FileModule,
            _workspacemodule.WorkspaceModule,
            _workflowrunqueuemodule.WorkflowRunQueueModule,
            // Data seeding dependencies
            _typeormmodule.TypeORMModule,
            _fieldmetadatamodule.FieldMetadataModule,
            _objectmetadatamodule.ObjectMetadataModule,
            _devseedermodule.DevSeederModule,
            _workspacemanagermodule.WorkspaceManagerModule,
            _datasourcemodule.DataSourceModule,
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _apikeymodule.ApiKeyModule,
            _featureflagmodule.FeatureFlagModule,
            _workspacecleanermodule.WorkspaceCleanerModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _trashcleanupmodule.TrashCleanupModule,
            _publicdomainmodule.PublicDomainModule,
            _eventlogcleanupmodule.EventLogCleanupModule,
            _enterprisemodule.EnterpriseModule,
            _twentyconfigmodule.TwentyConfigModule,
            _marketplacemodule.MarketplaceModule,
            _applicationupgrademodule.ApplicationUpgradeModule,
            _staleregistrationcleanupmodule.StaleRegistrationCleanupModule,
            _coreengineversionmodule.CoreEngineVersionModule,
            _coremigrationrunnermodule.CoreMigrationRunnerModule,
            _workspaceversionmodule.WorkspaceVersionModule
        ],
        providers: [
            _dataseeddevworkspacecommand.DataSeedWorkspaceCommand,
            _confirmationquestion.ConfirmationQuestion,
            _cronregisterallcommand.CronRegisterAllCommand,
            _listanddeleteorphanedworkspaceentitiescommand.ListOrphanedWorkspaceEntitiesCommand,
            _enterprisekeyvalidationcroncommand.EnterpriseKeyValidationCronCommand,
            _generateapikeycommand.GenerateApiKeyCommand,
            _runtypeormmigrationcommand.RunTypeormMigrationCommand
        ]
    })
], DatabaseCommandModule);

//# sourceMappingURL=database-command.module.js.map