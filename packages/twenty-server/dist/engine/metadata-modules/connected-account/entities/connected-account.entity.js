"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ConnectedAccountEntity", {
    enumerable: true,
    get: function() {
        return ConnectedAccountEntity;
    }
});
const _typeorm = require("typeorm");
const _workspacerelatedentity = require("../../../workspace-manager/types/workspace-related-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ConnectedAccountEntity = class ConnectedAccountEntity extends _workspacerelatedentity.WorkspaceRelatedEntity {
};
_ts_decorate([
    (0, _typeorm.PrimaryGeneratedColumn)('uuid'),
    _ts_metadata("design:type", String)
], ConnectedAccountEntity.prototype, "id", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ConnectedAccountEntity.prototype, "handle", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ConnectedAccountEntity.prototype, "provider", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ConnectedAccountEntity.prototype, "accessToken", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ConnectedAccountEntity.prototype, "refreshToken", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ConnectedAccountEntity.prototype, "lastCredentialsRefreshedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ConnectedAccountEntity.prototype, "authFailedAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        array: true,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ConnectedAccountEntity.prototype, "handleAliases", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'varchar',
        array: true,
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ConnectedAccountEntity.prototype, "scopes", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ConnectedAccountEntity.prototype, "connectionParameters", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'timestamptz',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ConnectedAccountEntity.prototype, "lastSignedInAt", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'jsonb',
        nullable: true
    }),
    _ts_metadata("design:type", Object)
], ConnectedAccountEntity.prototype, "oidcTokenClaims", void 0);
_ts_decorate([
    (0, _typeorm.Column)({
        type: 'uuid',
        nullable: false
    }),
    _ts_metadata("design:type", String)
], ConnectedAccountEntity.prototype, "userWorkspaceId", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)('MessageChannelEntity', (messageChannel)=>messageChannel.connectedAccount),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ConnectedAccountEntity.prototype, "messageChannels", void 0);
_ts_decorate([
    (0, _typeorm.OneToMany)('CalendarChannelEntity', (calendarChannel)=>calendarChannel.connectedAccount),
    _ts_metadata("design:type", typeof Relation === "undefined" ? Object : Relation)
], ConnectedAccountEntity.prototype, "calendarChannels", void 0);
_ts_decorate([
    (0, _typeorm.CreateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ConnectedAccountEntity.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _typeorm.UpdateDateColumn)({
        type: 'timestamptz'
    }),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], ConnectedAccountEntity.prototype, "updatedAt", void 0);
ConnectedAccountEntity = _ts_decorate([
    (0, _typeorm.Entity)({
        name: 'connectedAccount',
        schema: 'core'
    })
], ConnectedAccountEntity);

//# sourceMappingURL=connected-account.entity.js.map