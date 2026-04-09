"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CoreMigrationRunnerService", {
    enumerable: true,
    get: function() {
        return CoreMigrationRunnerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
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
let CoreMigrationRunnerService = class CoreMigrationRunnerService {
    async run() {
        this.logger.log('Running core datasource migrations...');
        try {
            const migrations = await this.dataSource.runMigrations({
                transaction: 'each'
            });
            if (migrations.length === 0) {
                this.logger.log('No pending migrations');
            } else {
                this.logger.log(`Executed ${migrations.length} migration(s): ${migrations.map((migration)=>migration.name).join(', ')}`);
            }
            this.logger.log('Database migrations completed successfully');
        } catch (error) {
            this.logger.error('Error running database migrations:', error);
            throw error;
        }
    }
    constructor(dataSource){
        this.dataSource = dataSource;
        this.logger = new _common.Logger(CoreMigrationRunnerService.name);
    }
};
CoreMigrationRunnerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.DataSource === "undefined" ? Object : _typeorm1.DataSource
    ])
], CoreMigrationRunnerService);

//# sourceMappingURL=core-migration-runner.service.js.map