"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpgradeVersionCommandModule", {
    enumerable: true,
    get: function() {
        return UpgradeVersionCommandModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _119upgradeversioncommandmodule = require("./1-19/1-19-upgrade-version-command.module");
const _120upgradeversioncommandmodule = require("./1-20/1-20-upgrade-version-command.module");
const _upgradecommand = require("./upgrade.command");
const _coreengineversionmodule = require("../../../engine/core-engine-version/core-engine-version.module");
const _coremigrationrunnermodule = require("../core-migration-runner/core-migration-runner.module");
const _workspaceentity = require("../../../engine/core-modules/workspace/workspace.entity");
const _datasourcemodule = require("../../../engine/metadata-modules/data-source/data-source.module");
const _workspaceversionmodule = require("../../../engine/workspace-manager/workspace-version/workspace-version.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UpgradeVersionCommandModule = class UpgradeVersionCommandModule {
};
UpgradeVersionCommandModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity
            ]),
            _119upgradeversioncommandmodule.V1_19_UpgradeVersionCommandModule,
            _120upgradeversioncommandmodule.V1_20_UpgradeVersionCommandModule,
            _datasourcemodule.DataSourceModule,
            _coreengineversionmodule.CoreEngineVersionModule,
            _coremigrationrunnermodule.CoreMigrationRunnerModule,
            _workspaceversionmodule.WorkspaceVersionModule
        ],
        providers: [
            _upgradecommand.UpgradeCommand
        ]
    })
], UpgradeVersionCommandModule);

//# sourceMappingURL=upgrade-version-command.module.js.map