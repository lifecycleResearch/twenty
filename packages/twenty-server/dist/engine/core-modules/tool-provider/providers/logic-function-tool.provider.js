"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LogicFunctionToolProvider", {
    enumerable: true,
    get: function() {
        return LogicFunctionToolProvider;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _logicfunction = require("twenty-shared/logic-function");
const _toolcategoryenum = require("../enums/tool-category.enum");
const _workspacemanyorallflatentitymapscacheservice = require("../../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LogicFunctionToolProvider = class LogicFunctionToolProvider {
    async isAvailable(_context) {
        return true;
    }
    async generateDescriptors(context, options) {
        const includeSchemas = options?.includeSchemas ?? true;
        const { flatLogicFunctionMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId: context.workspaceId,
            flatMapsKeys: [
                'flatLogicFunctionMaps'
            ]
        });
        const logicFunctionsWithSchema = Object.values(flatLogicFunctionMaps.byUniversalIdentifier).filter((fn)=>(0, _utils.isDefined)(fn) && fn.isTool === true && fn.deletedAt === null);
        const descriptors = [];
        for (const logicFunction of logicFunctionsWithSchema){
            const toolName = this.buildLogicFunctionToolName(logicFunction.name);
            const base = {
                name: toolName,
                description: logicFunction.description || `Execute the ${logicFunction.name} logic function`,
                category: _toolcategoryenum.ToolCategory.LOGIC_FUNCTION,
                executionRef: {
                    kind: 'logic_function',
                    logicFunctionId: logicFunction.id
                }
            };
            if (includeSchemas) {
                // Logic functions already store JSON Schema -- use it directly
                const inputSchema = logicFunction.toolInputSchema ?? _logicfunction.DEFAULT_TOOL_INPUT_SCHEMA;
                descriptors.push({
                    ...base,
                    inputSchema
                });
            } else {
                descriptors.push(base);
            }
        }
        return descriptors;
    }
    buildLogicFunctionToolName(functionName) {
        return `logic_function_${functionName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')}`;
    }
    constructor(flatEntityMapsCacheService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
        this.category = _toolcategoryenum.ToolCategory.LOGIC_FUNCTION;
    }
};
LogicFunctionToolProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], LogicFunctionToolProvider);

//# sourceMappingURL=logic-function-tool.provider.js.map