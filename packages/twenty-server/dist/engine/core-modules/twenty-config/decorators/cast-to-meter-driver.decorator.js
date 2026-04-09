"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CastToMeterDriverArray", {
    enumerable: true,
    get: function() {
        return CastToMeterDriverArray;
    }
});
const _classtransformer = require("class-transformer");
const _meterdrivertype = require("../../metrics/types/meter-driver.type");
const CastToMeterDriverArray = ()=>(0, _classtransformer.Transform)(({ value })=>toMeterDriverArray(value));
const toMeterDriverArray = (value)=>{
    if (typeof value === 'string') {
        const rawMeterDrivers = value.split(',').map((driver)=>driver.trim());
        const isInvalid = rawMeterDrivers.some((driver)=>!Object.values(_meterdrivertype.MeterDriver).includes(driver));
        if (!isInvalid) {
            return rawMeterDrivers;
        }
    }
    return undefined;
};

//# sourceMappingURL=cast-to-meter-driver.decorator.js.map