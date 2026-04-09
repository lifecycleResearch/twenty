"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceApplicationVariableMapCacheService", {
    enumerable: true,
    get: function() {
        return WorkspaceApplicationVariableMapCacheService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _utils = require("twenty-shared/utils");
const _workspacecacheproviderservice = require("../../../workspace-cache/interfaces/workspace-cache-provider.service");
const _applicationvariableentity = require("./application-variable.entity");
const _fromapplicationvariableentitytoflatapplicationvariableutil = require("./utils/from-application-variable-entity-to-flat-application-variable.util");
const _workspacecachedecorator = require("../../../workspace-cache/decorators/workspace-cache.decorator");
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
let WorkspaceApplicationVariableMapCacheService = class WorkspaceApplicationVariableMapCacheService extends _workspacecacheproviderservice.WorkspaceCacheProvider {
    async computeForCache(workspaceId) {
        const applicationVariableEntities = await this.applicationVariableRepository.createQueryBuilder('applicationVariable').innerJoin('applicationVariable.application', 'application').where('application.workspaceId = :workspaceId', {
            workspaceId
        }).getMany();
        const applicationVariableMaps = {
            byId: {},
            byApplicationId: {}
        };
        for (const entity of applicationVariableEntities){
            const flatApplicationVariable = (0, _fromapplicationvariableentitytoflatapplicationvariableutil.fromApplicationVariableEntityToFlatApplicationVariable)(entity);
            applicationVariableMaps.byId[flatApplicationVariable.id] = flatApplicationVariable;
            if (!(0, _utils.isDefined)(flatApplicationVariable.applicationId)) {
                continue;
            }
            if (!(0, _utils.isDefined)(applicationVariableMaps.byApplicationId[flatApplicationVariable.applicationId])) {
                applicationVariableMaps.byApplicationId[flatApplicationVariable.applicationId] = [
                    flatApplicationVariable
                ];
                continue;
            }
            applicationVariableMaps.byApplicationId[flatApplicationVariable.applicationId]?.push(flatApplicationVariable);
        }
        return applicationVariableMaps;
    }
    constructor(applicationVariableRepository){
        super(), this.applicationVariableRepository = applicationVariableRepository;
    }
};
WorkspaceApplicationVariableMapCacheService = _ts_decorate([
    (0, _common.Injectable)(),
    (0, _workspacecachedecorator.WorkspaceCache)('applicationVariableMaps'),
    _ts_param(0, (0, _typeorm.InjectRepository)(_applicationvariableentity.ApplicationVariableEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], WorkspaceApplicationVariableMapCacheService);

//# sourceMappingURL=workspace-application-variable-map-cache.service.js.map