"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "McpToolExecutorService", {
    enumerable: true,
    get: function() {
        return McpToolExecutorService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _jsonrpcerrorcodeconst = require("../constants/json-rpc-error-code.const");
const _wrapjsonrpcresponseutil = require("../utils/wrap-jsonrpc-response.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let McpToolExecutorService = class McpToolExecutorService {
    async handleToolCall(id, toolSet, params) {
        const toolName = params.name;
        const tool = toolSet[toolName];
        if (!(0, _utils.isDefined)(tool) || !(0, _utils.isDefined)(tool.execute)) {
            return (0, _wrapjsonrpcresponseutil.wrapJsonRpcResponse)(id, {
                error: {
                    code: _jsonrpcerrorcodeconst.JSON_RPC_ERROR_CODE.INVALID_PARAMS,
                    message: `Unknown tool: ${String(params.name)}`
                }
            });
        }
        try {
            const result = await tool.execute(params.arguments, {
                toolCallId: '1',
                messages: []
            });
            return (0, _wrapjsonrpcresponseutil.wrapJsonRpcResponse)(id, {
                result: {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result)
                        }
                    ],
                    isError: false
                }
            });
        } catch (executionError) {
            return (0, _wrapjsonrpcresponseutil.wrapJsonRpcResponse)(id, {
                result: {
                    content: [
                        {
                            type: 'text',
                            text: executionError instanceof Error ? executionError.message : 'Tool execution failed'
                        }
                    ],
                    isError: true
                }
            });
        }
    }
    handleToolsListing(id, toolSet) {
        const toolsArray = Object.entries(toolSet).filter(([, def])=>!!def.inputSchema).map(([name, def])=>{
            // Unwrap the AI SDK's jsonSchema wrapper if present
            // The AI SDK serializes schemas as { jsonSchema: {...} } but MCP expects {...} directly
            const inputSchema = def.inputSchema;
            const unwrappedSchema = inputSchema && typeof inputSchema === 'object' && 'jsonSchema' in inputSchema ? inputSchema.jsonSchema : inputSchema;
            return {
                name,
                description: def.description,
                inputSchema: unwrappedSchema
            };
        });
        return (0, _wrapjsonrpcresponseutil.wrapJsonRpcResponse)(id, {
            result: {
                tools: toolsArray
            }
        });
    }
};
McpToolExecutorService = _ts_decorate([
    (0, _common.Injectable)()
], McpToolExecutorService);

//# sourceMappingURL=mcp-tool-executor.service.js.map