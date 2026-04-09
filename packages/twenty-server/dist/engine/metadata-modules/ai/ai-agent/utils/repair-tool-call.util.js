"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "repairToolCall", {
    enumerable: true,
    get: function() {
        return repairToolCall;
    }
});
const _ai = require("ai");
const _aitelemetryconst = require("../../ai-models/constants/ai-telemetry.const");
const repairToolCall = async ({ toolCall, tools, inputSchema, error, model })=>{
    // Don't attempt to fix invalid tool names
    if (_ai.NoSuchToolError.isInstance(error)) {
        return null;
    }
    const tool = tools[toolCall.toolName];
    if (!tool || typeof tool !== 'object' || !('inputSchema' in tool)) {
        return null;
    }
    const schema = inputSchema(toolCall);
    if (!schema || typeof schema !== 'object') {
        return null;
    }
    try {
        const { output: repairedInput } = await (0, _ai.generateText)({
            model,
            output: _ai.Output.object({
                schema: schema
            }),
            prompt: [
                `The AI model attempted to call the tool "${toolCall.toolName}" with invalid input.`,
                ``,
                `Input provided:`,
                JSON.stringify(toolCall.input, null, 2),
                ``,
                `Error encountered:`,
                error.message,
                ``,
                `Please fix the input to exactly match the required schema.`,
                `Pay special attention to:`,
                `- Enum values must match exactly (e.g., "DescNullsLast" not "desc")`,
                `- Object structures must match the schema shape`,
                `- Array items must follow the specified format`
            ].join('\n'),
            experimental_telemetry: _aitelemetryconst.AI_TELEMETRY_CONFIG
        });
        if (repairedInput == null) {
            return null;
        }
        return {
            type: 'tool-call',
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            input: JSON.stringify(repairedInput)
        };
    } catch  {
        // If repair fails, return null to let the error propagate
        return null;
    }
};

//# sourceMappingURL=repair-tool-call.util.js.map