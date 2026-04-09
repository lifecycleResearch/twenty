/* oxlint-disable no-console */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommandLogger", {
    enumerable: true,
    get: function() {
        return CommandLogger;
    }
});
const _common = require("@nestjs/common");
const _fs = require("fs");
const _promises = /*#__PURE__*/ _interop_require_default(require("node:fs/promises"));
const _path = require("path");
const _kebabcase = require("../utils/kebab-case");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CommandLogger = class CommandLogger {
    async createSubDirectory(subDirectory) {
        const path = `./logs/${(0, _kebabcase.kebabCase)(this.className)}/${subDirectory}`;
        if ((0, _fs.existsSync)(path) === false) {
            await _promises.default.mkdir(path, {
                recursive: true
            });
        }
        return;
    }
    async writeLog(fileName, data, append = false) {
        const path = `./logs/${(0, _kebabcase.kebabCase)(this.className)}`;
        if ((0, _fs.existsSync)(path) === false) {
            await _promises.default.mkdir(path, {
                recursive: true
            });
        }
        try {
            const logFilePath = `${path}/${fileName}.json`;
            await _promises.default.writeFile(logFilePath, JSON.stringify(data, null, 2), {
                flag: append ? 'a' : 'w'
            });
            const absoluteLogFilePath = (0, _path.join)(process.cwd(), logFilePath);
            return absoluteLogFilePath;
        } catch (err) {
            console.error(`Error writing to file ${path}/${fileName}.json: ${err?.message}`);
            throw err;
        }
    }
    constructor(className){
        this.className = className;
    }
};
CommandLogger = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ])
], CommandLogger);

//# sourceMappingURL=command-logger.js.map