"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedPageLayoutWidgets", {
    enumerable: true,
    get: function() {
        return seedPageLayoutWidgets;
    }
});
const _classvalidator = require("class-validator");
const _uuid = require("uuid");
const _validatewidgetconfigurationinpututil = require("../../../../metadata-modules/page-layout-widget/utils/validate-widget-configuration-input.util");
const _getpagelayoutwidgetdataseedsutil = require("./get-page-layout-widget-data-seeds.util");
const seedPageLayoutWidgets = async ({ dataSource, schemaName, workspaceId, objectMetadataItems, workspaceCustomApplicationId })=>{
    const widgetSeeds = (0, _getpagelayoutwidgetdataseedsutil.getPageLayoutWidgetDataSeeds)(workspaceId, objectMetadataItems);
    const pageLayoutWidgets = widgetSeeds.map((widget)=>{
        if ((0, _classvalidator.isDefined)(widget.configuration)) {
            (0, _validatewidgetconfigurationinpututil.validateWidgetConfigurationInput)({
                configuration: widget.configuration
            });
        }
        return {
            ...widget,
            workspaceId,
            gridPosition: widget.gridPosition,
            position: widget.position,
            configuration: widget.configuration,
            universalIdentifier: (0, _uuid.v4)(),
            applicationId: workspaceCustomApplicationId,
            overrides: widget.overrides ?? null
        };
    });
    if (pageLayoutWidgets.length > 0) {
        await dataSource.createQueryBuilder().insert().into(`${schemaName}.pageLayoutWidget`, [
            'id',
            'pageLayoutTabId',
            'title',
            'type',
            'gridPosition',
            'position',
            'configuration',
            'objectMetadataId',
            'workspaceId',
            'universalIdentifier',
            'applicationId',
            'overrides'
        ]).values(pageLayoutWidgets).orIgnore().execute();
    }
};

//# sourceMappingURL=seed-page-layout-widgets.util.js.map