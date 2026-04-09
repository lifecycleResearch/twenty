"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedImapSmtpCaldavAccountDTO", {
    enumerable: true,
    get: function() {
        return ConnectedImapSmtpCaldavAccountDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _types = require("twenty-shared/types");
const _scalars = require("../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _imapsmtpcaldavconnectiondto = require("./imap-smtp-caldav-connection.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ConnectedImapSmtpCaldavAccountDTO = class ConnectedImapSmtpCaldavAccountDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], ConnectedImapSmtpCaldavAccountDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], ConnectedImapSmtpCaldavAccountDTO.prototype, "handle", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", typeof _types.ConnectedAccountProvider === "undefined" ? Object : _types.ConnectedAccountProvider)
], ConnectedImapSmtpCaldavAccountDTO.prototype, "provider", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], ConnectedImapSmtpCaldavAccountDTO.prototype, "accountOwnerId", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_imapsmtpcaldavconnectiondto.ImapSmtpCaldavConnectionParametersDTO, {
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ConnectedImapSmtpCaldavAccountDTO.prototype, "connectionParameters", void 0);
ConnectedImapSmtpCaldavAccountDTO = _ts_decorate([
    (0, _graphql.ObjectType)('ConnectedImapSmtpCaldavAccount')
], ConnectedImapSmtpCaldavAccountDTO);

//# sourceMappingURL=imap-smtp-caldav-connected-account.dto.js.map