"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FileAIChatModule", {
    enumerable: true,
    get: function() {
        return FileAIChatModule;
    }
});
const _common = require("@nestjs/common");
const _applicationmodule = require("../../application/application.module");
const _fileaichatresolver = require("./resolvers/file-ai-chat.resolver");
const _fileaichatservice = require("./services/file-ai-chat.service");
const _fileurlmodule = require("../file-url/file-url.module");
const _permissionsmodule = require("../../../metadata-modules/permissions/permissions.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let FileAIChatModule = class FileAIChatModule {
};
FileAIChatModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _fileurlmodule.FileUrlModule,
            _applicationmodule.ApplicationModule,
            _permissionsmodule.PermissionsModule
        ],
        providers: [
            _fileaichatservice.FileAIChatService,
            _fileaichatresolver.FileAIChatResolver
        ],
        exports: [
            _fileaichatservice.FileAIChatService
        ]
    })
], FileAIChatModule);

//# sourceMappingURL=file-ai-chat.module.js.map