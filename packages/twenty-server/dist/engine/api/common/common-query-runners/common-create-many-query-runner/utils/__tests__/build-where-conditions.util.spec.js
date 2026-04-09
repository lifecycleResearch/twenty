"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildwhereconditionsutil = require("../build-where-conditions.util");
describe('buildWhereConditions', ()=>{
    const records = [
        {
            id: 'record-1',
            uniqueText: 'alpha',
            emailsField: {
                primaryEmail: 'alpha@example.com'
            }
        },
        {
            id: 'record-2',
            uniqueText: 'beta',
            emailsField: {
                primaryEmail: 'beta@example.com'
            }
        },
        {
            id: 'record-3',
            // uniqueText intentionally missing to validate filtering of undefined
            emailsField: {
                primaryEmail: undefined
            }
        }
    ];
    it('returns empty array when no conflicting fields provided', ()=>{
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)(records, []);
        expect(where).toEqual([]);
    });
    it('builds a single where condition for a flat field using all defined values', ()=>{
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)(records, [
            {
                baseField: 'uniqueText',
                fullPath: 'uniqueText',
                column: 'uniqueText'
            }
        ]);
        expect(where).toHaveLength(1);
        const condition = where[0];
        expect(Object.keys(condition)).toEqual([
            'uniqueText'
        ]);
        const operator = condition.uniqueText;
        expect(operator.type.toLowerCase()).toBe('in');
        expect(operator.value).toEqual([
            'alpha',
            'beta'
        ]);
    });
    it('skips adding a condition when all values for a field are undefined', ()=>{
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)([
            {
                id: '1'
            },
            {
                id: '2'
            }
        ], [
            {
                baseField: 'uniqueText',
                fullPath: 'uniqueText',
                column: 'uniqueText'
            }
        ]);
        expect(where).toEqual([]);
    });
    it('builds conditions for nested paths', ()=>{
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)(records, [
            {
                baseField: 'emailsField',
                fullPath: 'emailsField.primaryEmail',
                column: 'emailsFieldPrimaryEmail'
            }
        ]);
        expect(where).toHaveLength(1);
        const condition = where[0];
        expect(Object.keys(condition)).toEqual([
            'emailsFieldPrimaryEmail'
        ]);
        const operator = condition.emailsFieldPrimaryEmail;
        expect(operator.type.toLowerCase()).toBe('in');
        expect(operator.value).toEqual([
            'alpha@example.com',
            'beta@example.com'
        ]);
    });
    it('builds multiple conditions when multiple conflicting fields are provided', ()=>{
        const where = (0, _buildwhereconditionsutil.buildWhereConditions)(records, [
            {
                baseField: 'uniqueText',
                fullPath: 'uniqueText',
                column: 'uniqueText'
            },
            {
                baseField: 'emailsField',
                fullPath: 'emailsField.primaryEmail',
                column: 'emailsFieldPrimaryEmail'
            }
        ]);
        expect(where).toHaveLength(2);
        expect(where.map((condition)=>Object.keys(condition)[0]).sort()).toEqual([
            'emailsFieldPrimaryEmail',
            'uniqueText'
        ]);
        const uniqueTextOperator = where.find((c)=>'uniqueText' in c)?.uniqueText;
        const emailOperator = where.find((c)=>'emailsFieldPrimaryEmail' in c)?.emailsFieldPrimaryEmail;
        expect(uniqueTextOperator?.value).toEqual([
            'alpha',
            'beta'
        ]);
        expect(emailOperator?.value).toEqual([
            'alpha@example.com',
            'beta@example.com'
        ]);
    });
});

//# sourceMappingURL=build-where-conditions.util.spec.js.map