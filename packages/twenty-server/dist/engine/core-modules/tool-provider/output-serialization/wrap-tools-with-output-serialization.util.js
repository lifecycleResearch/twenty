"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "wrapToolsWithOutputSerialization", {
    enumerable: true,
    get: function() {
        return wrapToolsWithOutputSerialization;
    }
});
const _compacttooloutpututil = require("./compact-tool-output.util");
const wrapToolsWithOutputSerialization = (tools)=>{
    const wrappedTools = {};
    for (const [toolName, tool] of Object.entries(tools)){
        if (!tool.execute) {
            wrappedTools[toolName] = tool;
            continue;
        }
        const originalExecute = tool.execute;
        wrappedTools[toolName] = {
            ...tool,
            execute: async (...args)=>{
                const result = await originalExecute(...args);
                return (0, _compacttooloutpututil.compactToolOutput)(result);
            }
        };
    }
    return wrappedTools;
};

//# sourceMappingURL=wrap-tools-with-output-serialization.util.js.map