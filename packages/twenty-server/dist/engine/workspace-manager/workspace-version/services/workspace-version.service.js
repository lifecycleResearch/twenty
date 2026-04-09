"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceVersionService", {
    enumerable: true,
    get: function() {
        return WorkspaceVersionService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _workspaceentity = require("../../../core-modules/workspace/workspace.entity");
const _compareversionminorandmajor = require("../../../../utils/version/compare-version-minor-and-major");
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
let WorkspaceVersionService = class WorkspaceVersionService {
    async hasActiveOrSuspendedWorkspaces() {
        return this.workspaceRepository.exists({
            where: {
                activationStatus: (0, _typeorm1.In)([
                    _workspace.WorkspaceActivationStatus.ACTIVE,
                    _workspace.WorkspaceActivationStatus.SUSPENDED
                ])
            }
        });
    }
    async getWorkspacesBelowVersion(version) {
        const allActiveOrSuspendedWorkspaces = await this.loadActiveOrSuspendedWorkspaces();
        if (allActiveOrSuspendedWorkspaces.length === 0) {
            this.logger.log('No workspaces found. Running migrations for fresh installation.');
            return [];
        }
        return allActiveOrSuspendedWorkspaces.filter((workspace)=>{
            if (!(0, _utils.isDefined)(workspace.version)) {
                return true;
            }
            try {
                const versionCompareResult = (0, _compareversionminorandmajor.compareVersionMajorAndMinor)(workspace.version, version);
                return versionCompareResult === 'lower';
            } catch (error) {
                this.logger.error(`Error checking workspace ${workspace.id} version: ${error.message}`);
                return true;
            }
        });
    }
    async loadActiveOrSuspendedWorkspaces() {
        return this.workspaceRepository.find({
            select: [
                'id',
                'version',
                'displayName'
            ],
            where: {
                activationStatus: (0, _typeorm1.In)([
                    _workspace.WorkspaceActivationStatus.ACTIVE,
                    _workspace.WorkspaceActivationStatus.SUSPENDED
                ])
            },
            order: {
                id: 'ASC'
            }
        });
    }
    constructor(workspaceRepository){
        this.workspaceRepository = workspaceRepository;
        this.logger = new _common.Logger(WorkspaceVersionService.name);
    }
};
WorkspaceVersionService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], WorkspaceVersionService);

//# sourceMappingURL=workspace-version.service.js.map