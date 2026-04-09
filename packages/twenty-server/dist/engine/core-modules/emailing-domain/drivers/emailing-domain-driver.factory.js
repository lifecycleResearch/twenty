"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailingDomainDriverFactory", {
    enumerable: true,
    get: function() {
        return EmailingDomainDriverFactory;
    }
});
const _common = require("@nestjs/common");
const _awssesclientprovider = require("./aws-ses/providers/aws-ses-client.provider");
const _awssesdriverservice = require("./aws-ses/services/aws-ses-driver.service");
const _awsseshandleerrorservice = require("./aws-ses/services/aws-ses-handle-error.service");
const _emailingdomain = require("./types/emailing-domain");
const _dynamicfactorybase = require("../../twenty-config/dynamic-factory.base");
const _configvariablesgroupenum = require("../../twenty-config/enums/config-variables-group.enum");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EmailingDomainDriverFactory = class EmailingDomainDriverFactory extends _dynamicfactorybase.DriverFactoryBase {
    buildConfigKey() {
        const driver = _emailingdomain.EmailingDomainDriver.AWS_SES;
        if (driver === _emailingdomain.EmailingDomainDriver.AWS_SES) {
            const awsConfigHash = this.getConfigGroupHash(_configvariablesgroupenum.ConfigVariablesGroup.AWS_SES_SETTINGS);
            return `aws-ses|${awsConfigHash}`;
        }
        throw new Error(`Unsupported emailing domain driver: ${driver}`);
    }
    createDriver() {
        const driver = _emailingdomain.EmailingDomainDriver.AWS_SES;
        switch(driver){
            case _emailingdomain.EmailingDomainDriver.AWS_SES:
                {
                    const region = this.twentyConfigService.get('AWS_SES_REGION');
                    const accountId = this.twentyConfigService.get('AWS_SES_ACCOUNT_ID');
                    const accessKeyId = this.twentyConfigService.get('AWS_SES_ACCESS_KEY_ID');
                    const secretAccessKey = this.twentyConfigService.get('AWS_SES_SECRET_ACCESS_KEY');
                    const sessionToken = this.twentyConfigService.get('AWS_SES_SESSION_TOKEN');
                    const awsConfig = {
                        driver: _emailingdomain.EmailingDomainDriver.AWS_SES,
                        region,
                        accountId,
                        accessKeyId,
                        secretAccessKey,
                        sessionToken
                    };
                    return new _awssesdriverservice.AwsSesDriver(awsConfig, this.awsSesClientProvider, this.awsSesHandleErrorService);
                }
            default:
                throw new Error(`Invalid emailing domain driver: ${driver}`);
        }
    }
    constructor(twentyConfigService, awsSesClientProvider, awsSesHandleErrorService){
        super(twentyConfigService), this.awsSesClientProvider = awsSesClientProvider, this.awsSesHandleErrorService = awsSesHandleErrorService;
    }
};
EmailingDomainDriverFactory = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _awssesclientprovider.AwsSesClientProvider === "undefined" ? Object : _awssesclientprovider.AwsSesClientProvider,
        typeof _awsseshandleerrorservice.AwsSesHandleErrorService === "undefined" ? Object : _awsseshandleerrorservice.AwsSesHandleErrorService
    ])
], EmailingDomainDriverFactory);

//# sourceMappingURL=emailing-domain-driver.factory.js.map