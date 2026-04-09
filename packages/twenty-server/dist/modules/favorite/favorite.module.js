"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FavoriteModule", {
    enumerable: true,
    get: function() {
        return FavoriteModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _fieldmetadataentity = require("../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _objectmetadataentity = require("../../engine/metadata-modules/object-metadata/object-metadata.entity");
const _favoritedeletionjob = require("./jobs/favorite-deletion.job");
const _favoritedeletionlistener = require("./listeners/favorite-deletion.listener");
const _favoritedeletionservice = require("./services/favorite-deletion.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FavoriteModule = class FavoriteModule {
};
FavoriteModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _objectmetadataentity.ObjectMetadataEntity,
                _fieldmetadataentity.FieldMetadataEntity
            ])
        ],
        providers: [
            _favoritedeletionservice.FavoriteDeletionService,
            _favoritedeletionlistener.FavoriteDeletionListener,
            _favoritedeletionjob.FavoriteDeletionJob
        ],
        exports: []
    })
], FavoriteModule);

//# sourceMappingURL=favorite.module.js.map