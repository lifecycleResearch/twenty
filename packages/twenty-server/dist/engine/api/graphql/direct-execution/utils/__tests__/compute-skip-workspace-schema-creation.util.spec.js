"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphql = require("graphql");
const _computeskipworkspaceschemacreationutil = require("../compute-skip-workspace-schema-creation.util");
const GENERATED_RESOLVERS = new Set([
    'findManyCompanies',
    'findOneCompany',
    'createOneCompany',
    'findManyPeople',
    'findOnePerson'
]);
describe('computeSkipWorkspaceSchemaCreation', ()=>{
    it('should return true when all fields are core resolvers', ()=>{
        const query = `
      query {
        currentWorkspace { id }
      }
    `;
        expect((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(query, (0, _graphql.parse)(query), undefined, GENERATED_RESOLVERS)).toBe(true);
    });
    it('should return true for multiple core resolver fields', ()=>{
        const query = `
      query {
        currentWorkspace { id }
        currentUser { id }
      }
    `;
        expect((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(query, (0, _graphql.parse)(query), undefined, GENERATED_RESOLVERS)).toBe(true);
    });
    it('should return true when all fields are generated workspace resolvers', ()=>{
        const query = `
      query {
        findManyCompanies { id name }
      }
    `;
        expect((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(query, (0, _graphql.parse)(query), undefined, GENERATED_RESOLVERS)).toBe(true);
    });
    it('should return false for mixed queries', ()=>{
        const query = `
      query {
        findManyCompanies { id }
        currentWorkspace { id }
      }
    `;
        expect((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(query, (0, _graphql.parse)(query), undefined, GENERATED_RESOLVERS)).toBe(false);
    });
    it('should return false for __schema introspection', ()=>{
        const query = `
      query {
        __schema { types { name } }
      }
    `;
        expect((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(query, (0, _graphql.parse)(query), undefined, GENERATED_RESOLVERS)).toBe(false);
    });
    it('should return false for __type introspection', ()=>{
        const query = `
      query {
        __type(name: "Company") { name fields { name } }
      }
    `;
        expect((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(query, (0, _graphql.parse)(query), undefined, GENERATED_RESOLVERS)).toBe(false);
    });
    it('should not treat __typename as introspection', ()=>{
        const query = `
      query {
        currentWorkspace { id __typename }
      }
    `;
        expect((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(query, (0, _graphql.parse)(query), undefined, GENERATED_RESOLVERS)).toBe(true);
    });
    it('should return true when no operation matches (no fields to check)', ()=>{
        const query = `
      query GetCompanies { findManyCompanies { id } }
    `;
        expect((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(query, (0, _graphql.parse)(query), 'NonExistent', GENERATED_RESOLVERS)).toBe(true);
    });
    it('should respect operationName', ()=>{
        const query = `
      query CoreQuery {
        currentWorkspace { id }
      }
      query WorkspaceQuery {
        findManyCompanies { id }
      }
    `;
        expect((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(query, (0, _graphql.parse)(query), 'CoreQuery', GENERATED_RESOLVERS)).toBe(true);
        expect((0, _computeskipworkspaceschemacreationutil.computeSkipWorkspaceSchemaCreation)(query, (0, _graphql.parse)(query), 'WorkspaceQuery', GENERATED_RESOLVERS)).toBe(true);
    });
});

//# sourceMappingURL=compute-skip-workspace-schema-creation.util.spec.js.map