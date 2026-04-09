"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RestApiException", {
    enumerable: true,
    get: function() {
        return RestApiException;
    }
});
const _common = require("@nestjs/common");
const formatMessage = (error)=>{
    let formattedMessage = error.extensions ? error.extensions.response?.error || error.extensions.response || error.message : error.error || error.message;
    formattedMessage = formattedMessage.replace(/"/g, "'").replace("Variable '$data' got i", 'I').replace("Variable '$input' got i", 'I');
    const regex = /Field '[^']+' is not defined by type .*/;
    const match = formattedMessage.match(regex);
    if (match) {
        formattedMessage = match[0];
    }
    return formattedMessage;
};
let RestApiException = class RestApiException extends _common.BadRequestException {
    constructor(errors){
        super({
            statusCode: 400,
            messages: errors.map((error)=>formatMessage(error)),
            error: 'Bad Request'
        });
    }
};

//# sourceMappingURL=RestApiException.js.map