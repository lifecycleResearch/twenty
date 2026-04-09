"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get AccountType () {
        return AccountType;
    },
    get ConnectionParameters () {
        return ConnectionParameters;
    },
    get ConnectionParametersDTO () {
        return ConnectionParametersDTO;
    },
    get EmailAccountConnectionParameters () {
        return EmailAccountConnectionParameters;
    },
    get ImapSmtpCaldavConnectionParametersDTO () {
        return ImapSmtpCaldavConnectionParametersDTO;
    }
});
const _graphql = require("@nestjs/graphql");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AccountType = class AccountType {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], AccountType.prototype, "type", void 0);
AccountType = _ts_decorate([
    (0, _graphql.InputType)()
], AccountType);
let ConnectionParameters = class ConnectionParameters {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], ConnectionParameters.prototype, "host", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Number),
    _ts_metadata("design:type", Number)
], ConnectionParameters.prototype, "port", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ConnectionParameters.prototype, "username", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], ConnectionParameters.prototype, "password", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], ConnectionParameters.prototype, "secure", void 0);
ConnectionParameters = _ts_decorate([
    (0, _graphql.InputType)()
], ConnectionParameters);
let EmailAccountConnectionParameters = class EmailAccountConnectionParameters {
};
_ts_decorate([
    (0, _graphql.Field)(()=>ConnectionParameters, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof ConnectionParameters === "undefined" ? Object : ConnectionParameters)
], EmailAccountConnectionParameters.prototype, "IMAP", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>ConnectionParameters, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof ConnectionParameters === "undefined" ? Object : ConnectionParameters)
], EmailAccountConnectionParameters.prototype, "SMTP", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>ConnectionParameters, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof ConnectionParameters === "undefined" ? Object : ConnectionParameters)
], EmailAccountConnectionParameters.prototype, "CALDAV", void 0);
EmailAccountConnectionParameters = _ts_decorate([
    (0, _graphql.InputType)()
], EmailAccountConnectionParameters);
let ConnectionParametersDTO = class ConnectionParametersDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], ConnectionParametersDTO.prototype, "host", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Number),
    _ts_metadata("design:type", Number)
], ConnectionParametersDTO.prototype, "port", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String, {
        nullable: true
    }),
    _ts_metadata("design:type", String)
], ConnectionParametersDTO.prototype, "username", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], ConnectionParametersDTO.prototype, "password", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>Boolean, {
        nullable: true
    }),
    _ts_metadata("design:type", Boolean)
], ConnectionParametersDTO.prototype, "secure", void 0);
ConnectionParametersDTO = _ts_decorate([
    (0, _graphql.ObjectType)('ConnectionParametersOutput')
], ConnectionParametersDTO);
let ImapSmtpCaldavConnectionParametersDTO = class ImapSmtpCaldavConnectionParametersDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>ConnectionParametersDTO, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof ConnectionParametersDTO === "undefined" ? Object : ConnectionParametersDTO)
], ImapSmtpCaldavConnectionParametersDTO.prototype, "IMAP", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>ConnectionParametersDTO, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof ConnectionParametersDTO === "undefined" ? Object : ConnectionParametersDTO)
], ImapSmtpCaldavConnectionParametersDTO.prototype, "SMTP", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>ConnectionParametersDTO, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof ConnectionParametersDTO === "undefined" ? Object : ConnectionParametersDTO)
], ImapSmtpCaldavConnectionParametersDTO.prototype, "CALDAV", void 0);
ImapSmtpCaldavConnectionParametersDTO = _ts_decorate([
    (0, _graphql.ObjectType)('ImapSmtpCaldavConnectionParameters')
], ImapSmtpCaldavConnectionParametersDTO);

//# sourceMappingURL=imap-smtp-caldav-connection.dto.js.map