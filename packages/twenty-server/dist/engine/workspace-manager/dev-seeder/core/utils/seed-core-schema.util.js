"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedCoreSchema", {
    enumerable: true,
    get: function() {
        return seedCoreSchema;
    }
});
const _uuid = require("uuid");
const _seedbillingcustomersutil = require("../billing/utils/seed-billing-customers.util");
const _seedbillingsubscriptionsutil = require("../billing/utils/seed-billing-subscriptions.util");
const _seederworkspacesconstant = require("../constants/seeder-workspaces.constant");
const _seedagentsutil = require("./seed-agents.util");
const _seedapikeysutil = require("./seed-api-keys.util");
const _seedfeatureflagsutil = require("./seed-feature-flags.util");
const _seedmetadataentitiesutil = require("./seed-metadata-entities.util");
const _seedserveridutil = require("./seed-server-id.util");
const _seeduserworkspacesutil = require("./seed-user-workspaces.util");
const _seedusersutil = require("./seed-users.util");
const _seedworkspaceutil = require("./seed-workspace.util");
const _extractversionmajorminorpatch = require("../../../../../utils/version/extract-version-major-minor-patch");
const seedCoreSchema = async ({ appVersion, dataSource, workspaceId, applicationService, seedBilling = true, seedFeatureFlags: shouldSeedFeatureFlags = true })=>{
    const schemaName = 'core';
    const createWorkspaceStaticInput = _seederworkspacesconstant.SEEDER_CREATE_WORKSPACE_INPUT[workspaceId];
    const version = (0, _extractversionmajorminorpatch.extractVersionMajorMinorPatch)(appVersion);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const workspaceCustomApplicationId = (0, _uuid.v4)();
        await (0, _seedworkspaceutil.createWorkspace)({
            queryRunner,
            schemaName,
            createWorkspaceInput: {
                ...createWorkspaceStaticInput,
                version,
                workspaceCustomApplicationId
            }
        });
        await applicationService.createWorkspaceCustomApplication({
            workspaceId,
            applicationId: workspaceCustomApplicationId,
            workspaceDisplayName: createWorkspaceStaticInput.displayName
        }, queryRunner);
        await (0, _seedserveridutil.seedServerId)({
            queryRunner,
            schemaName
        });
        await (0, _seedusersutil.seedUsers)({
            queryRunner,
            schemaName
        });
        await (0, _seeduserworkspacesutil.seedUserWorkspaces)({
            queryRunner,
            schemaName,
            workspaceId
        });
        await applicationService.createTwentyStandardApplication({
            workspaceId,
            skipCacheInvalidation: true
        }, queryRunner);
        await (0, _seedagentsutil.seedAgents)({
            queryRunner,
            schemaName,
            workspaceId
        });
        await (0, _seedapikeysutil.seedApiKeys)({
            queryRunner,
            schemaName,
            workspaceId
        });
        if (shouldSeedFeatureFlags) {
            await (0, _seedfeatureflagsutil.seedFeatureFlags)({
                queryRunner,
                schemaName,
                workspaceId
            });
        }
        if (seedBilling) {
            await (0, _seedbillingcustomersutil.seedBillingCustomers)({
                queryRunner,
                schemaName,
                workspaceId
            });
            await (0, _seedbillingsubscriptionsutil.seedBillingSubscriptions)({
                queryRunner,
                schemaName,
                workspaceId
            });
        }
        await (0, _seedmetadataentitiesutil.seedMetadataEntities)({
            queryRunner,
            schemaName,
            workspaceId
        });
        await queryRunner.commitTransaction();
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally{
        await queryRunner.release();
    }
};

//# sourceMappingURL=seed-core-schema.util.js.map