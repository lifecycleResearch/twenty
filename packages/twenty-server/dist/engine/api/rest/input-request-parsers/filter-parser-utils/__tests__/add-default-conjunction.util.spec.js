"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _adddefaultconjunctionutil = require("../add-default-conjunction.util");
describe('addDefaultConjunctionIfMissing', ()=>{
    it('should add default conjunction if missing', ()=>{
        expect((0, _adddefaultconjunctionutil.addDefaultConjunctionIfMissing)('field[eq]:1')).toEqual('and(field[eq]:1)');
    });
    it('should not add default conjunction if not missing', ()=>{
        expect((0, _adddefaultconjunctionutil.addDefaultConjunctionIfMissing)('and(field[eq]:1)')).toEqual('and(field[eq]:1)');
    });
});

//# sourceMappingURL=add-default-conjunction.util.spec.js.map