"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImapMessageTextExtractorService", {
    enumerable: true,
    get: function() {
        return ImapMessageTextExtractorService;
    }
});
const _common = require("@nestjs/common");
const _dompurify = /*#__PURE__*/ _interop_require_default(require("dompurify"));
const _htmltotext = require("html-to-text");
const _jsdom = require("jsdom");
const _planer = /*#__PURE__*/ _interop_require_wildcard(require("planer"));
const _utils = require("twenty-shared/utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ImapMessageTextExtractorService = class ImapMessageTextExtractorService {
    extractTextWithoutReplyQuotations(parsed) {
        if (parsed.text) {
            const extractedText = _planer.extractFrom(parsed.text, 'text/plain');
            return (0, _utils.safeDecodeURIComponent)(extractedText);
        }
        if (parsed.html) {
            const sanitizedHtml = this.purify.sanitize(parsed.html);
            const cleanedHtml = _planer.extractFromHtml(sanitizedHtml, this.jsdomInstance.window.document);
            const text = (0, _htmltotext.convert)(cleanedHtml, {
                wordwrap: false,
                preserveNewlines: true
            }).trim();
            const processedText = text.replace(/\u00A0/g, ' ');
            return (0, _utils.safeDecodeURIComponent)(processedText);
        }
        return '';
    }
    constructor(){
        this.jsdomInstance = new _jsdom.JSDOM('');
        this.purify = (0, _dompurify.default)(this.jsdomInstance.window);
    }
};
ImapMessageTextExtractorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], ImapMessageTextExtractorService);

//# sourceMappingURL=imap-message-text-extractor.service.js.map