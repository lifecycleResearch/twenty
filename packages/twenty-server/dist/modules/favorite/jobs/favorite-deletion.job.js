"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FavoriteDeletionJob", {
    enumerable: true,
    get: function() {
        return FavoriteDeletionJob;
    }
});
const _common = require("@nestjs/common");
const _processdecorator = require("../../../engine/core-modules/message-queue/decorators/process.decorator");
const _processordecorator = require("../../../engine/core-modules/message-queue/decorators/processor.decorator");
const _messagequeueconstants = require("../../../engine/core-modules/message-queue/message-queue.constants");
const _favoritedeletionservice = require("../services/favorite-deletion.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FavoriteDeletionJob = class FavoriteDeletionJob {
    async handle(data) {
        await this.favoriteDeletionService.deleteFavoritesForDeletedRecords(data.deletedRecordIds, data.workspaceId);
    }
    constructor(favoriteDeletionService){
        this.favoriteDeletionService = favoriteDeletionService;
    }
};
_ts_decorate([
    (0, _processdecorator.Process)(FavoriteDeletionJob.name),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FavoriteDeletionJobData === "undefined" ? Object : FavoriteDeletionJobData
    ]),
    _ts_metadata("design:returntype", Promise)
], FavoriteDeletionJob.prototype, "handle", null);
FavoriteDeletionJob = _ts_decorate([
    (0, _processordecorator.Processor)({
        queueName: _messagequeueconstants.MessageQueue.deleteCascadeQueue,
        scope: _common.Scope.REQUEST
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _favoritedeletionservice.FavoriteDeletionService === "undefined" ? Object : _favoritedeletionservice.FavoriteDeletionService
    ])
], FavoriteDeletionJob);

//# sourceMappingURL=favorite-deletion.job.js.map