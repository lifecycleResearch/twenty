"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveFieldMetadataStandardOverride", {
    enumerable: true,
    get: function() {
        return resolveFieldMetadataStandardOverride;
    }
});
const _guards = require("@sniptt/guards");
const _translations = require("twenty-shared/translations");
const _utils = require("twenty-shared/utils");
const _generateMessageId = require("../../../core-modules/i18n/utils/generateMessageId");
const resolveFieldMetadataStandardOverride = (fieldMetadata, labelKey, locale, i18nInstance)=>{
    if (fieldMetadata.isCustom) {
        return fieldMetadata[labelKey] ?? '';
    }
    if (labelKey === 'icon' && (0, _utils.isDefined)(fieldMetadata.standardOverrides?.icon)) {
        return fieldMetadata.standardOverrides.icon;
    }
    if ((0, _utils.isDefined)(fieldMetadata.standardOverrides?.translations) && (0, _utils.isDefined)(locale) && labelKey !== 'icon') {
        const translationValue = fieldMetadata.standardOverrides.translations[locale]?.[labelKey];
        if ((0, _utils.isDefined)(translationValue)) {
            return translationValue;
        }
    }
    if (locale === _translations.SOURCE_LOCALE && (0, _guards.isNonEmptyString)(fieldMetadata.standardOverrides?.[labelKey])) {
        return fieldMetadata.standardOverrides[labelKey] ?? '';
    }
    const messageId = (0, _generateMessageId.generateMessageId)(fieldMetadata[labelKey] ?? '');
    const translatedMessage = i18nInstance._(messageId);
    if (translatedMessage === messageId) {
        return fieldMetadata[labelKey] ?? '';
    }
    return translatedMessage;
};

//# sourceMappingURL=resolve-field-metadata-standard-override.util.js.map