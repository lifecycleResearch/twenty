"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _jsonrpcerrorcodeconst = require("../../constants/json-rpc-error-code.const");
const _mcptoolexecutorservice = require("../mcp-tool-executor.service");
describe('McpToolExecutorService', ()=>{
    let service;
    beforeEach(()=>{
        service = new _mcptoolexecutorservice.McpToolExecutorService();
    });
    describe('handleToolsListing', ()=>{
        it('should return only tools array in result', ()=>{
            const toolSet = {
                test_tool: {
                    description: 'A test tool',
                    inputSchema: {
                        jsonSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string'
                                }
                            },
                            required: [
                                'query'
                            ]
                        }
                    }
                }
            };
            const result = service.handleToolsListing('123', toolSet);
            expect(result).toEqual({
                id: '123',
                jsonrpc: '2.0',
                result: {
                    tools: [
                        {
                            name: 'test_tool',
                            description: 'A test tool',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    query: {
                                        type: 'string'
                                    }
                                },
                                required: [
                                    'query'
                                ]
                            }
                        }
                    ]
                }
            });
        });
        it('should keep inputSchema unchanged when it is already a plain schema', ()=>{
            const toolSet = {
                plain_tool: {
                    description: 'A plain schema tool',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string'
                            }
                        }
                    }
                }
            };
            const result = service.handleToolsListing('456', toolSet);
            expect(result).toEqual({
                id: '456',
                jsonrpc: '2.0',
                result: {
                    tools: [
                        {
                            name: 'plain_tool',
                            description: 'A plain schema tool',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    ]
                }
            });
        });
    });
    describe('handleToolCall', ()=>{
        it('should return JSON-RPC error with INVALID_PARAMS for unknown tools', async ()=>{
            const toolSet = {};
            const result = await service.handleToolCall('123', toolSet, {
                name: 'nonexistent_tool',
                arguments: {}
            });
            expect(result).toEqual({
                id: '123',
                jsonrpc: '2.0',
                error: {
                    code: _jsonrpcerrorcodeconst.JSON_RPC_ERROR_CODE.INVALID_PARAMS,
                    message: 'Unknown tool: nonexistent_tool'
                }
            });
        });
        it('should return result with isError: false on success', async ()=>{
            const toolSet = {
                my_tool: {
                    execute: jest.fn().mockResolvedValue({
                        data: 'ok'
                    }),
                    description: 'My tool',
                    inputSchema: {
                        type: 'object'
                    }
                }
            };
            const result = await service.handleToolCall('123', toolSet, {
                name: 'my_tool',
                arguments: {}
            });
            expect(result).toEqual({
                id: '123',
                jsonrpc: '2.0',
                result: {
                    content: [
                        {
                            type: 'text',
                            text: '{"data":"ok"}'
                        }
                    ],
                    isError: false
                }
            });
        });
        it('should return result with isError: true when tool execution throws', async ()=>{
            const toolSet = {
                failing_tool: {
                    execute: jest.fn().mockRejectedValue(new Error('API rate limited')),
                    description: 'A tool that fails',
                    inputSchema: {
                        type: 'object'
                    }
                }
            };
            const result = await service.handleToolCall('123', toolSet, {
                name: 'failing_tool',
                arguments: {}
            });
            expect(result).toEqual({
                id: '123',
                jsonrpc: '2.0',
                result: {
                    content: [
                        {
                            type: 'text',
                            text: 'API rate limited'
                        }
                    ],
                    isError: true
                }
            });
        });
    });
});

//# sourceMappingURL=mcp-tool-executor.service.spec.js.map