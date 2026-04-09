// GraphQL schema execution automatically returns null for nullable fields
// that are missing from the resolved object. Since direct execution bypasses
// schema resolution, we need to explicitly set requested-but-missing fields
// to null so the response shape matches what GraphQL would produce.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "graphQLBackfillNullsFromSelectedFields", {
    enumerable: true,
    get: function() {
        return graphQLBackfillNullsFromSelectedFields;
    }
});
const graphQLBackfillNullsFromSelectedFields = (result, selectedFields)=>{
    if (result === null || result === undefined || typeof result !== 'object') {
        return result;
    }
    if (Array.isArray(result)) {
        return result.map((item)=>graphQLBackfillNullsFromSelectedFields(item, selectedFields));
    }
    const record = result;
    for (const [key, subFields] of Object.entries(selectedFields)){
        if (!(key in record)) {
            record[key] = null;
            continue;
        }
        const hasNestedFields = subFields && typeof subFields === 'object' && Object.keys(subFields).length > 0;
        if (!hasNestedFields || record[key] === null || record[key] === undefined) {
            continue;
        }
        if (Array.isArray(record[key])) {
            record[key] = record[key].map((item)=>graphQLBackfillNullsFromSelectedFields(item, subFields));
        } else if (typeof record[key] === 'object') {
            graphQLBackfillNullsFromSelectedFields(record[key], subFields);
        }
    }
    return result;
};

//# sourceMappingURL=graphql-backfill-nulls-from-selected-fields.util.js.map