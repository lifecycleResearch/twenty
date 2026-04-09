"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountDeleteOnePreQueryHook", {
    enumerable: true,
    get: function() {
        return ConnectedAccountDeleteOnePreQueryHook;
    }
});
const _utils = require("twenty-shared/utils");
const _metadata = require("twenty-shared/metadata");
const _databaseeventaction = require("../../../engine/api/graphql/graphql-query-runner/enums/database-event-action");
const _workspacequeryhookdecorator = require("../../../engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator");
const _workspaceexception = require("../../../engine/core-modules/workspace/workspace.exception");
const _workspacemanyorallflatentitymapscacheservice = require("../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyuniversalidentifierorthrowutil = require("../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier-or-throw.util");
const _messagechanneldataaccessservice = require("../../../engine/metadata-modules/message-channel/data-access/services/message-channel-data-access.service");
const _globalworkspaceormmanager = require("../../../engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager");
const _workspaceeventemitter = require("../../../engine/workspace-event-emitter/workspace-event-emitter");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ConnectedAccountDeleteOnePreQueryHook = class ConnectedAccountDeleteOnePreQueryHook {
    async execute(authContext, _objectName, payload) {
        const connectedAccountId = payload.id;
        const workspace = authContext.workspace;
        (0, _utils.assertIsDefinedOrThrow)(workspace, _workspaceexception.WorkspaceNotFoundDefaultError);
        const messageChannels = await this.globalWorkspaceOrmManager.executeInWorkspaceContext(async ()=>{
            return this.messageChannelDataAccessService.find(workspace.id, {
                connectedAccountId
            });
        }, authContext);
        const { flatObjectMetadataMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId: workspace.id,
            flatMapsKeys: [
                'flatObjectMetadataMaps'
            ]
        });
        const flatObjectMetadata = (0, _findflatentitybyuniversalidentifierorthrowutil.findFlatEntityByUniversalIdentifierOrThrow)({
            flatEntityMaps: flatObjectMetadataMaps,
            universalIdentifier: _metadata.STANDARD_OBJECTS.messageChannel.universalIdentifier
        });
        // TODO: handle cascade events for delete
        this.workspaceEventEmitter.emitDatabaseBatchEvent({
            objectMetadataNameSingular: 'messageChannel',
            action: _databaseeventaction.DatabaseEventAction.DESTROYED,
            objectMetadata: flatObjectMetadata,
            events: messageChannels.map((messageChannel)=>({
                    recordId: messageChannel.id,
                    properties: {
                        before: messageChannel
                    }
                })),
            workspaceId: workspace.id
        });
        return payload;
    }
    constructor(globalWorkspaceOrmManager, messageChannelDataAccessService, workspaceEventEmitter, workspaceManyOrAllFlatEntityMapsCacheService){
        this.globalWorkspaceOrmManager = globalWorkspaceOrmManager;
        this.messageChannelDataAccessService = messageChannelDataAccessService;
        this.workspaceEventEmitter = workspaceEventEmitter;
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
    }
};
ConnectedAccountDeleteOnePreQueryHook = _ts_decorate([
    (0, _workspacequeryhookdecorator.WorkspaceQueryHook)(`connectedAccount.destroyOne`),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _globalworkspaceormmanager.GlobalWorkspaceOrmManager === "undefined" ? Object : _globalworkspaceormmanager.GlobalWorkspaceOrmManager,
        typeof _messagechanneldataaccessservice.MessageChannelDataAccessService === "undefined" ? Object : _messagechanneldataaccessservice.MessageChannelDataAccessService,
        typeof _workspaceeventemitter.WorkspaceEventEmitter === "undefined" ? Object : _workspaceeventemitter.WorkspaceEventEmitter,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], ConnectedAccountDeleteOnePreQueryHook);

//# sourceMappingURL=connected-account-delete-one.pre-query.hook.js.map