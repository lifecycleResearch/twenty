"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getmatchingrecordidutil = require("../get-matching-record-id.util");
const _commonqueryrunnerexception = require("../../../errors/common-query-runner.exception");
describe('getMatchingRecordId', ()=>{
    const existingRecords = [
        {
            id: 'recordId1',
            uniqueText: 'alpha',
            emailsField: {
                primaryEmail: 'alpha@example.com'
            }
        },
        {
            id: 'recordId2',
            uniqueText: 'beta',
            emailsField: {
                primaryEmail: 'beta@example.com'
            }
        }
    ];
    it('returns the matching record id when exactly one field matches one existing record', ()=>{
        const record = {
            emailsField: {
                primaryEmail: 'alpha@example.com'
            }
        };
        const conflictingFields = [
            {
                baseField: 'emailsField',
                fullPath: 'emailsField.primaryEmail',
                column: 'emailsFieldPrimaryEmail'
            }
        ];
        const id = (0, _getmatchingrecordidutil.getMatchingRecordId)(record, conflictingFields, existingRecords);
        expect(id).toBe('recordId1');
    });
    it('returns undefined when no existing record matches any conflicting field', ()=>{
        const record = {
            emailsField: {
                primaryEmail: 'nobody@example.com'
            }
        };
        const conflictingFields = [
            {
                baseField: 'emailsField',
                fullPath: 'emailsField.primaryEmail',
                column: 'emailsFieldPrimaryEmail'
            }
        ];
        const id = (0, _getmatchingrecordidutil.getMatchingRecordId)(record, conflictingFields, existingRecords);
        expect(id).toBeUndefined();
    });
    it('returns the matching id if multiple conflicting fields point to the same existing record', ()=>{
        const record = {
            id: 'recordId1',
            uniqueText: 'alpha'
        };
        const conflictingFields = [
            {
                baseField: 'id',
                fullPath: 'id',
                column: 'id'
            },
            {
                baseField: 'uniqueText',
                fullPath: 'uniqueText',
                column: 'uniqueText'
            }
        ];
        const id = (0, _getmatchingrecordidutil.getMatchingRecordId)(record, conflictingFields, existingRecords);
        expect(id).toBe('recordId1');
    });
    it('throws when conflicting fields match different existing records', ()=>{
        const record = {
            uniqueText: 'alpha',
            emailsField: {
                primaryEmail: 'beta@example.com'
            }
        };
        const conflictingFields = [
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
        ];
        expect(()=>(0, _getmatchingrecordidutil.getMatchingRecordId)(record, conflictingFields, existingRecords)).toThrow();
        try {
            (0, _getmatchingrecordidutil.getMatchingRecordId)(record, conflictingFields, existingRecords);
        } catch (error) {
            expect(error.code).toBe(_commonqueryrunnerexception.CommonQueryRunnerExceptionCode.UPSERT_MULTIPLE_MATCHING_RECORDS_CONFLICT);
        }
    });
});

//# sourceMappingURL=get-matching-record-id.util.spec.js.map