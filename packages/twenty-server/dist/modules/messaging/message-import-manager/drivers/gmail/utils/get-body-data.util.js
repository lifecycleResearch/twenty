"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getBodyData", {
    enumerable: true,
    get: function() {
        return getBodyData;
    }
});
const getBodyData = (message)=>{
    const firstPart = message.payload?.parts?.[0];
    if (firstPart?.mimeType === 'text/plain') {
        return firstPart?.body?.data;
    }
    return firstPart?.parts?.find((part)=>part.mimeType === 'text/plain')?.body?.data;
};

//# sourceMappingURL=get-body-data.util.js.map