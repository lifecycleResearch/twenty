"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DriverFactoryBase", {
    enumerable: true,
    get: function() {
        return DriverFactoryBase;
    }
});
const _crypto = require("crypto");
const _configvariables = require("./config-variables");
const _typedreflect = require("../../../utils/typed-reflect");
let DriverFactoryBase = class DriverFactoryBase {
    getCurrentDriver() {
        let configKey;
        try {
            configKey = this.buildConfigKey();
        } catch (error) {
            throw new Error(`Failed to build config key for ${this.constructor.name}. Original error: ${error instanceof Error ? error.message : String(error)}`);
        }
        if (this.currentConfigKey !== configKey) {
            try {
                this.currentDriver = this.createDriver();
            } catch (error) {
                throw new Error(`Failed to create driver for ${this.constructor.name} with config key: ${configKey}. Original error: ${error instanceof Error ? error.message : String(error)}`);
            }
            this.currentConfigKey = configKey;
        }
        if (!this.currentDriver) {
            throw new Error(`Failed to create driver for ${this.constructor.name} with config key: ${configKey}`);
        }
        return this.currentDriver;
    }
    getConfigGroupHash(group) {
        const groupVariables = this.getConfigVariablesByGroup(group);
        const configValues = groupVariables.map((key)=>`${key}=${this.twentyConfigService.get(key)}`).sort().join('|');
        return (0, _crypto.createHash)('sha256').update(configValues).digest('hex').substring(0, 16);
    }
    getConfigVariablesByGroup(group) {
        const metadata = _typedreflect.TypedReflect.getMetadata('config-variables', _configvariables.ConfigVariables) ?? {};
        return Object.keys(metadata).filter((key)=>metadata[key]?.group === group).map((key)=>key);
    }
    constructor(twentyConfigService){
        this.twentyConfigService = twentyConfigService;
        this.currentDriver = null;
        this.currentConfigKey = null;
    }
};

//# sourceMappingURL=dynamic-factory.base.js.map