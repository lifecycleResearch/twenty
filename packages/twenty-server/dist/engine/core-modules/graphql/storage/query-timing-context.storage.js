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
    get isQueryTimingEnabled () {
        return isQueryTimingEnabled;
    },
    get queryTimingContextStorage () {
        return queryTimingContextStorage;
    }
});
const _async_hooks = require("async_hooks");
const queryTimingContextStorage = new _async_hooks.AsyncLocalStorage();
const isQueryTimingEnabled = ()=>queryTimingContextStorage.getStore() === true;

//# sourceMappingURL=query-timing-context.storage.js.map