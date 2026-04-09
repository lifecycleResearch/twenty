// Internal credits use micro-precision: $1 = 1,000,000 internal credits
// Display credits are 1000x coarser: $1 = 1,000 display credits
// This mirrors the "micro" pattern in payment systems (e.g. microdollars → dollars)
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
    get INTERNAL_CREDITS_PER_DISPLAY_CREDIT () {
        return INTERNAL_CREDITS_PER_DISPLAY_CREDIT;
    },
    get toDisplayCredits () {
        return toDisplayCredits;
    }
});
const INTERNAL_CREDITS_PER_DISPLAY_CREDIT = 1000;
const toDisplayCredits = (internalCredits)=>Math.round(internalCredits / INTERNAL_CREDITS_PER_DISPLAY_CREDIT * 10) / 10;

//# sourceMappingURL=to-display-credits.util.js.map