"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FlatPermissionFlagValidatorService", {
    enumerable: true,
    get: function() {
        return FlatPermissionFlagValidatorService;
    }
});
const _common = require("@nestjs/common");
const _core = require("@lingui/core");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _findflatentitybyuniversalidentifierutil = require("../../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _permissionsexception = require("../../../../../metadata-modules/permissions/permissions.exception");
const _getflatentityvalidationerrorutil = require("../../builders/utils/get-flat-entity-validation-error.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FlatPermissionFlagValidatorService = class FlatPermissionFlagValidatorService {
    validateFlatPermissionFlagCreation({ flatEntityToValidate: flatPermissionFlagToValidate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatPermissionFlagMaps: optimisticFlatPermissionFlagMaps, flatRoleMaps } }) {
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier: flatPermissionFlagToValidate.universalIdentifier,
                roleUniversalIdentifier: flatPermissionFlagToValidate.roleUniversalIdentifier
            },
            metadataName: 'permissionFlag',
            type: 'create'
        });
        const existingByUniversalId = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatPermissionFlagToValidate.universalIdentifier,
            flatEntityMaps: optimisticFlatPermissionFlagMaps
        });
        if ((0, _utils.isDefined)(existingByUniversalId)) {
            validationResult.errors.push({
                code: _permissionsexception.PermissionsExceptionCode.INVALID_SETTING,
                message: _core.i18n._(/*i18n*/ {
                    id: "VuCvJL",
                    message: "Permission flag with universal identifier {0} already exists",
                    values: {
                        0: flatPermissionFlagToValidate.universalIdentifier
                    }
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "fxC+On",
                    message: "Permission flag already exists"
                }
            });
        }
        const referencedRole = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: flatPermissionFlagToValidate.roleUniversalIdentifier,
            flatEntityMaps: flatRoleMaps
        });
        if (!(0, _utils.isDefined)(referencedRole)) {
            validationResult.errors.push({
                code: _permissionsexception.PermissionsExceptionCode.ROLE_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "MvTCyk",
                    message: "Role not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "MvTCyk",
                    message: "Role not found"
                }
            });
        } else if (!referencedRole.isEditable) {
            validationResult.errors.push({
                code: _permissionsexception.PermissionsExceptionCode.ROLE_NOT_EDITABLE,
                message: _core.i18n._(/*i18n*/ {
                    id: "k2/sGI",
                    message: "Role is not editable"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "KoDdqN",
                    message: "This role cannot be modified because it is a system role. Only custom roles can be edited."
                }
            });
        }
        const isValidFlag = (0, _utils.isDefined)(flatPermissionFlagToValidate.flag) && Object.values(_constants.PermissionFlagType).includes(flatPermissionFlagToValidate.flag);
        if (!isValidFlag) {
            validationResult.errors.push({
                code: _permissionsexception.PermissionsExceptionCode.INVALID_SETTING,
                message: _core.i18n._(/*i18n*/ {
                    id: "KhF8C3",
                    message: "Invalid permission flag value"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "mMHHVP",
                    message: "Invalid permission setting"
                }
            });
        }
        const duplicateForSameRole = Object.values(optimisticFlatPermissionFlagMaps.byUniversalIdentifier).filter((pf)=>(0, _utils.isDefined)(pf) && pf.roleUniversalIdentifier === flatPermissionFlagToValidate.roleUniversalIdentifier && pf.flag === flatPermissionFlagToValidate.flag && pf.universalIdentifier !== flatPermissionFlagToValidate.universalIdentifier);
        if (duplicateForSameRole.length > 0) {
            validationResult.errors.push({
                code: _permissionsexception.PermissionsExceptionCode.INVALID_SETTING,
                message: _core.i18n._(/*i18n*/ {
                    id: "qG245w",
                    message: "Permission flag for this role and setting already exists"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "3q5jw3",
                    message: "This permission is already set for the role"
                }
            });
        }
        return validationResult;
    }
    validateFlatPermissionFlagUpdate({ universalIdentifier, flatEntityUpdate, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatPermissionFlagMaps: optimisticFlatPermissionFlagMaps, flatRoleMaps } }) {
        const existingFlatPermissionFlag = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: optimisticFlatPermissionFlagMaps
        });
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier
            },
            metadataName: 'permissionFlag',
            type: 'update'
        });
        if (!(0, _utils.isDefined)(existingFlatPermissionFlag)) {
            validationResult.errors.push({
                code: _permissionsexception.PermissionsExceptionCode.PERMISSION_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "SMgh5j",
                    message: "Permission flag to update not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "2mZr45",
                    message: "Permission flag not found"
                }
            });
            return validationResult;
        }
        const updatedFlatPermissionFlag = {
            ...existingFlatPermissionFlag,
            ...flatEntityUpdate
        };
        const referencedRole = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier: updatedFlatPermissionFlag.roleUniversalIdentifier,
            flatEntityMaps: flatRoleMaps
        });
        if (!(0, _utils.isDefined)(referencedRole)) {
            validationResult.errors.push({
                code: _permissionsexception.PermissionsExceptionCode.ROLE_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "MvTCyk",
                    message: "Role not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "MvTCyk",
                    message: "Role not found"
                }
            });
        } else if (!referencedRole.isEditable) {
            validationResult.errors.push({
                code: _permissionsexception.PermissionsExceptionCode.ROLE_NOT_EDITABLE,
                message: _core.i18n._(/*i18n*/ {
                    id: "k2/sGI",
                    message: "Role is not editable"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "KoDdqN",
                    message: "This role cannot be modified because it is a system role. Only custom roles can be edited."
                }
            });
        }
        if ((0, _utils.isDefined)(flatEntityUpdate.flag)) {
            const isValidFlag = Object.values(_constants.PermissionFlagType).includes(flatEntityUpdate.flag);
            if (!isValidFlag) {
                validationResult.errors.push({
                    code: _permissionsexception.PermissionsExceptionCode.INVALID_SETTING,
                    message: _core.i18n._(/*i18n*/ {
                        id: "KhF8C3",
                        message: "Invalid permission flag value"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "mMHHVP",
                        message: "Invalid permission setting"
                    }
                });
            }
        }
        const duplicateForSameRole = Object.values(optimisticFlatPermissionFlagMaps.byUniversalIdentifier).filter((pf)=>(0, _utils.isDefined)(pf) && pf.roleUniversalIdentifier === updatedFlatPermissionFlag.roleUniversalIdentifier && pf.flag === updatedFlatPermissionFlag.flag && pf.universalIdentifier !== universalIdentifier);
        if (duplicateForSameRole.length > 0) {
            validationResult.errors.push({
                code: _permissionsexception.PermissionsExceptionCode.INVALID_SETTING,
                message: _core.i18n._(/*i18n*/ {
                    id: "qG245w",
                    message: "Permission flag for this role and setting already exists"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "3q5jw3",
                    message: "This permission is already set for the role"
                }
            });
        }
        return validationResult;
    }
    validateFlatPermissionFlagDeletion({ flatEntityToValidate: { universalIdentifier }, optimisticFlatEntityMapsAndRelatedFlatEntityMaps: { flatPermissionFlagMaps: optimisticFlatPermissionFlagMaps, flatRoleMaps } }) {
        const validationResult = (0, _getflatentityvalidationerrorutil.getEmptyFlatEntityValidationError)({
            flatEntityMinimalInformation: {
                universalIdentifier
            },
            metadataName: 'permissionFlag',
            type: 'delete'
        });
        const existingFlatPermissionFlag = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
            universalIdentifier,
            flatEntityMaps: optimisticFlatPermissionFlagMaps
        });
        if (!(0, _utils.isDefined)(existingFlatPermissionFlag)) {
            validationResult.errors.push({
                code: _permissionsexception.PermissionsExceptionCode.PERMISSION_NOT_FOUND,
                message: _core.i18n._(/*i18n*/ {
                    id: "dqLRwc",
                    message: "Permission flag to delete not found"
                }),
                userFriendlyMessage: /*i18n*/ {
                    id: "2mZr45",
                    message: "Permission flag not found"
                }
            });
        } else {
            const referencedRole = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                universalIdentifier: existingFlatPermissionFlag.roleUniversalIdentifier,
                flatEntityMaps: flatRoleMaps
            });
            if (!(0, _utils.isDefined)(referencedRole)) {
                validationResult.errors.push({
                    code: _permissionsexception.PermissionsExceptionCode.ROLE_NOT_FOUND,
                    message: _core.i18n._(/*i18n*/ {
                        id: "MvTCyk",
                        message: "Role not found"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "MvTCyk",
                        message: "Role not found"
                    }
                });
            } else if (!referencedRole.isEditable) {
                validationResult.errors.push({
                    code: _permissionsexception.PermissionsExceptionCode.ROLE_NOT_EDITABLE,
                    message: _core.i18n._(/*i18n*/ {
                        id: "k2/sGI",
                        message: "Role is not editable"
                    }),
                    userFriendlyMessage: /*i18n*/ {
                        id: "KoDdqN",
                        message: "This role cannot be modified because it is a system role. Only custom roles can be edited."
                    }
                });
            }
        }
        return validationResult;
    }
};
FlatPermissionFlagValidatorService = _ts_decorate([
    (0, _common.Injectable)()
], FlatPermissionFlagValidatorService);

//# sourceMappingURL=flat-permission-flag-validator.service.js.map