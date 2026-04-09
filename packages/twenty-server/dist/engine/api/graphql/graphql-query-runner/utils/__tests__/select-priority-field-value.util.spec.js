"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _selectpriorityfieldvalueutil = require("../select-priority-field-value.util");
describe('selectPriorityFieldValue', ()=>{
    it('should return priority record value when available', ()=>{
        const recordsWithValues = [
            {
                recordId: '1',
                value: 'priority value'
            },
            {
                recordId: '2',
                value: 'other value'
            }
        ];
        const result = (0, _selectpriorityfieldvalueutil.selectPriorityFieldValue)(recordsWithValues, '1');
        expect(result).toBe('priority value');
    });
    it('should throw error when priority record not found', ()=>{
        const recordsWithValues = [
            {
                recordId: '2',
                value: 'first value'
            },
            {
                recordId: '3',
                value: 'second value'
            }
        ];
        expect(()=>(0, _selectpriorityfieldvalueutil.selectPriorityFieldValue)(recordsWithValues, '1')).toThrow('Priority record with ID 1 not found in merge candidates');
    });
    it('should return null when priority record has no value', ()=>{
        const recordsWithValues = [
            {
                recordId: '1',
                value: null
            },
            {
                recordId: '2',
                value: 'fallback value'
            }
        ];
        const result = (0, _selectpriorityfieldvalueutil.selectPriorityFieldValue)(recordsWithValues, '1');
        expect(result).toBeNull();
    });
    it('should return null when priority record has empty string', ()=>{
        const recordsWithValues = [
            {
                recordId: '1',
                value: ''
            },
            {
                recordId: '2',
                value: 'fallback value'
            }
        ];
        const result = (0, _selectpriorityfieldvalueutil.selectPriorityFieldValue)(recordsWithValues, '1');
        expect(result).toBeNull();
    });
    it('should return null when priority record has undefined value', ()=>{
        const recordsWithValues = [
            {
                recordId: '1',
                value: undefined
            },
            {
                recordId: '2',
                value: 'fallback value'
            }
        ];
        const result = (0, _selectpriorityfieldvalueutil.selectPriorityFieldValue)(recordsWithValues, '1');
        expect(result).toBeNull();
    });
    it('should throw error when no records exist', ()=>{
        expect(()=>(0, _selectpriorityfieldvalueutil.selectPriorityFieldValue)([], '1')).toThrow('Priority record with ID 1 not found in merge candidates');
    });
    it('should handle complex object values', ()=>{
        const recordsWithValues = [
            {
                recordId: '1',
                value: {
                    name: 'priority object',
                    id: 1
                }
            },
            {
                recordId: '2',
                value: {
                    name: 'fallback object',
                    id: 2
                }
            }
        ];
        const result = (0, _selectpriorityfieldvalueutil.selectPriorityFieldValue)(recordsWithValues, '1');
        expect(result).toEqual({
            name: 'priority object',
            id: 1
        });
    });
});

//# sourceMappingURL=select-priority-field-value.util.spec.js.map