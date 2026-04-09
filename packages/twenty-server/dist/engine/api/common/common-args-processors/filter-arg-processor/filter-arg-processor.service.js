"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FilterArgProcessorService", {
    enumerable: true,
    get: function() {
        return FilterArgProcessorService;
    }
});
const _common = require("@nestjs/common");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _validateandtransformoperatorandvalueutil = require("./utils/validate-and-transform-operator-and-value.util");
const _commonqueryrunnerexception = require("../../common-query-runners/errors/common-query-runner.exception");
const _standarderrormessageconstant = require("../../common-query-runners/errors/standard-error-message.constant");
const _iscompositefieldmetadatatypeutil = require("../../../../metadata-modules/field-metadata/utils/is-composite-field-metadata-type.util");
const _findflatentitybyidinflatentitymapsutil = require("../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _buildfieldmapsfromflatobjectmetadatautil = require("../../../../metadata-modules/flat-field-metadata/utils/build-field-maps-from-flat-object-metadata.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FilterArgProcessorService = class FilterArgProcessorService {
    process({ filter, flatObjectMetadata, flatFieldMetadataMaps }) {
        if (!(0, _utils.isDefined)(filter)) {
            return filter;
        }
        const { fieldIdByName, fieldIdByJoinColumnName } = (0, _buildfieldmapsfromflatobjectmetadatautil.buildFieldMapsFromFlatObjectMetadata)(flatFieldMetadataMaps, flatObjectMetadata);
        return this.validateAndTransformFilter(filter, flatObjectMetadata, flatFieldMetadataMaps, fieldIdByName, fieldIdByJoinColumnName);
    }
    validateAndTransformFilter(filterObject, flatObjectMetadata, flatFieldMetadataMaps, fieldIdByName, fieldIdByJoinColumnName) {
        const transformedFilter = {};
        for (const [key, value] of Object.entries(filterObject)){
            if (key === 'and' || key === 'or') {
                transformedFilter[key] = value.map((nestedFilter)=>this.validateAndTransformFilter(nestedFilter, flatObjectMetadata, flatFieldMetadataMaps, fieldIdByName, fieldIdByJoinColumnName));
                continue;
            }
            if (key === 'not') {
                transformedFilter[key] = this.validateAndTransformFilter(value, flatObjectMetadata, flatFieldMetadataMaps, fieldIdByName, fieldIdByJoinColumnName);
                continue;
            }
            transformedFilter[key] = this.validateAndTransformFieldFilter(key, value, flatObjectMetadata, flatFieldMetadataMaps, fieldIdByName, fieldIdByJoinColumnName);
        }
        return transformedFilter;
    }
    validateAndTransformFieldFilter(key, filterValue, flatObjectMetadata, flatFieldMetadataMaps, fieldIdByName, fieldIdByJoinColumnName) {
        const fieldMetadataId = fieldIdByName[key] || fieldIdByJoinColumnName[key];
        if (!(0, _utils.isDefined)(fieldMetadataId)) {
            const nameSingular = flatObjectMetadata.nameSingular;
            throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Object ${flatObjectMetadata.nameSingular} doesn't have any "${key}" field.`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_FILTER, {
                userFriendlyMessage: /*i18n*/ {
                    id: "+ECOke",
                    message: 'Invalid filter : {nameSingular} object doesn\'t have any "{key}" field.',
                    values: {
                        nameSingular: nameSingular,
                        key: key
                    }
                }
            });
        }
        const fieldMetadata = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: fieldMetadataId,
            flatEntityMaps: flatFieldMetadataMaps
        });
        if (!fieldMetadata) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Field metadata not found for field ${key}`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_FILTER, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        if ((0, _iscompositefieldmetadatatypeutil.isCompositeFieldMetadataType)(fieldMetadata.type)) {
            return this.validateAndTransformCompositeFieldFilter(fieldMetadata, filterValue);
        }
        return (0, _validateandtransformoperatorandvalueutil.validateAndTransformOperatorAndValue)(key, filterValue, fieldMetadata);
    }
    validateAndTransformCompositeFieldFilter(fieldMetadata, filterValue) {
        const compositeType = _types.compositeTypeDefinitions.get(fieldMetadata.type);
        if (!compositeType) {
            throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Composite type definition not found for type: ${fieldMetadata.type}`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_FILTER, {
                userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
            });
        }
        const transformedFilter = {};
        for (const [subFieldKey, subFieldFilter] of Object.entries(filterValue)){
            const subFieldMetadata = compositeType.properties.find((property)=>property.name === subFieldKey);
            if (!subFieldMetadata) {
                throw new _commonqueryrunnerexception.CommonQueryRunnerException(`Sub field "${subFieldKey}" not found for composite type: ${fieldMetadata.type}`, _commonqueryrunnerexception.CommonQueryRunnerExceptionCode.INVALID_ARGS_FILTER, {
                    userFriendlyMessage: _standarderrormessageconstant.STANDARD_ERROR_MESSAGE
                });
            }
            transformedFilter[subFieldKey] = (0, _validateandtransformoperatorandvalueutil.validateAndTransformOperatorAndValue)(`${fieldMetadata.name}.${subFieldKey}`, subFieldFilter, {
                ...fieldMetadata,
                type: subFieldMetadata.type
            });
        }
        return transformedFilter;
    }
};
FilterArgProcessorService = _ts_decorate([
    (0, _common.Injectable)()
], FilterArgProcessorService);

//# sourceMappingURL=filter-arg-processor.service.js.map