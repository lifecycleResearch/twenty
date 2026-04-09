"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuditService", {
    enumerable: true,
    get: function() {
        return AuditService;
    }
});
const _common = require("@nestjs/common");
const _clickHouseservice = require("../../../../database/clickHouse/clickHouse.service");
const _auditexception = require("../audit.exception");
const _analyticsutils = require("../utils/analytics.utils");
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
let AuditService = class AuditService {
    createContext(context) {
        const contextFields = context ? {
            ...context.workspaceId ? {
                workspaceId: context.workspaceId
            } : {},
            ...context.userId ? {
                userId: context.userId
            } : {}
        } : {};
        return {
            insertWorkspaceEvent: (event, properties)=>this.preventIfDisabled(()=>this.clickHouseService.insert('workspaceEvent', [
                        {
                            ...contextFields,
                            ...(0, _analyticsutils.makeTrackEvent)(event, properties)
                        }
                    ])),
            createObjectEvent: (event, properties)=>{
                const { recordId, objectMetadataId, isCustom, ...restProperties } = properties;
                return this.preventIfDisabled(()=>this.clickHouseService.insert('objectEvent', [
                        {
                            ...contextFields,
                            ...(0, _analyticsutils.makeTrackEvent)(event, restProperties),
                            recordId,
                            objectMetadataId,
                            isCustom
                        }
                    ]));
            },
            createPageviewEvent: (name, properties)=>this.preventIfDisabled(()=>this.clickHouseService.insert('pageview', [
                        {
                            ...contextFields,
                            ...(0, _analyticsutils.makePageview)(name, properties)
                        }
                    ]))
        };
    }
    preventIfDisabled(sendEventOrPageviewFunction) {
        if (!this.twentyConfigService.get('CLICKHOUSE_URL')) {
            return {
                success: true
            };
        }
        try {
            return sendEventOrPageviewFunction();
        } catch (err) {
            return new _auditexception.AuditException(err, _auditexception.AuditExceptionCode.INVALID_INPUT);
        }
    }
    constructor(twentyConfigService, clickHouseService){
        this.twentyConfigService = twentyConfigService;
        this.clickHouseService = clickHouseService;
    }
};
AuditService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _clickHouseservice.ClickHouseService === "undefined" ? Object : _clickHouseservice.ClickHouseService
    ])
], AuditService);

//# sourceMappingURL=audit.service.js.map