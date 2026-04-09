"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _types = require("twenty-shared/types");
const _fieldmetadataconfigbyfieldnameconstant = require("../../data-arg-processor/__tests__/constants/field-metadata-config-by-field-name.constant");
const _filterargprocessorservice = require("../filter-arg-processor.service");
const _failingfilterinputsbyfieldmetadatatypeconstant = require("./constants/failing-filter-inputs-by-field-metadata-type.constant");
const _successfulfilterinputsbyfieldmetadatatypeconstant = require("./constants/successful-filter-inputs-by-field-metadata-type.constant");
describe('FilterArgProcessorService', ()=>{
    let filterArgProcessorService;
    const createFlatFieldMetadataMaps = (fieldNames)=>{
        const byUniversalIdentifier = {};
        const universalIdentifierById = {};
        for (const fieldName of fieldNames){
            const config = _fieldmetadataconfigbyfieldnameconstant.fieldMetadataConfigByFieldName[fieldName];
            if (!config) {
                throw new Error(`No config found for field: ${fieldName}`);
            }
            const fieldId = `${fieldName}-id`;
            const universalId = `${fieldName}-universal-id`;
            byUniversalIdentifier[universalId] = {
                id: fieldId,
                name: fieldName,
                type: config.type ?? _types.FieldMetadataType.TEXT,
                isNullable: config.isNullable ?? true,
                objectMetadataId: 'object-id',
                universalIdentifier: universalId,
                options: config.options,
                settings: config.settings,
                defaultValue: config.defaultValue
            };
            universalIdentifierById[fieldId] = universalId;
        }
        return {
            byUniversalIdentifier,
            universalIdentifierById,
            universalIdentifiersByApplicationId: {}
        };
    };
    const createFlatObjectMetadata = (fieldNames)=>({
            id: 'object-id',
            nameSingular: 'testObject',
            namePlural: 'testObjects',
            isCustom: false,
            fieldIds: fieldNames.map((name)=>`${name}-id`),
            universalIdentifier: 'test-object-universal-id',
            labelIdentifierFieldMetadataUniversalIdentifier: null,
            imageIdentifierFieldMetadataUniversalIdentifier: null
        });
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _filterargprocessorservice.FilterArgProcessorService
            ]
        }).compile();
        filterArgProcessorService = module.get(_filterargprocessorservice.FilterArgProcessorService);
    });
    afterEach(()=>{
        jest.clearAllMocks();
    });
    describe('failing filter inputs validation', ()=>{
        const fieldMetadataTypesToTest = Object.keys(_failingfilterinputsbyfieldmetadatatypeconstant.failingFilterInputsByFieldMetadataType);
        for (const fieldMetadataType of fieldMetadataTypesToTest){
            const testCases = _failingfilterinputsbyfieldmetadatatypeconstant.failingFilterInputsByFieldMetadataType[fieldMetadataType];
            if (!testCases) {
                continue;
            }
            describe(`${fieldMetadataType}`, ()=>{
                for (const [index, testCase] of testCases.entries()){
                    const fieldName = Object.keys(testCase.filter)[0];
                    it(`should throw for invalid filter #${index + 1}: ${JSON.stringify(testCase.filter)}`, ()=>{
                        const fieldNames = [
                            fieldName
                        ];
                        const flatFieldMetadataMaps = createFlatFieldMetadataMaps(fieldNames);
                        const flatObjectMetadata = createFlatObjectMetadata(fieldNames);
                        expect(()=>filterArgProcessorService.process({
                                filter: testCase.filter,
                                flatObjectMetadata,
                                flatFieldMetadataMaps
                            })).toThrowErrorMatchingSnapshot();
                    });
                }
            });
        }
    });
    describe('successful filter inputs validation', ()=>{
        const fieldMetadataTypesToTest = Object.keys(_successfulfilterinputsbyfieldmetadatatypeconstant.successfulFilterInputsByFieldMetadataType);
        for (const fieldMetadataType of fieldMetadataTypesToTest){
            const testCases = _successfulfilterinputsbyfieldmetadatatypeconstant.successfulFilterInputsByFieldMetadataType[fieldMetadataType];
            if (!testCases) {
                continue;
            }
            describe(`${fieldMetadataType}`, ()=>{
                for (const [index, testCase] of testCases.entries()){
                    const fieldName = Object.keys(testCase.filter)[0];
                    it(`should process valid filter #${index + 1}: ${JSON.stringify(testCase.filter)}`, ()=>{
                        const fieldNames = [
                            fieldName
                        ];
                        const flatFieldMetadataMaps = createFlatFieldMetadataMaps(fieldNames);
                        const flatObjectMetadata = createFlatObjectMetadata(fieldNames);
                        const result = filterArgProcessorService.process({
                            filter: testCase.filter,
                            flatObjectMetadata,
                            flatFieldMetadataMaps
                        });
                        const expectedResult = testCase.expected ?? testCase.filter;
                        expect(result).toBeDefined();
                        expect(result).toEqual(expectedResult);
                    });
                }
            });
        }
    });
    describe('logical operators', ()=>{
        it('should process filter with "and" operator', ()=>{
            const fieldNames = [
                'textField',
                'numberField'
            ];
            const flatFieldMetadataMaps = createFlatFieldMetadataMaps(fieldNames);
            const flatObjectMetadata = createFlatObjectMetadata(fieldNames);
            const filter = {
                and: [
                    {
                        textField: {
                            eq: 'test'
                        }
                    },
                    {
                        numberField: {
                            gt: 0
                        }
                    }
                ]
            };
            const result = filterArgProcessorService.process({
                filter,
                flatObjectMetadata,
                flatFieldMetadataMaps
            });
            expect(result).toEqual(filter);
        });
        it('should process filter with "or" operator', ()=>{
            const fieldNames = [
                'textField',
                'numberField'
            ];
            const flatFieldMetadataMaps = createFlatFieldMetadataMaps(fieldNames);
            const flatObjectMetadata = createFlatObjectMetadata(fieldNames);
            const filter = {
                or: [
                    {
                        textField: {
                            eq: 'test'
                        }
                    },
                    {
                        numberField: {
                            gt: 0
                        }
                    }
                ]
            };
            const result = filterArgProcessorService.process({
                filter,
                flatObjectMetadata,
                flatFieldMetadataMaps
            });
            expect(result).toEqual(filter);
        });
        it('should process filter with "not" operator', ()=>{
            const fieldNames = [
                'textField'
            ];
            const flatFieldMetadataMaps = createFlatFieldMetadataMaps(fieldNames);
            const flatObjectMetadata = createFlatObjectMetadata(fieldNames);
            const filter = {
                not: {
                    textField: {
                        eq: 'test'
                    }
                }
            };
            const result = filterArgProcessorService.process({
                filter,
                flatObjectMetadata,
                flatFieldMetadataMaps
            });
            expect(result).toEqual(filter);
        });
        it('should process nested logical operators', ()=>{
            const fieldNames = [
                'textField',
                'numberField'
            ];
            const flatFieldMetadataMaps = createFlatFieldMetadataMaps(fieldNames);
            const flatObjectMetadata = createFlatObjectMetadata(fieldNames);
            const filter = {
                and: [
                    {
                        or: [
                            {
                                textField: {
                                    eq: 'test1'
                                }
                            },
                            {
                                textField: {
                                    eq: 'test2'
                                }
                            }
                        ]
                    },
                    {
                        numberField: {
                            gt: 0
                        }
                    }
                ]
            };
            const result = filterArgProcessorService.process({
                filter,
                flatObjectMetadata,
                flatFieldMetadataMaps
            });
            expect(result).toEqual(filter);
        });
    });
    describe('value transformation', ()=>{
        it('should coerce string to number for NUMBER field', ()=>{
            const fieldNames = [
                'numberField'
            ];
            const flatFieldMetadataMaps = createFlatFieldMetadataMaps(fieldNames);
            const flatObjectMetadata = createFlatObjectMetadata(fieldNames);
            const result = filterArgProcessorService.process({
                filter: {
                    numberField: {
                        eq: '42'
                    }
                },
                flatObjectMetadata,
                flatFieldMetadataMaps
            });
            expect(result).toEqual({
                numberField: {
                    eq: 42
                }
            });
        });
        it('should coerce string to boolean for BOOLEAN field', ()=>{
            const fieldNames = [
                'booleanField'
            ];
            const flatFieldMetadataMaps = createFlatFieldMetadataMaps(fieldNames);
            const flatObjectMetadata = createFlatObjectMetadata(fieldNames);
            const result = filterArgProcessorService.process({
                filter: {
                    booleanField: {
                        eq: 'true'
                    }
                },
                flatObjectMetadata,
                flatFieldMetadataMaps
            });
            expect(result).toEqual({
                booleanField: {
                    eq: true
                }
            });
        });
        it('should preserve null values in "in" operator', ()=>{
            const fieldNames = [
                'numberField'
            ];
            const flatFieldMetadataMaps = createFlatFieldMetadataMaps(fieldNames);
            const flatObjectMetadata = createFlatObjectMetadata(fieldNames);
            const result = filterArgProcessorService.process({
                filter: {
                    numberField: {
                        in: [
                            1,
                            null,
                            3
                        ]
                    }
                },
                flatObjectMetadata,
                flatFieldMetadataMaps
            });
            expect(result).toEqual({
                numberField: {
                    in: [
                        1,
                        null,
                        3
                    ]
                }
            });
        });
    });
});

//# sourceMappingURL=filter-arg-processor.service.spec.js.map