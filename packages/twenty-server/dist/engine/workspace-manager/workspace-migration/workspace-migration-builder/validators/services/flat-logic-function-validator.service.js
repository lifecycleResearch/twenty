"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FlatLogicFunctionValidatorService", {
    enumerable: true,
    get: function() {
        return FlatLogicFunctionValidatorService;
    }
});
const _common = require("@nestjs/common");
const _core = require("@lingui/core");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _logicfunctionexception = require("../../../../../metadata-modules/logic-function/logic-function.exception");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FlatLogicFunctionValidatorService = class FlatLogicFunctionValidatorService {
    validateFlatLogicFunctionUpdate({ universalIdentifier, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatLogicFunctionMaps: optimisticFlatLogicFunctionMaps } }) {
        const existingFlatLogicFunction = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: optimisticFlatLogicFunctionMaps
        });
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier
            },
            metadataName: 'logicFunction',
            type: 'update'
        });
        if (!(0, _utils.isDefined)(existingFlatLogicFunction)) {
            validationResult.errors.push({
                code: _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "hk3cgp",
                    message: "Logic function not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "hk3cgp",
                    message: "Logic function not found"
                }
            });
        }
        return validationResult;
    }
    validateFlatLogicFunctionDeletion({ flatEntityToValidate: { universalIdentifier }, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatLogicFunctionMaps: optimisticFlatLogicFunctionMaps } }) {
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier
            },
            metadataName: 'logicFunction',
            type: 'delete'
        });
        const existingFlatLogicFunction = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: optimisticFlatLogicFunctionMaps
        });
        if (!(0, _utils.isDefined)(existingFlatLogicFunction)) {
            validationResult.errors.push({
                code: _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "hk3cgp",
                    message: "Logic function not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "hk3cgp",
                    message: "Logic function not found"
                }
            });
        }
        return validationResult;
    }
    validateFlatLogicFunctionCreation({ flatEntityToValidate: flatLogicFunctionToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatLogicFunctionMaps: optimisticFlatLogicFunctionMaps } }) {
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier: flatLogicFunctionToValidate.universalIdentifier
            },
            metadataName: 'logicFunction',
            type: 'create'
        });
        if ((0, _utils.isDefined)((0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatLogicFunctionToValidate.universalIdentifier,
            flatEntityMaps: optimisticFlatLogicFunctionMaps
        }))) {
            validationResult.errors.push({
                code: _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_ALREADY_EXIST,
                message: _core.i18n._(/*i18n*/ {
                    id: "Lf8I7I",
                    message: "Logic function with same universal identifier already exists"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "V5AXjr",
                    message: "Logic function already exists"
                }
            });
        }
        return validationResult;
    }
    constructor(){}
};
FlatLogicFunctionValidatorService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], FlatLogicFunctionValidatorService);

//# sourceMappingURL=flat-logic-function-validator.service.js.map