"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MetadataQueryBuilderFactory", {
    enumerable: true,
    get: function() {
        return MetadataQueryBuilderFactory;
    }
});
const _common = require("@nestjs/common");
const _getmetadatavariablesfactory = require("./factories/get-metadata-variables.factory");
const _findonemetadataqueryfactory = require("./factories/find-one-metadata-query.factory");
const _findmanymetadataqueryfactory = require("./factories/find-many-metadata-query.factory");
const _parsemetadatapathutils = require("./utils/parse-metadata-path.utils");
const _createmetadataqueryfactory = require("./factories/create-metadata-query.factory");
const _updatemetadataqueryfactory = require("./factories/update-metadata-query.factory");
const _deletemetadataqueryfactory = require("./factories/delete-metadata-query.factory");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MetadataQueryBuilderFactory = class MetadataQueryBuilderFactory {
    async get(request, selectors) {
        const { id, objectNameSingular, objectNamePlural } = (0, _parsemetadatapathutils.parseMetadataPath)(request.path);
        return {
            query: id ? this.findOneQueryFactory.create(objectNameSingular, objectNamePlural, selectors) : this.findManyQueryFactory.create(objectNamePlural, selectors),
            variables: this.getMetadataVariablesFactory.create(id, request)
        };
    }
    async create({ path, body }, selectors) {
        const { objectNameSingular, objectNamePlural } = (0, _parsemetadatapathutils.parseMetadataPath)(path);
        return {
            query: this.createQueryFactory.create(objectNameSingular, objectNamePlural, selectors),
            variables: {
                input: {
                    [objectNameSingular]: body
                }
            }
        };
    }
    async update(request, selectors) {
        const { objectNameSingular, objectNamePlural, id } = (0, _parsemetadatapathutils.parseMetadataPath)(request.path);
        if (!id) {
            throw new _common.BadRequestException(`update ${objectNameSingular} query invalid. Id missing. eg: /rest/metadata/${objectNameSingular}/0d4389ef-ea9c-4ae8-ada1-1cddc440fb56`);
        }
        return {
            query: this.updateQueryFactory.create(objectNameSingular, objectNamePlural, selectors),
            variables: {
                input: {
                    update: request.body,
                    id
                }
            }
        };
    }
    async delete(request) {
        const { objectNameSingular, id } = (0, _parsemetadatapathutils.parseMetadataPath)(request.path);
        if (!id) {
            throw new _common.BadRequestException(`delete ${objectNameSingular} query invalid. Id missing. eg: /rest/metadata/${objectNameSingular}/0d4389ef-ea9c-4ae8-ada1-1cddc440fb56`);
        }
        return {
            query: this.deleteQueryFactory.create(objectNameSingular),
            variables: {
                input: {
                    id
                }
            }
        };
    }
    constructor(findOneQueryFactory, findManyQueryFactory, createQueryFactory, updateQueryFactory, deleteQueryFactory, getMetadataVariablesFactory){
        this.findOneQueryFactory = findOneQueryFactory;
        this.findManyQueryFactory = findManyQueryFactory;
        this.createQueryFactory = createQueryFactory;
        this.updateQueryFactory = updateQueryFactory;
        this.deleteQueryFactory = deleteQueryFactory;
        this.getMetadataVariablesFactory = getMetadataVariablesFactory;
    }
};
MetadataQueryBuilderFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _findonemetadataqueryfactory.FindOneMetadataQueryFactory === "undefined" ? Object : _findonemetadataqueryfactory.FindOneMetadataQueryFactory,
        typeof _findmanymetadataqueryfactory.FindManyMetadataQueryFactory === "undefined" ? Object : _findmanymetadataqueryfactory.FindManyMetadataQueryFactory,
        typeof _createmetadataqueryfactory.CreateMetadataQueryFactory === "undefined" ? Object : _createmetadataqueryfactory.CreateMetadataQueryFactory,
        typeof _updatemetadataqueryfactory.UpdateMetadataQueryFactory === "undefined" ? Object : _updatemetadataqueryfactory.UpdateMetadataQueryFactory,
        typeof _deletemetadataqueryfactory.DeleteMetadataQueryFactory === "undefined" ? Object : _deletemetadataqueryfactory.DeleteMetadataQueryFactory,
        typeof _getmetadatavariablesfactory.GetMetadataVariablesFactory === "undefined" ? Object : _getmetadatavariablesfactory.GetMetadataVariablesFactory
    ])
], MetadataQueryBuilderFactory);

//# sourceMappingURL=metadata-query-builder.factory.js.map