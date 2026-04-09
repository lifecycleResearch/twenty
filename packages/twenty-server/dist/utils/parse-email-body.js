"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseEmailBody", {
    enumerable: true,
    get: function() {
        return parseEmailBody;
    }
});
const parseEmailBody = (body)=>{
    try {
        const json = JSON.parse(body);
        return json;
    } catch  {
        return body;
    }
};

//# sourceMappingURL=parse-email-body.js.map