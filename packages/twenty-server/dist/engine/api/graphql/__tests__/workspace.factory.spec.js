"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _scalarsexplorerservice = require("../services/scalars-explorer.service");
const _workspaceresolverfactory = require("../workspace-resolver-builder/workspace-resolver.factory");
const _workspacegraphqlschemafactory = require("../workspace-schema-builder/workspace-graphql-schema.factory");
const _workspaceschemafactory = require("../workspace-schema.factory");
const _featureflagservice = require("../../../core-modules/feature-flag/services/feature-flag.service");
const _twentyconfigservice = require("../../../core-modules/twenty-config/twenty-config.service");
const _datasourceservice = require("../../../metadata-modules/data-source/data-source.service");
const _workspacemanyorallflatentitymapscacheservice = require("../../../metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _objectmetadataservice = require("../../../metadata-modules/object-metadata/object-metadata.service");
const _workspacecachestorageservice = require("../../../workspace-cache-storage/workspace-cache-storage.service");
describe('WorkspaceSchemaFactory', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _workspaceschemafactory.WorkspaceSchemaFactory,
                {
                    provide: _datasourceservice.DataSourceService,
                    useValue: {}
                },
                {
                    provide: _objectmetadataservice.ObjectMetadataService,
                    useValue: {}
                },
                {
                    provide: _scalarsexplorerservice.ScalarsExplorerService,
                    useValue: {}
                },
                {
                    provide: _workspacegraphqlschemafactory.WorkspaceGraphQLSchemaGenerator,
                    useValue: {}
                },
                {
                    provide: _workspaceresolverfactory.WorkspaceResolverFactory,
                    useValue: {}
                },
                {
                    provide: _workspacecachestorageservice.WorkspaceCacheStorageService,
                    useValue: {}
                },
                {
                    provide: _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
                    useValue: {}
                },
                {
                    provide: _featureflagservice.FeatureFlagService,
                    useValue: {}
                },
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: {}
                }
            ]
        }).compile();
        service = module.get(_workspaceschemafactory.WorkspaceSchemaFactory);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=workspace.factory.spec.js.map