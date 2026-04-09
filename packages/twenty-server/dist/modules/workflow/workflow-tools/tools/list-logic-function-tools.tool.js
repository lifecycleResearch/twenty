"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createListLogicFunctionToolsTool", {
    enumerable: true,
    get: function() {
        return createListLogicFunctionToolsTool;
    }
});
const _utils = require("twenty-shared/utils");
const _zod = require("zod");
const listLogicFunctionToolsSchema = _zod.z.object({});
const createListLogicFunctionToolsTool = (deps, context)=>({
        name: 'list_logic_function_tools',
        description: 'List all logic functions marked as tools that can be added as LOGIC_FUNCTION steps in workflows. Returns their IDs, names, and descriptions.',
        inputSchema: listLogicFunctionToolsSchema,
        execute: async ()=>{
            const { flatLogicFunctionMaps } = await deps.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                workspaceId: context.workspaceId,
                flatMapsKeys: [
                    'flatLogicFunctionMaps'
                ]
            });
            const toolFunctions = Object.values(flatLogicFunctionMaps.byUniversalIdentifier).filter((fn)=>(0, _utils.isDefined)(fn) && fn.isTool === true && fn.deletedAt === null);
            return {
                success: true,
                logicFunctions: toolFunctions.map((fn)=>({
                        id: fn.id,
                        name: fn.name,
                        description: fn.description
                    }))
            };
        }
    });

//# sourceMappingURL=list-logic-function-tools.tool.js.map