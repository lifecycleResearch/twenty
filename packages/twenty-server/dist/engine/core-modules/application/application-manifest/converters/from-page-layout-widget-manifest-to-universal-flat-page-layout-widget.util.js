"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromPageLayoutWidgetManifestToUniversalFlatPageLayoutWidget", {
    enumerable: true,
    get: function() {
        return fromPageLayoutWidgetManifestToUniversalFlatPageLayoutWidget;
    }
});
const fromPageLayoutWidgetManifestToUniversalFlatPageLayoutWidget = ({ pageLayoutWidgetManifest, pageLayoutTabUniversalIdentifier, applicationUniversalIdentifier, now })=>{
    return {
        universalIdentifier: pageLayoutWidgetManifest.universalIdentifier,
        applicationUniversalIdentifier,
        pageLayoutTabUniversalIdentifier,
        title: pageLayoutWidgetManifest.title,
        type: pageLayoutWidgetManifest.type,
        objectMetadataUniversalIdentifier: pageLayoutWidgetManifest.objectUniversalIdentifier ?? null,
        conditionalDisplay: pageLayoutWidgetManifest.conditionalDisplay ?? null,
        gridPosition: pageLayoutWidgetManifest.gridPosition ?? {
            row: 0,
            column: 0,
            rowSpan: 1,
            columnSpan: 1
        },
        position: null,
        universalConfiguration: pageLayoutWidgetManifest.configuration,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        overrides: null
    };
};

//# sourceMappingURL=from-page-layout-widget-manifest-to-universal-flat-page-layout-widget.util.js.map