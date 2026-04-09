"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "callWithTimeout", {
    enumerable: true,
    get: function() {
        return callWithTimeout;
    }
});
const callWithTimeout = async ({ callback, timeoutMs })=>{
    return Promise.race([
        callback(),
        new Promise((_, reject)=>setTimeout(()=>reject(new Error('Execution timed out')), timeoutMs))
    ]);
};

//# sourceMappingURL=call-with-timeout.js.map