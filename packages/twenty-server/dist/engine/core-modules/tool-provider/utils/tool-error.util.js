"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get generateErrorSuggestion () {
        return generateErrorSuggestion;
    },
    get wrapWithErrorHandler () {
        return wrapWithErrorHandler;
    }
});
const generateErrorSuggestion = (_toolName, errorMessage)=>{
    const lowerError = errorMessage.toLowerCase();
    if (lowerError.includes('not found') || lowerError.includes('does not exist')) {
        return 'Verify the ID or name exists with a search query first';
    }
    if (lowerError.includes('permission') || lowerError.includes('forbidden') || lowerError.includes('unauthorized')) {
        return 'This operation requires elevated permissions or a different role';
    }
    if (lowerError.includes('invalid') || lowerError.includes('validation')) {
        return 'Check the tool schema for valid parameter formats and types';
    }
    if (lowerError.includes('duplicate') || lowerError.includes('already exists')) {
        return 'A record with this identifier already exists. Try updating instead of creating';
    }
    if (lowerError.includes('required') || lowerError.includes('missing')) {
        return 'Required fields are missing. Check which fields are mandatory for this operation';
    }
    return 'Try adjusting the parameters or using a different approach';
};
const wrapWithErrorHandler = (toolName, executeFn)=>{
    return async (args)=>{
        try {
            return await executeFn(args);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                success: false,
                error: {
                    message: errorMessage,
                    tool: toolName,
                    suggestion: generateErrorSuggestion(toolName, errorMessage)
                }
            };
        }
    };
};

//# sourceMappingURL=tool-error.util.js.map