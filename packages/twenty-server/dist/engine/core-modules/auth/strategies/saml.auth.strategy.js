/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SamlAuthStrategy", {
    enumerable: true,
    get: function() {
        return SamlAuthStrategy;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
const _passportsaml = require("@node-saml/passport-saml");
const _classvalidator = require("class-validator");
const _authexception = require("../auth.exception");
const _ssoservice = require("../../sso/services/sso.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let SamlAuthStrategy = class SamlAuthStrategy extends (0, _passport.PassportStrategy)(_passportsaml.MultiSamlStrategy, 'saml') {
    authenticate(req, options) {
        super.authenticate(req, {
            ...options,
            additionalParams: {
                RelayState: JSON.stringify({
                    identityProviderId: req.params.identityProviderId,
                    ...req.query.workspaceInviteHash ? {
                        workspaceInviteHash: req.query.workspaceInviteHash
                    } : {}
                })
            }
        });
    }
    extractState(req) {
        try {
            if ('RelayState' in req.body && typeof req.body.RelayState === 'string') {
                const RelayState = JSON.parse(req.body.RelayState);
                return {
                    identityProviderId: RelayState.identityProviderId,
                    workspaceInviteHash: RelayState.workspaceInviteHash
                };
            }
            throw new Error();
        } catch  {
            throw new _authexception.AuthException('Invalid state', _authexception.AuthExceptionCode.INVALID_INPUT);
        }
    }
    constructor(sSOService){
        super({
            getSamlOptions: (req, callback)=>{
                this.sSOService.findSSOIdentityProviderById(req.params.identityProviderId).then((identityProvider)=>{
                    if (identityProvider && this.sSOService.isSAMLIdentityProvider(identityProvider)) {
                        // IdP metadata XML typically has whitespace-formatted certificates
                        const sanitizedCertificate = identityProvider.certificate.replace(/\s/g, '');
                        const config = {
                            entryPoint: identityProvider.ssoURL,
                            issuer: this.sSOService.buildIssuerURL(identityProvider),
                            callbackUrl: this.sSOService.buildCallbackUrl(identityProvider),
                            idpCert: sanitizedCertificate,
                            wantAssertionsSigned: true,
                            wantAuthnResponseSigned: false,
                            disableRequestedAuthnContext: true,
                            signatureAlgorithm: 'sha256'
                        };
                        return callback(null, config);
                    }
                    // TODO: improve error management
                    return callback(new Error('Invalid SAML identity provider'));
                }).catch((err)=>{
                    // TODO: improve error management
                    return callback(err);
                });
            },
            passReqToCallback: true
        }, async (request, profile, done)=>{
            await this.validate(request, profile, done);
        }), this.sSOService = sSOService, this.validate = async (request, profile, done)=>{
            try {
                if (!profile) {
                    return done(new Error('Profile is must be provided'));
                }
                const email = profile.email ?? profile.mail ?? profile.nameID;
                if (!(0, _classvalidator.isEmail)(email)) {
                    return done(new Error('Invalid email'));
                }
                const state = this.extractState(request);
                done(null, {
                    ...state,
                    email
                });
            } catch (err) {
                done(err);
            }
        };
    }
};
SamlAuthStrategy = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _ssoservice.SSOService === "undefined" ? Object : _ssoservice.SSOService
    ])
], SamlAuthStrategy);

//# sourceMappingURL=saml.auth.strategy.js.map