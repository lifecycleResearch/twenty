"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ToolExecutorService", {
    enumerable: true,
    get: function() {
        return ToolExecutorService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _fromuserentitytoflatutil = require("../../user/utils/from-user-entity-to-flat.util");
const _authexception = require("../../auth/auth.exception");
const _builduserauthcontextutil = require("../../auth/utils/build-user-auth-context.util");
const _logicfunctionexecutorservice = require("../../logic-function/logic-function-executor/logic-function-executor.service");
const _createmanyrecordsservice = require("../../record-crud/services/create-many-records.service");
const _createrecordservice = require("../../record-crud/services/create-record.service");
const _deleterecordservice = require("../../record-crud/services/delete-record.service");
const _findrecordsservice = require("../../record-crud/services/find-records.service");
const _updatemanyrecordsservice = require("../../record-crud/services/update-many-records.service");
const _updaterecordservice = require("../../record-crud/services/update-record.service");
const _wraptoolforexecutionutil = require("../../tool/utils/wrap-tool-for-execution.util");
const _userentity = require("../../user/user.entity");
const _workspacecacheservice = require("../../../workspace-cache/services/workspace-cache.service");
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
let ToolExecutorService = class ToolExecutorService {
    registerStaticHandler(toolId, handler) {
        this.staticToolHandlers.set(toolId, handler);
    }
    registerCategoryGenerator(category, generator) {
        this.categoryGenerators.set(category, generator);
    }
    async dispatch(descriptor, args, context) {
        const cleanArgs = (0, _wraptoolforexecutionutil.stripLoadingMessage)(args);
        switch(descriptor.executionRef.kind){
            case 'database_crud':
                return this.dispatchDatabaseCrud(descriptor.executionRef, cleanArgs, context);
            case 'static':
                return this.dispatchStaticTool(descriptor, cleanArgs, context);
            case 'logic_function':
                return this.dispatchLogicFunction(descriptor.executionRef, cleanArgs, context);
        }
    }
    async dispatchDatabaseCrud(ref, args, context) {
        const authContext = context.authContext ?? await this.buildAuthContext(context);
        switch(ref.operation){
            case 'find':
                {
                    const { limit, offset, orderBy, ...filter } = args;
                    return this.findRecordsService.execute({
                        objectName: ref.objectNameSingular,
                        filter,
                        orderBy: orderBy,
                        limit: limit,
                        offset: offset,
                        authContext,
                        rolePermissionConfig: context.rolePermissionConfig
                    });
                }
            case 'find_one':
                return this.findRecordsService.execute({
                    objectName: ref.objectNameSingular,
                    filter: {
                        id: {
                            eq: args.id
                        }
                    },
                    limit: 1,
                    authContext,
                    rolePermissionConfig: context.rolePermissionConfig
                });
            case 'create':
                return this.createRecordService.execute({
                    objectName: ref.objectNameSingular,
                    objectRecord: args,
                    authContext,
                    rolePermissionConfig: context.rolePermissionConfig,
                    createdBy: context.actorContext,
                    slimResponse: true
                });
            case 'create_many':
                return this.createManyRecordsService.execute({
                    objectName: ref.objectNameSingular,
                    objectRecords: args.records,
                    authContext,
                    rolePermissionConfig: context.rolePermissionConfig,
                    createdBy: context.actorContext,
                    slimResponse: true
                });
            case 'update':
                {
                    const { id, ...fields } = args;
                    const objectRecord = Object.fromEntries(Object.entries(fields).filter(([, value])=>value !== undefined));
                    return this.updateRecordService.execute({
                        objectName: ref.objectNameSingular,
                        objectRecordId: id,
                        objectRecord,
                        authContext,
                        rolePermissionConfig: context.rolePermissionConfig,
                        slimResponse: true
                    });
                }
            case 'update_many':
                return this.updateManyRecordsService.execute({
                    objectName: ref.objectNameSingular,
                    filter: args.filter,
                    data: args.data,
                    authContext,
                    rolePermissionConfig: context.rolePermissionConfig,
                    slimResponse: true
                });
            case 'delete':
                return this.deleteRecordService.execute({
                    objectName: ref.objectNameSingular,
                    objectRecordId: args.id,
                    authContext,
                    rolePermissionConfig: context.rolePermissionConfig,
                    soft: true
                });
            default:
                throw new Error(`Unknown database_crud operation: ${ref.operation}`);
        }
    }
    async dispatchStaticTool(descriptor, args, context) {
        if (descriptor.executionRef.kind !== 'static') {
            throw new Error('Expected static executionRef');
        }
        // Per-tool handler first (action tools)
        const handler = this.staticToolHandlers.get(descriptor.executionRef.toolId);
        if (handler) {
            return handler.execute(args, context);
        }
        // Category-level generator fallback (workflow, view, dashboard, metadata)
        const generator = this.categoryGenerators.get(descriptor.category);
        if (!generator) {
            throw new Error(`No handler or generator for static tool: ${descriptor.executionRef.toolId}`);
        }
        const toolSet = await generator(context);
        const tool = toolSet[descriptor.name];
        if (!tool?.execute) {
            throw new Error(`Tool ${descriptor.name} not found in generated ToolSet for category ${descriptor.category}`);
        }
        // The tool's execute expects (args, ToolExecutionOptions). Pass args with
        // a dummy loadingMessage since the tool's internal strip is harmless.
        return tool.execute({
            loadingMessage: '',
            ...args
        }, {
            toolCallId: '',
            messages: []
        });
    }
    async dispatchLogicFunction(ref, args, context) {
        const result = await this.logicFunctionExecutorService.execute({
            logicFunctionId: ref.logicFunctionId,
            workspaceId: context.workspaceId,
            payload: args
        });
        if (result.error) {
            return {
                success: false,
                error: result.error.errorMessage
            };
        }
        return {
            success: true,
            result: result.data
        };
    }
    // Build authContext on demand for database CRUD operations
    async buildAuthContext(context) {
        if (!(0, _utils.isDefined)(context.userId) || !(0, _utils.isDefined)(context.userWorkspaceId)) {
            throw new _authexception.AuthException('userId and userWorkspaceId are required for database operations', _authexception.AuthExceptionCode.UNAUTHENTICATED);
        }
        const user = await this.userRepository.findOne({
            where: {
                id: context.userId
            }
        });
        if (!(0, _utils.isDefined)(user)) {
            throw new _authexception.AuthException('User not found', _authexception.AuthExceptionCode.UNAUTHENTICATED);
        }
        const { flatWorkspaceMemberMaps } = await this.workspaceCacheService.getOrRecompute(context.workspaceId, [
            'flatWorkspaceMemberMaps'
        ]);
        const workspaceMemberId = flatWorkspaceMemberMaps.idByUserId[user.id];
        const workspaceMember = (0, _utils.isDefined)(workspaceMemberId) ? flatWorkspaceMemberMaps.byId[workspaceMemberId] : undefined;
        if (!(0, _utils.isDefined)(workspaceMemberId) || !(0, _utils.isDefined)(workspaceMember)) {
            throw new _authexception.AuthException('Workspace member not found', _authexception.AuthExceptionCode.UNAUTHENTICATED);
        }
        return (0, _builduserauthcontextutil.buildUserAuthContext)({
            workspace: {
                id: context.workspaceId
            },
            userWorkspaceId: context.userWorkspaceId,
            user: (0, _fromuserentitytoflatutil.fromUserEntityToFlat)(user),
            workspaceMemberId,
            workspaceMember
        });
    }
    constructor(findRecordsService, createRecordService, createManyRecordsService, updateRecordService, updateManyRecordsService, deleteRecordService, logicFunctionExecutorService, workspaceCacheService, userRepository){
        this.findRecordsService = findRecordsService;
        this.createRecordService = createRecordService;
        this.createManyRecordsService = createManyRecordsService;
        this.updateRecordService = updateRecordService;
        this.updateManyRecordsService = updateManyRecordsService;
        this.deleteRecordService = deleteRecordService;
        this.logicFunctionExecutorService = logicFunctionExecutorService;
        this.workspaceCacheService = workspaceCacheService;
        this.userRepository = userRepository;
        this.logger = new _common.Logger(ToolExecutorService.name);
        // Per-tool handlers (action tools, etc.)
        this.staticToolHandlers = new Map();
        // Category-level ToolSet generators (workflow, view, dashboard, metadata)
        this.categoryGenerators = new Map();
    }
};
ToolExecutorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(8, (0, _typeorm.InjectRepository)(_userentity.UserEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _findrecordsservice.FindRecordsService === "undefined" ? Object : _findrecordsservice.FindRecordsService,
        typeof _createrecordservice.CreateRecordService === "undefined" ? Object : _createrecordservice.CreateRecordService,
        typeof _createmanyrecordsservice.CreateManyRecordsService === "undefined" ? Object : _createmanyrecordsservice.CreateManyRecordsService,
        typeof _updaterecordservice.UpdateRecordService === "undefined" ? Object : _updaterecordservice.UpdateRecordService,
        typeof _updatemanyrecordsservice.UpdateManyRecordsService === "undefined" ? Object : _updatemanyrecordsservice.UpdateManyRecordsService,
        typeof _deleterecordservice.DeleteRecordService === "undefined" ? Object : _deleterecordservice.DeleteRecordService,
        typeof _logicfunctionexecutorservice.LogicFunctionExecutorService === "undefined" ? Object : _logicfunctionexecutorservice.LogicFunctionExecutorService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], ToolExecutorService);

//# sourceMappingURL=tool-executor.service.js.map