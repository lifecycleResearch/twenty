"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "V1_19_UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return V1_19_UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _119addmissingsystemfieldstostandardobjectscommand = require("./1-19-add-missing-system-fields-to-standard-objects.command");
const _119backfillmessagechannelmessageassociationmessagefoldercommand = require("./1-19-backfill-message-channel-message-association-message-folder.command");
const _119backfillmissingstandardviewscommand = require("./1-19-backfill-missing-standard-views.command");
const _119backfillsystemfieldsissystemcommand = require("./1-19-backfill-system-fields-is-system.command");
const _119fixinvalidstandarduniversalidentifierscommand = require("./1-19-fix-invalid-standard-universal-identifiers.command");
const _119seedserveridcommand = require("./1-19-seed-server-id.command");
const _applicationmodule = require("../../../../engine/core-modules/application/application.module");
const _featureflagmodule = require("../../../../engine/core-modules/feature-flag/feature-flag.module");
const _workspaceentity = require("../../../../engine/core-modules/workspace/workspace.entity");
const _datasourcemodule = require("../../../../engine/metadata-modules/data-source/data-source.module");
const _workspacemetadataversionmodule = require("../../../../engine/metadata-modules/workspace-metadata-version/workspace-metadata-version.module");
const _workspacecachestoragemodule = require("../../../../engine/workspace-cache-storage/workspace-cache-storage.module");
const _workspacecachemodule = require("../../../../engine/workspace-cache/workspace-cache.module");
const _workspacemigrationrunnermodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/workspace-migration-runner.module");
const _workspacemigrationmodule = require("../../../../engine/workspace-manager/workspace-migration/workspace-migration.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let V1_19_UpgradeVersionCommandModule = class V1_19_UpgradeVersionCommandModule {
};
V1_19_UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity
            ]),
            _datasourcemodule.DataSourceModule,
            _workspacecachemodule.WorkspaceCacheModule,
            _workspacecachestoragemodule.WorkspaceCacheStorageModule,
            _workspacemetadataversionmodule.WorkspaceMetadataVersionModule,
            _workspacemigrationrunnermodule.WorkspaceMigrationRunnerModule,
            _applicationmodule.ApplicationModule,
            _workspacemigrationmodule.WorkspaceMigrationModule,
            _featureflagmodule.FeatureFlagModule
        ],
        providers: [
            _119backfillsystemfieldsissystemcommand.BackfillSystemFieldsIsSystemCommand,
            _119addmissingsystemfieldstostandardobjectscommand.AddMissingSystemFieldsToStandardObjectsCommand,
            _119backfillmessagechannelmessageassociationmessagefoldercommand.BackfillMessageChannelMessageAssociationMessageFolderCommand,
            _119backfillmissingstandardviewscommand.BackfillMissingStandardViewsCommand,
            _119fixinvalidstandarduniversalidentifierscommand.FixInvalidStandardUniversalIdentifiersCommand,
            _119seedserveridcommand.SeedServerIdCommand
        ],
        exports: [
            _119backfillsystemfieldsissystemcommand.BackfillSystemFieldsIsSystemCommand,
            _119addmissingsystemfieldstostandardobjectscommand.AddMissingSystemFieldsToStandardObjectsCommand,
            _119backfillmessagechannelmessageassociationmessagefoldercommand.BackfillMessageChannelMessageAssociationMessageFolderCommand,
            _119backfillmissingstandardviewscommand.BackfillMissingStandardViewsCommand,
            _119fixinvalidstandarduniversalidentifierscommand.FixInvalidStandardUniversalIdentifiersCommand,
            _119seedserveridcommand.SeedServerIdCommand
        ]
    })
], V1_19_UpgradeVersionCommandModule);

//# sourceMappingURL=1-19-upgrade-version-command.module.js.map