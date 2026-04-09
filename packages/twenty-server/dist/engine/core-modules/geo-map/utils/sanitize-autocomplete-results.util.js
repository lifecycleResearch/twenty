"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizeAutocompleteResults", {
    enumerable: true,
    get: function() {
        return sanitizeAutocompleteResults;
    }
});
const sanitizeAutocompleteResults = (autocompleteResults)=>{
    if (!Array.isArray(autocompleteResults) || autocompleteResults.length === 0) return [];
    return autocompleteResults.map((result)=>({
            text: result.description,
            placeId: result.place_id
        }));
};

//# sourceMappingURL=sanitize-autocomplete-results.util.js.map